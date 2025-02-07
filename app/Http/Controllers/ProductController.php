<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Categorie;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::getAllProduct();
        return Inertia::render('Dashboard/Product/Index', [
            'products' => [
                'data' => $products->items(), // Los productos
                'current_page' => $products->currentPage(), // Página actual
                'last_page' => $products->lastPage(), // Última página
                'per_page' => $products->perPage(), // Elementos por página
                'total' => $products->total(), // Total de elementos
            ],
        ]);
    }

    public function create()
    {
        $brand = Brand::get();
        $category = Categorie::where('is_parent', 1)->get();
        return Inertia::render('Dashboard/Product/Create', [
            'categories' => $category,
            'brands' => $brand,
            'isEditing' => false
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'string|required',
            'summary' => 'string|required',
            'description' => 'string|nullable',
            'photo' => 'string|required',
            'size' => 'nullable|string',  // Asegurando que sea un string si se espera un texto
            'stock' => 'required|numeric|min:0',
            'cat_id' => 'required|integer|exists:categories,id',
            'brand_id' => 'nullable|integer|exists:brands,id',
            'child_cat_id' => 'nullable|integer|exists:categories,id', // Corrección de typo en "intenger"
            'is_featured' => 'sometimes|boolean',
            'status' => 'required|in:active,inactive',
            'condition' => 'required|in:default,new,hot',
            'price' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0|max:100',
        ]);

        try {
            // Generación del slug
            $slug = Str::slug($validatedData['title']);
            $slug = $this->generateUniqueSlug($slug);

            // Asignación de valores adicionales
            $validatedData['slug'] = $slug;
            $validatedData['is_featured'] = $request->input('is_featured', 0);

            // Creación del producto
            Product::create($validatedData);
            return redirect()->route('product.index')->with('success', 'Producto creado exitosamente.');
        } catch (\Throwable $th) {
            dd($th);
            return redirect()->back()->with('error', 'Ocurrió un error, vuelve a intentarlo');
        }
    }

    private function generateUniqueSlug($slug)
    {
        $count = Product::where('slug', $slug)->count();
        if ($count > 0) {
            return $slug . '-' . now()->format('ymdis') . '-' . rand(0, 999);
        }
        return $slug;
    }

    public function edit($id)
    {
        $brand = Brand::get();
        $product = Product::findOrFail($id);
        $category = Categorie::where('is_parent', 1)->get();
        //$items = Product::where('id', $id)->get();

        return Inertia::render('Dashboard/Product/Create', [
            'product' => $product,
            'brands' => $brand,
            'categories' => $category,
            'isEditing' => true
            //'items' => $items
        ]);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title' => 'string|required',
            'summary' => 'string|required',
            'description' => 'string|nullable',
            'photo' => 'string|required',
            'size' => 'nullable|string',  // Asegurando que sea un string si se espera un texto
            'stock' => 'required|numeric|min:0',
            'cat_id' => 'required|integer|exists:categories,id',
            'brand_id' => 'nullable|integer|exists:brands,id',
            'child_cat_id' => 'nullable|integer|exists:categories,id', // Corrección de typo en "intenger"
            'is_featured' => 'sometimes|boolean',
            'status' => 'required|in:active,inactive',
            'condition' => 'required|in:default,new,hot',
            'price' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0|max:100',
        ]);
        try {
            // Generación del slug
            $product = Product::findOrFail($id);
            $validatedData = $request->all();
            $validatedData['is_featured'] = $request->input('is_featured', 0);
            $product->fill($validatedData)->save();
            return redirect()->route('product.index')->with('success', 'Producto creado exitosamente.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Ocurrió un error, vuelve a intentarlo');
        }
    }

    public function destroy($id)
    {
        try {
            $product = Product::findOrFail($id);
            $product->delete();
            return redirect()->back()->with('success', 'Producto eliminado con exitosamente.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Ocurrió un error, vuelve a intentarlo');
        }
    }
}
