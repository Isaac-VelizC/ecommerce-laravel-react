<?php

namespace App\Http\Controllers;

use App\Helpers\Helper;
use App\Models\Brand;
use App\Models\Categorie;
use App\Models\Color;
use App\Models\ImageProduct;
use App\Models\Inventory;
use App\Models\Post;
use App\Models\PostCategorie;
use App\Models\PostTag;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Size;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FrontendController extends Controller
{
    public function PageProducts()
    {
        $products = Product::where('status', 'active')->orderBy('id', 'ASC')->paginate(40);
        $prods = Helper::setWishlistStatus($products->items());
        return Inertia::render('Client/Products', [
            'products' => [
                'data' => $prods,
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function settingsApp()
    {
        return response()->json(Setting::first());
    }

    public function PageContact()
    {
        return Inertia::render('Client/Contact');
    }

    public function PageBlog()
    {
        $posts = Post::with('author_info')->where('status', 'active')
            ->latest()
            ->take(10)
            ->get();
        return Inertia::render('Client/Blog', [
            'posts' => $posts
        ]);
    }

    public function index(Request $request)
    {
        return redirect()->route($request->user()->role);
    }

    public function PageAboutUs()
    {
        return Inertia::render('Client/AboutUs');
    }

    public function productDetail($slug)
    {
        $product_detail = Product::getProductBySlug($slug, Auth::id());
        $relatedProdcuts = Product::where('cat_id', $product_detail->cat_id)->take(4)->get();
        $sizes = Helper::sizesProduct($product_detail->id);
        $colors = Inventory::where('product_id', $product_detail->id)->pluck('color_id')->toArray();
        $colors = Color::whereIn('id', $colors)->get();
        $images = ImageProduct::where('product_id', $product_detail->id)->get();
        return Inertia::render('Client/ProductDetail', [
            'product_detail' => $product_detail,
            'relatedProdcuts' => $relatedProdcuts,
            'colors' => $colors,
            'sizes' => $sizes,
            'images' => $images
        ]);
    }

    public function checkAvailability(Request $request)
    {
        $color = $request->query('color');
        $size = $request->query('size');
        $productId = $request->query('product_id');

        // Validar que los parámetros no sean nulos
        if (!$color || !$size || !$productId) {
            return response()->json([
                'error' => 'Faltan parámetros en la consulta'
            ], 400);
        }

        $stock = Inventory::where('product_id', $productId)
            ->where('talla_id', $size)
            ->where('color_id', $color)
            ->sum('quantity');

        return response()->json(['stock' => $stock]);
    }

    public function productLists($slug)
    {
        $products = Product::query();
        // Filtrar por categoría
        if (!empty($_GET['category'])) {
            $slug = explode(',', $_GET['category']);
            $cat_ids = Categorie::select('id')->whereIn('slug', $slug)->pluck('id')->toArray();
            $products->whereIn('cat_id', $cat_ids);
        }

        // Filtrar por marca
        if (!empty($_GET['brand'])) {
            $slugs = explode(',', $_GET['brand']);
            $brand_ids = Brand::select('id')->whereIn('slug', $slugs)->pluck('id')->toArray();
            $products->whereIn('brand_id', $brand_ids);
        }

        // Ordenar productos
        if (!empty($_GET['sortBy'])) {
            if ($_GET['sortBy'] == 'title') {
                $products->where('status', 'active')->orderBy('title', 'ASC');
            } elseif ($_GET['sortBy'] == 'price') {
                $products->where('status', 'active')->orderBy('price', 'ASC');
            }
        }

        // Filtrar por rango de precio
        if (!empty($_GET['price'])) {
            $price = explode('-', $_GET['price']);
            $products->whereBetween('price', array_map('floatval', $price));
        }
        // Obtener productos recientes
        $recent_products = Product::where('status', 'active')->orderBy('id', 'DESC')->limit(3)->get();
        // Obtener productos activos con el promedio de calificación
        $products = Product::where('status', 'active')->withAvg('getReview', 'rate')->paginate(request('show', 12));
        // Verificar si el usuario está autenticado antes de calcular wishlist
        if (Auth::check()) {
            $userId = Auth::id();
            foreach ($products as $product) {
                $product->is_in_wishlist = $product->isInWishlist($userId, $product->id);
            }
        }
        $categorias = Categorie::with('children')->where('is_parent', true)->take(6)->get();

        return Inertia::render('Client/Shop', [
            'products' => $products,
            'recent_products' => $recent_products,
            'categorias' => $categorias
        ]);
    }

    public function productFilter(Request $request)
    {
        $query = Product::with(['inventories.color', 'inventories.size']);

        // Filtrar por precio (rango)
        if ($request->has('min_price') && $request->has('max_price')) {
            if ($request->min_price && $request->max_price) {
                $query->whereBetween('price', [$request->min_price, $request->max_price]);
            }
        }

        // Filtrar por talla (size)
        if ($request->has('sizes') && $request->sizes) {
            $sizes = array_filter(array_map('trim', explode(',', $request->sizes)));
            if (!empty($sizes)) {
                $query->whereHas('inventories.size', function ($q) use ($sizes) {
                    $q->whereIn('id', $sizes);
                });
            }
        }

        // Filtrar por color
        if ($request->has('colors') && $request->colors) {
            $colors = array_filter(array_map('trim', explode(',', $request->colors)));
            if (!empty($colors)) {
                $query->whereHas('inventories.color', function ($q) use ($colors) {
                    $q->whereIn('id', $colors);
                });
            }
        }

        // Filtrar por marca
        if ($request->has('brand_id') && $request->brand_id) {
            $query->where('brand_id', $request->brand_id);
        }

        // Obtener los productos con paginación
        $products = $query->paginate(10);

        return response()->json($products);
    }

    public function productBrand(Request $request)
    {
        $slug = $request->slug;
        $products = Brand::getProductByBrand($slug);
        $recent_products = Product::where('status', 'active')->orderBy('id', 'DESC')->limit(3)->get();
        return Inertia::render('Client/Shop', [
            'products' => $products->products()->paginate(10),
            'recent_products' => $recent_products,
            'slug' => $slug
        ]);
    }

    public function productCat(Request $request)
    {
        $slug = $request->slug;
        $products = Categorie::with(['products' => function ($query) {
            $query->paginate(10);
        }])->where('slug', $slug)->firstOrFail();
        $recent_products = Product::where('status', 'active')->orderBy('id', 'DESC')->limit(3)->get();
        $brands = Brand::all();
        $sizes = Size::all();
        $colors = Color::all();
        return Inertia::render('Client/Shop', [
            'products' => $products->products()->paginate(10),
            'recent_products' => $recent_products,
            'slug' => $slug,
            'brands' => $brands,
            'sizes' => $sizes,
            'colors' => $colors
        ]);
    }

    public function productSubCat(Request $request)
    {
        $slug = $request->slug;
        $products = Categorie::with(['sub_products' => function ($query) {
            $query->paginate(10);
        }])->where('slug', $slug)->firstOrFail();
        $recent_products = Product::where('status', 'active')->orderBy('id', 'DESC')->limit(3)->get();
        return Inertia::render('Client/Shop', [
            'products' => $products->products()->paginate(10),
            'recent_products' => $recent_products,
            'slug' => $slug
        ]);
    }

    public function blog()
    {
        $post = Post::query();

        if (!empty($_GET['category'])) {
            $slug = explode(',', $_GET['category']);
            // dd($slug);
            $cat_ids = PostCategorie::select('id')->whereIn('slug', $slug)->pluck('id')->toArray();
            return $cat_ids;
            $post->whereIn('post_cat_id', $cat_ids);
            // return $post;
        }
        if (!empty($_GET['tag'])) {
            $slug = explode(',', $_GET['tag']);
            // dd($slug);
            $tag_ids = PostTag::select('id')->whereIn('slug', $slug)->pluck('id')->toArray();
            // return $tag_ids;
            $post->where('post_tag_id', $tag_ids);
            // return $post;
        }

        if (!empty($_GET['show'])) {
            $post = $post->where('status', 'active')->orderBy('id', 'DESC')->paginate($_GET['show']);
        } else {
            $post = $post->where('status', 'active')->orderBy('id', 'DESC')->paginate(9);
        }
        // $post=Post::where('status','active')->paginate(8);
        $rcnt_post = Post::where('status', 'active')->orderBy('id', 'DESC')->limit(3)->get();
        return view('frontend.pages.blog')->with('posts', $post)->with('recent_posts', $rcnt_post);
    }

    public function blogDetail($slug)
    {
        $post = Post::getPostBySlug($slug);
        $rcnt_post = Post::where('status', 'active')->orderBy('id', 'DESC')->limit(3)->get();
        // return $post;
        return view('frontend.pages.blog-detail')->with('post', $post)->with('recent_posts', $rcnt_post);
    }

    public function blogSearch(Request $request)
    {
        // return $request->all();
        $rcnt_post = Post::where('status', 'active')->orderBy('id', 'DESC')->limit(3)->get();
        $posts = Post::orwhere('title', 'like', '%' . $request->search . '%')
            ->orwhere('quote', 'like', '%' . $request->search . '%')
            ->orwhere('summary', 'like', '%' . $request->search . '%')
            ->orwhere('description', 'like', '%' . $request->search . '%')
            ->orwhere('slug', 'like', '%' . $request->search . '%')
            ->orderBy('id', 'DESC')
            ->paginate(8);
        return view('frontend.pages.blog')->with('posts', $posts)->with('recent_posts', $rcnt_post);
    }

    public function blogFilter(Request $request)
    {
        $data = $request->all();
        // return $data;
        $catURL = "";
        if (!empty($data['category'])) {
            foreach ($data['category'] as $category) {
                if (empty($catURL)) {
                    $catURL .= '&category=' . $category;
                } else {
                    $catURL .= ',' . $category;
                }
            }
        }

        $tagURL = "";
        if (!empty($data['tag'])) {
            foreach ($data['tag'] as $tag) {
                if (empty($tagURL)) {
                    $tagURL .= '&tag=' . $tag;
                } else {
                    $tagURL .= ',' . $tag;
                }
            }
        }
        // return $tagURL;
        // return $catURL;
        return redirect()->route('blog', $catURL . $tagURL);
    }

    public function blogByCategory(Request $request)
    {
        $post = PostCategorie::getBlogByCategory($request->slug);
        $rcnt_post = Post::where('status', 'active')->orderBy('id', 'DESC')->limit(3)->get();
        return view('frontend.pages.blog')->with('posts', $post->post)->with('recent_posts', $rcnt_post);
    }

    public function blogByTag(Request $request)
    {
        // dd($request->slug);
        $post = Post::getBlogByTag($request->slug);
        // return $post;
        $rcnt_post = Post::where('status', 'active')->orderBy('id', 'DESC')->limit(3)->get();
        return view('frontend.pages.blog')->with('posts', $post)->with('recent_posts', $rcnt_post);
    }

    /*public function subscribe(Request $request)
    {
        if (! Newsletter::isSubscribed($request->email)) {
            Newsletter::subscribePending($request->email);
            if (Newsletter::lastActionSucceeded()) {
                request()->session()->flash('success', 'Subscribed! Please check your email');
                return redirect()->route('home');
            } else {
                Newsletter::getLastError();
                return back()->with('error', 'Something went wrong! please try again');
            }
        } else {
            request()->session()->flash('error', 'Already Subscribed');
            return back();
        }
    }*/
}
