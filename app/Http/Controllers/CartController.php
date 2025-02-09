<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use App\Models\WishList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
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
        //$userId = Auth::id();
        //$cartItems = Cart::with('product')->where(['user_id' => $userId, 'order_id' => null])->get();
        // Formatear la respuesta JSON correctamente
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

            // Actualizar la wishlist si existe
            WishList::where('user_id', $userId)
                ->where('cart_id', null)
                ->update(['cart_id' => $cartItem->id]);
        }

        return back()->with('success', 'Producto agregado al carrito exitosamente');
    }

    public function singleAddToCart(Request $request)
    {
        $request->validate([
            'slug'      =>  'required',
            'quant'      =>  'required',
        ]);

        $product = Product::where('slug', $request->slug)->first();
        if ($product->stock < $request->quant[1]) {
            return back()->with('error', 'Out of stock, You can add other products.');
        }
        if (($request->quant[1] < 1) || empty($product)) {
            request()->session()->flash('error', 'Invalid Products');
            return back();
        }

        $already_cart = Cart::where('user_id', auth()->user()->id)->where('order_id', null)->where('product_id', $product->id)->first();

        // return $already_cart;

        if ($already_cart) {
            $already_cart->quantity = $already_cart->quantity + $request->quant[1];
            // $already_cart->price = ($product->price * $request->quant[1]) + $already_cart->price ;
            $already_cart->amount = ($product->price * $request->quant[1]) + $already_cart->amount;

            if ($already_cart->product->stock < $already_cart->quantity || $already_cart->product->stock <= 0) return back()->with('error', 'Stock not sufficient!.');

            $already_cart->save();
        } else {

            $cart = new Cart;
            $cart->user_id = auth()->user()->id;
            $cart->product_id = $product->id;
            $cart->price = ($product->price - ($product->price * $product->discount) / 100);
            $cart->quantity = $request->quant[1];
            $cart->amount = ($product->price * $request->quant[1]);
            if ($cart->product->stock < $cart->quantity || $cart->product->stock <= 0) return back()->with('error', 'Stock not sufficient!.');
            // return $cart;
            $cart->save();
        }
        request()->session()->flash('success', 'Product successfully added to cart.');
        return back();
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


    public function cartUpdate(Request $request)
    {
        // dd($request->all());
        if ($request->quant) {
            $error = array();
            $success = '';
            // return $request->quant;
            foreach ($request->quant as $k => $quant) {
                // return $k;
                $id = $request->qty_id[$k];
                // return $id;
                $cart = Cart::find($id);
                // return $cart;
                if ($quant > 0 && $cart) {
                    // return $quant;

                    if ($cart->product->stock < $quant) {
                        request()->session()->flash('error', 'Out of stock');
                        return back();
                    }
                    $cart->quantity = ($cart->product->stock > $quant) ? $quant  : $cart->product->stock;
                    // return $cart;

                    if ($cart->product->stock <= 0) continue;
                    $after_price = ($cart->product->price - ($cart->product->price * $cart->product->discount) / 100);
                    $cart->amount = $after_price * $quant;
                    // return $cart->price;
                    $cart->save();
                    $success = 'Cart successfully updated!';
                } else {
                    $error[] = 'Cart Invalid!';
                }
            }
            return back()->with($error)->with('success', $success);
        } else {
            return back()->with('Cart Invalid!');
        }
    }

    // public function addToCart(Request $request){
    //     // return $request->all();
    //     if(Auth::check()){
    //         $qty=$request->quantity;
    //         $this->product=$this->product->find($request->pro_id);
    //         if($this->product->stock < $qty){
    //             return response(['status'=>false,'msg'=>'Out of stock','data'=>null]);
    //         }
    //         if(!$this->product){
    //             return response(['status'=>false,'msg'=>'Product not found','data'=>null]);
    //         }
    //         // $session_id=session('cart')['session_id'];
    //         // if(empty($session_id)){
    //         //     $session_id=Str::random(30);
    //         //     // dd($session_id);
    //         //     session()->put('session_id',$session_id);
    //         // }
    //         $current_item=array(
    //             'user_id'=>auth()->user()->id,
    //             'id'=>$this->product->id,
    //             // 'session_id'=>$session_id,
    //             'title'=>$this->product->title,
    //             'summary'=>$this->product->summary,
    //             'link'=>route('product-detail',$this->product->slug),
    //             'price'=>$this->product->price,
    //             'photo'=>$this->product->photo,
    //         );

    //         $price=$this->product->price;
    //         if($this->product->discount){
    //             $price=($price-($price*$this->product->discount)/100);
    //         }
    //         $current_item['price']=$price;

    //         $cart=session('cart') ? session('cart') : null;

    //         if($cart){
    //             // if anyone alreay order products
    //             $index=null;
    //             foreach($cart as $key=>$value){
    //                 if($value['id']==$this->product->id){
    //                     $index=$key;
    //                 break;
    //                 }
    //             }
    //             if($index!==null){
    //                 $cart[$index]['quantity']=$qty;
    //                 $cart[$index]['amount']=ceil($qty*$price);
    //                 if($cart[$index]['quantity']<=0){
    //                     unset($cart[$index]);
    //                 }
    //             }
    //             else{
    //                 $current_item['quantity']=$qty;
    //                 $current_item['amount']=ceil($qty*$price);
    //                 $cart[]=$current_item;
    //             }
    //         }
    //         else{
    //             $current_item['quantity']=$qty;
    //             $current_item['amount']=ceil($qty*$price);
    //             $cart[]=$current_item;
    //         }

    //         session()->put('cart',$cart);
    //         return response(['status'=>true,'msg'=>'Cart successfully updated','data'=>$cart]);
    //     }
    //     else{
    //         return response(['status'=>false,'msg'=>'You need to login first','data'=>null]);
    //     }
    // }

    // public function removeCart(Request $request){
    //     $index=$request->index;
    //     // return $index;
    //     $cart=session('cart');
    //     unset($cart[$index]);
    //     session()->put('cart',$cart);
    //     return redirect()->back()->with('success','Successfully remove item');
    // }

    public function checkout(Request $request)
    {
        // $cart=session('cart');
        // $cart_index=\Str::random(10);
        // $sub_total=0;
        // foreach($cart as $cart_item){
        //     $sub_total+=$cart_item['amount'];
        //     $data=array(
        //         'cart_id'=>$cart_index,
        //         'user_id'=>$request->user()->id,
        //         'product_id'=>$cart_item['id'],
        //         'quantity'=>$cart_item['quantity'],
        //         'amount'=>$cart_item['amount'],
        //         'status'=>'new',
        //         'price'=>$cart_item['price'],
        //     );

        //     $cart=new Cart();
        //     $cart->fill($data);
        //     $cart->save();
        // }
        return view('frontend.pages.checkout');
    }
}
