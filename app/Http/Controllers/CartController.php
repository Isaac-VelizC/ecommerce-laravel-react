<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\Shipping;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    protected $product = null;
    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    public function listCart()
    {
        $userId = Auth::id();
        $cartItems = Cart::with('product')->where(['user_id' => $userId, 'order_id' => null])->get();
        // Formatear la respuesta JSON correctamente
        return response()->json([
            'status' => 'success',
            'items' => $cartItems,
        ], 200);
    }

    public function cart()
    {
        return Inertia::render('Client/Cart');
    }

    public function addToCart($slug)
    {
        $product = Product::where('slug', $slug)->first();
        // Verificar si el producto existe
        if (!$product) {
            return back()->with('error', 'Producto Invalido');
        }
        $userId = Auth::id();
        // Buscar si el producto ya está en el carrito del usuario
        $cartItem = Cart::where([
            'user_id' => $userId,
            'order_id' => null,
            'product_id' => $product->id
        ])->first();

        if ($cartItem) {
            // Si el producto ya está en el carrito, aumentar la cantidad
            $newQuantity = $cartItem->quantity + 1;

            // Verificar si hay suficiente stock
            if ($product->stock < $newQuantity) {
                return back()->with('error', 'Stock insuficiente!');
            }
            // Actualizar la cantidad y el monto en el carrito
            $cartItem->quantity = $newQuantity;
            $cartItem->amount = $product->price * $newQuantity;
            $cartItem->save();
        } else {
            // Si el producto no está en el carrito, crear un nuevo item
            // Calcular el precio con descuento
            $price = $product->price * (1 - $product->discount / 100);

            // Verificar si hay suficiente stock antes de agregar al carrito
            if ($product->stock < 1) {
                return back()->with('error', 'Stock insuficiente!');
            }

            $cartItem = new Cart();
            $cartItem->user_id = $userId;
            $cartItem->product_id = $product->id;
            $cartItem->price = $price;
            $cartItem->quantity = 1;
            $cartItem->amount = $price;
            $cartItem->save();
        }
        $items = Cart::with('product')->where(['user_id' => $userId, 'order_id' => null])->get();

        return response()->json([
            'message' => 'Producto no encontrado en el carrito',
            'cartItems' => $items
        ], 200);
    }

    public function singleAddToCart(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'No estás autenticado'], 401);
        }

        $request->validate([
            'slug'  => 'required|string',
            'quant' => 'required|integer|min:1'
        ]);
        $product = Product::where('slug', $request->slug)->first();
        // Verificar si el producto existe y si hay suficiente stock
        if (!$product) {
            return response()->json(['error' => 'Producto no encontrado'], 404);
        }
        if ($product->stock < $request->quant) {
            return response()->json(['error' => 'Stock insuficiente'], 400);
        }

        $userId = Auth::id();
        $quantity = min($request->quant, $product->stock); // Evita que la cantidad supere el stock
        $discountedPrice = $product->price * (1 - ($product->discount / 100));

        // Buscar si el producto ya está en el carrito
        $cartItem = Cart::where('user_id', $userId)
            ->where('order_id', null)
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            // Actualizar cantidad y total en el carrito
            $cartItem->quantity = min($cartItem->quantity + $quantity, $product->stock);
            $cartItem->amount = $cartItem->quantity * $discountedPrice;
            $cartItem->save();
        } else {
            // Crear un nuevo registro en el carrito
            Cart::create([
                'user_id'    => $userId,
                'product_id' => $product->id,
                'price'      => $discountedPrice,
                'quantity'   => $quantity,
                'amount'     => $quantity * $discountedPrice
            ]);
        }
        $items = Cart::with('product')->where(['user_id' => $userId, 'order_id' => null])->get();
        return response()->json(['success' => 'Producto agregado al carrito', 'cartItems' => $items], 200);
    }

    public function cartDelete($id)
    {
        $cart = Cart::find($id);
        if (!$cart) {
            return response()->json(['message' => 'Producto no encontrado en el carrito'], 404);
        }

        try {
            $cart->delete();
            return response()->json(['message' => 'Removido del carrito exitosamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar del carrito'], 500);
        }
    }

    public function cartUpdate($id, $quantity)
    {
        $cart = Cart::find($id);
        if (!$cart) {
            return response()->json(['error' => 'Carrito no encontrado'], 404);
        }
        $product = $cart->product;
        if ($product->stock < $quantity) {
            return response()->json(['error' => 'Stock insuficiente'], 400);
        }
        // Actualizar cantidad asegurando que no exceda el stock
        $cart->quantity = min($quantity, $product->stock);
        $after_price = $product->price * (1 - ($product->discount / 100));
        $cart->amount = $after_price * $cart->quantity;
        $cart->save();

        return response()->json([
            'success' => 'Carrito actualizado correctamente',
            'cart' => $cart
        ], 200);
    }

    public function checkout()
    {
        $cart = Cart::with('product')
            ->where('user_id', Auth::id())
            ->whereNull('order_id')
            ->get();

        if ($cart->isEmpty()) {
            return redirect()->back()->with('error', 'Tu carrito está vacío.');
        }

        // Calcular totales
        $sub_total = $cart->sum('amount');
        $taxRate = 0.15;
        $discount = 0;
        $tax = $sub_total * $taxRate;
        $total = $sub_total + $tax - $discount;
        $coupons = Coupon::where('status', 'active')->get();
        $shippings = Shipping::where('status', 'active')->get();

        return Inertia::render('Client/Checkout', [
            'coupons' => $coupons,
            'shippings' => $shippings,
            'dataCart' => [
                'productos' => $cart,
                'sub_total' => round($sub_total, 2),
                'tax' => round($tax, 2),
                'discount' => round($discount, 2),
                'total' => round($total, 2),
            ],
        ]);
    }
}
