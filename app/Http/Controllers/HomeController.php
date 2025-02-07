<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Categorie;
use App\Models\Post;
use App\Models\Product;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function pageWelcome() {
        // Obtener los datos necesarios
        $featured = Product::where('status', 'active')
            ->where('is_featured', 1)
            ->orderBy('price', 'DESC')
            ->limit(2)
            ->get();
    
        $posts = Post::where('status', 'active')
            ->orderBy('id', 'DESC')
            ->limit(3)
            ->get();
    
        $banners = Banner::where('status', 'active')
            ->limit(3)
            ->orderBy('id', 'DESC')
            ->get();
    
        $products = Product::where('status', 'active')
            ->orderBy('id', 'DESC')
            ->limit(8)
            ->get();
    
        $categories = Categorie::where('status', 'active')
            ->where('is_parent', 1)
            ->orderBy('title', 'ASC')
            ->get();
    
        // Devolver los datos en formato JSON
        return response()->json([
            'featured' => $featured,
            'posts' => $posts,
            'banners' => $banners,
            'products' => $products,
            'categories' => $categories,
        ]);
    }
    
}
