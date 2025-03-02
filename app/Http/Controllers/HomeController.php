<?php

namespace App\Http\Controllers;

use App\Helpers\Helper;
use App\Models\Banner;
use App\Models\Cart;
use App\Models\Categorie;
use App\Models\Product;

class HomeController extends Controller
{
    public function pageWelcome()
    {
        // Obtener los datos necesarios
        $categories = Categorie::where('status', 'active')
            ->where('is_parent', 1)
            ->withCount('products') // Cuenta la cantidad de productos por categoría
            ->orderBy('products_count', 'DESC') // Ordena por cantidad de productos
            ->limit(5)
            ->get();

        $banners = Banner::where('status', 'active')
            ->limit(3)
            ->orderBy('id', 'DESC')
            ->get();

        $featured = Product::where('status', 'active')
            ->where('is_featured', 1)
            ->orderBy('price', 'DESC')
            ->limit(2)
            ->get();

        $topProducts = Cart::with('product')
            ->whereNotNull('order_id')
            ->join('products', 'carts.product_id', '=', 'products.id')
            ->orderByDesc('carts.quantity')
            ->limit(2)
            ->get();

        $products = Product::where('status', 'active')
            ->orderBy('created_at', 'DESC')
            ->limit(8)
            ->get();
        $products = Helper::setWishlistStatus($products);

        $discounted_products = Product::where('status', 'active')
            ->where('discount', '>', 0)
            ->orderBy('discount', 'DESC') // Ordenar por el mayor descuento
            ->limit(6)
            ->get();

        // Devolver los datos en formato JSON
        return response()->json([
            'featured' => $featured,
            'banners' => $banners,
            'products' => $products,
            'categories' => $categories,
            'discounted_products' => $discounted_products,
            'topProducts' => $topProducts
        ]);
    }
}
