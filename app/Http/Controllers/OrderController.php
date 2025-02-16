<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Shipping;
use App\Models\User;
use App\Notifications\StatusNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\PDF;
use Illuminate\Http\Request;
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
            //'expiry_date'     => 'nullable|string',
            //'card_number'     => 'nullable|string',
            //'cvv'             => 'nullable|integer|digits:3',
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
            Cart::where('user_id', $userId)->whereNull('order_id')->update(['order_id' => $order->id]);
            // Redirigir según el método de pago
            //return ($order_data['payment_method'] === 'paypal') ? redirect()->route('payment')->with(['id' => $order->id]) : 
            return redirect()->route('home')->with('success', 'Su producto ha sido colocado exitosamente en la orden.');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return redirect()->back()->with('error', 'Ocurrió un error al procesar la orden.');
        }
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
        $order = Order::find($id);
        $this->validate($request, [
            'status' => 'required|in:new,process,delivered,cancel'
        ]);
        $data = $request->all();
        // return $request->status;
        if ($request->status == 'delivered') {
            foreach ($order->cart as $cart) {
                $product = $cart->product;
                // return $product;
                $product->stock -= $cart->quantity;
                $product->save();
            }
        }
        $status = $order->fill($data)->save();
        if ($status) {
            request()->session()->flash('success', 'Successfully updated order');
        } else {
            request()->session()->flash('error', 'Error while updating order');
        }
        return redirect()->route('order.index');
    }

    public function destroy($id)
    {
        $order = Order::find($id);
        if ($order) {
            $status = $order->delete();
            if ($status) {
                request()->session()->flash('success', 'Order Successfully deleted');
            } else {
                request()->session()->flash('error', 'Order can not deleted');
            }
            return redirect()->route('order.index');
        } else {
            request()->session()->flash('error', 'Order can not found');
            return redirect()->back();
        }
    }

    public function orderTrack()
    {
        return view('frontend.pages.order-track');
    }

    public function productTrackOrder(Request $request)
    {
        // return $request->all();
        $order = Order::where('user_id', auth()->user()->id)->where('order_number', $request->order_number)->first();
        if ($order) {
            if ($order->status == "new") {
                request()->session()->flash('success', 'Your order has been placed. please wait.');
                return redirect()->route('home');
            } elseif ($order->status == "process") {
                request()->session()->flash('success', 'Your order is under processing please wait.');
                return redirect()->route('home');
            } elseif ($order->status == "delivered") {
                request()->session()->flash('success', 'Your order is successfully delivered.');
                return redirect()->route('home');
            } else {
                request()->session()->flash('error', 'Your order canceled. please try again');
                return redirect()->route('home');
            }
        } else {
            request()->session()->flash('error', 'Invalid order numer please try again');
            return back();
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
