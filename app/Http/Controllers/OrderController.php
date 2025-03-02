<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Inventory;
use App\Models\Order;
use App\Models\Shipping;
use App\Models\User;
use App\Notifications\StatusNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\PDF;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('shipping')->orderBy('id', 'DESC')->paginate(10);
        return Inertia::render('Dashboard/Order/Index', [
            'orders' => [
                'data' => $orders->items(), // Los productos
                'current_page' => $orders->currentPage(), // Página actual
                'last_page' => $orders->lastPage(), // Última página
                'per_page' => $orders->perPage(), // Elementos por página
                'total' => $orders->total(), // Total de elementos
            ],
        ]);
    }

    public function store(Request $request)
    {
        $order_data = $request->validate([
            'first_name'      => 'required|string|min:3|max:50|regex:/^[\pL\s]+$/u',
            'last_name'       => 'required|string|min:3|max:50|regex:/^[\pL\s]+$/u',
            'email'           => 'required|string|email|max:255',
            'phone'           => 'required|string|regex:/^[0-9]+$/|min:7|max:15',
            'address1'        => 'required|string|max:255',
            'address2'        => 'nullable|string|max:255',
            'coupon'          => 'nullable|string|max:15',
            'post_code'       => 'nullable|string|max:10',
            "sub_total"       => 'required|numeric|min:0',
            "total_amount"    => 'required|numeric|min:0',
            "shipping_id"     => 'required|integer|exists:shippings,id',
            "payment_method"  => 'required|string|in:cod,paypal',
            "country"         => "required|string|min:2",
        ]);
        try {
            $userId = Auth::id();
            // Verificar si el carrito está vacío sin cargar datos innecesarios
            if (!Cart::where('user_id', $userId)->whereNull('order_id')->exists()) {
                return redirect()->back()->with('error', 'Tu carrito está vacío.');
            }
            // Obtener costo de envío de manera eficiente
            $shippingPrice = Shipping::where('id', $order_data['shipping_id'])->value('price') ?? 0;
            // Crear orden
            $order = Order::create([
                'order_number'   => 'ORD-' . strtoupper(Str::random(10)),
                'user_id'        => $userId,
                'sub_total'      => $order_data['sub_total'],
                'shipping_id'    => $order_data['shipping_id'],
                'coupon'         => $order_data['coupon'] ?? null,
                'total_amount'   => $order_data['total_amount'] + $shippingPrice,
                'quantity'       => Cart::where('user_id', $userId)->whereNull('order_id')->sum('quantity'),
                'payment_method' => $order_data['payment_method'],
                'payment_status' => $order_data['payment_method'] === 'paypal' ? 'paid' : 'unpaid',
                'status'         => "new",
                'first_name'     => $order_data['first_name'],
                'last_name'      => $order_data['last_name'],
                'email'          => $order_data['email'],
                'phone'          => $order_data['phone'],
                'country'        => $order_data['country'],
                'post_code'      => $order_data['post_code'],
                'address1'       => $order_data['address1'],
                'address2'       => $order_data['address2']
            ]);

            // Enviar notificación si hay administradores
            if ($admin = User::where('role', 'admin')->first()) {
                Notification::send($admin, new StatusNotification([
                    'title'     => 'Nuevo pedido creado',
                    'actionURL' => route('order.show', $order->id),
                    'fas'       => 'fa-file-alt'
                ]));
            }
            // Asociar carrito con la orden
            $carts = Cart::where('user_id', $userId)->whereNull('order_id')->get();

            foreach ($carts as $cart) {
                $this->updateStockInventory($cart->inventary_id, $cart->quantity);
            }

            // Luego de actualizar stock, asignar la orden al carrito
            Cart::where('user_id', $userId)->whereNull('order_id')->update(['order_id' => $order->id]);

            // Redirigir según el método de pago
            //return ($order_data['payment_method'] === 'paypal') ? redirect()->route('payment')->with(['id' => $order->id]) : 
            return redirect()->route('home')->with('success', 'Su producto ha sido colocado exitosamente en la orden.');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return redirect()->back()->with('error', 'Ocurrió un error al procesar la orden.');
        }
    }

    public function updateStockInventory($id, $quantity)
    {
        $item = Inventory::find($id);
        if (!$item) {
            return response()->json(['error' => 'Inventario no encontrado'], 400);
        }

        if ($item->quantity < $quantity) {
            return response()->json(['error' => 'Stock insuficiente'], 400);
        }

        $item->quantity -= $quantity;
        $item->save();
    }

    public function show($id)
    {
        $order = Order::find($id);
        return Inertia::render('Dashboard/Order/Show', ['order' => $order]);
    }

    public function edit($id)
    {
        $order = Order::find($id);
        return view('backend.order.edit')->with('order', $order);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:new,process,delivered,cancel'
        ]);
        $order = Order::findOrFail($id);
        try {
            // Si el estado es 'delivered', actualiza el stock de los productos
            if ($request->status === 'delivered') {
                foreach ($order->cart as $cart) {
                    $product = $cart->product;
                    $product->decrement('stock', $cart->quantity); // Usa decrement para simplificar
                }
            }
            // Actualiza el estado de la orden
            $order->fill($request->all());
            $order->save();

            return response()->json(['status' => 'success', 'message' => 'Successfully updated order']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Error while updating order'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $order = Order::findOrFail($id);

            // Verifica si el estado del pedido es "delivered"
            if ($order->status === 'delivered') {
                return response()->json(['status' => 'error', 'message' => 'Cannot delete an order with status "delivered"'], 400);
            }
            $order->delete();
            return response()->json(['status' => 'success', 'message' => 'Order successfully deleted']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Order cannot be deleted'], 500);
        }
    }

    public function returnOrder($id)
    {
        DB::beginTransaction();
        try {
            $order = Order::findOrFail($id);
            // Verifica que el estado sea "delivered" antes de marcarlo como "returned"
            if ($order->status !== 'delivered') {
                return response()->json(['status' => 'error', 'message' => 'Order must be "delivered" before it can be returned'], 400);
            }

            // Cambia el estado a "returned"
            $order->status = 'returned';
            $order->save();

            // Devuelve el stock
            foreach ($order->cart as $cart) {
                $product = $cart->product;
                $product->increment('stock', $cart->quantity);
            }
            DB::commit();
            return response()->json(['status' => 'success', 'message' => 'Order successfully marked as returned']);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Order cannot be returned'], 500);
        }
    }


    public function orderTrack()
    {
        return view('frontend.pages.order-track');
    }

    public function productTrackOrder(Request $request)
    {
        $order = Order::where('user_id', Auth::id())->where('order_number', $request->order_number)->first();
        if ($order) {
            if ($order->status == "new") {
                return response()->json(['success', 'Su pedido ha sido realizado. espere por favor.'], 200);
            } elseif ($order->status == "process") {
                return response()->json(['success', 'Su pedido está en proceso, espere por favor.'], 200);
            } elseif ($order->status == "delivered") {
                return response()->json(['success', 'Su pedido se entregó con éxito.'], 200);
            } else {
                return response()->json(['error', 'Tu pedido cancelado. por favor intenta de nuevo'], 200);
            }
        } else {
            return response()->json(['error', 'Número de pedido no válido, inténtelo de nuevo.'], 200);
        }
    }

    // PDF generate
    public function pdf(Request $request)
    {
        $order = Order::findOrFail($request->id);
        $file_name = $order->order_number . '-' . $order->first_name . '.pdf';
        $pdf = PDF::loadview('Pdfs.Pdf', compact('order'));

        return Response::make($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $file_name . '"',
        ]);
    }

    // Income chart
    public function incomeChart(Request $request)
    {
        $year = \Carbon\Carbon::now()->year;
        // dd($year);
        $items = Order::with(['cart_info'])->whereYear('created_at', $year)->where('status', 'delivered')->get()
            ->groupBy(function ($d) {
                return \Carbon\Carbon::parse($d->created_at)->format('m');
            });
        // dd($items);
        $result = [];
        foreach ($items as $month => $item_collections) {
            foreach ($item_collections as $item) {
                $amount = $item->cart_info->sum('amount');
                // dd($amount);
                $m = intval($month);
                // return $m;
                isset($result[$m]) ? $result[$m] += $amount : $result[$m] = $amount;
            }
        }
        $data = [];
        for ($i = 1; $i <= 12; $i++) {
            $monthName = date('F', mktime(0, 0, 0, $i, 1));
            $data[$monthName] = (!empty($result[$i])) ? number_format((float)($result[$i]), 2, '.', '') : 0.0;
        }
        return $data;
    }
}
