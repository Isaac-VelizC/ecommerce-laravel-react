<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Categorie;
use App\Models\Post;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function pageWelcome() {
        // Obtener los datos necesarios
        $categories = Categorie::where('status', 'active')
            ->where('is_parent', 1)
            ->withCount('products') // Cuenta la cantidad de productos por categoría
            ->orderBy('products_count', 'DESC') // Ordena por cantidad de productos
            ->limit(4)
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
        
        $products = Product::where('status', 'active')
            ->orderBy('created_at', 'DESC')
            ->limit(8)
            ->get();
        
        if (Auth::check()) {
            $userId = Auth::id();
            foreach ($products as $product) {
                $product->is_in_wishlist = $product->isInWishlist($userId, $product->id);
            }
        }
        
        $discounted_products = Product::where('status', 'active')
            ->whereNotNull('discount') // Solo productos con descuento
            ->orderBy('discount', 'ASC') // Ordenar por el mayor descuento
            ->limit(6)
            ->get();
        
    
        // Devolver los datos en formato JSON
        return response()->json([
            'featured' => $featured,
            'banners' => $banners,
            'products' => $products,
            'categories' => $categories,
            'discounted_products' => $discounted_products
        ]);
    }
    
}
