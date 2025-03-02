<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Categorie;
use App\Models\Color;
use App\Models\ImageProduct;
use App\Models\Inventory;
use App\Models\Product;
use App\Models\Size;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::getAllProduct();
        return Inertia::render('Dashboard/Product/Index', [
            'products' => [
                'data' => $products->items(),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
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
            'photoFile'   => 'required|image|mimes:jpg,png,webp|max:2048',
            'cat_id' => 'required|integer|exists:categories,id',
            'brand_id' => 'nullable|integer|exists:brands,id',
            'child_cat_id' => 'nullable|integer|exists:categories,id',
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
            // Subir imagen a Cloudinary
            $uploadedFile = Cloudinary::upload($request->file('photoFile')->getRealPath());
            $validatedData['photo'] = $uploadedFile->getSecurePath();
            // Creación del producto
            $product = Product::create($validatedData);
            return redirect()->route('product.create.inventary', $product->slug)->with('success', 'Producto creado exitosamente. Continuar llenado el formulario');
        } catch (\Throwable $th) {
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

    public function PageFormInventary($slug)
    {
        $product = Product::where('slug', $slug)->firstOrFail();
        $colors = Color::all();
        $sizes = Size::all();
        $inventaries = Inventory::with(['color', 'size', 'image'])->where('product_id', $product->id)->latest()->get();
        return Inertia::render('Dashboard/Product/FormInventary', [
            'product' => $product,
            'colors' => $colors,
            'sizes' => $sizes,
            'inventaries' => $inventaries
        ]);
    }

    public function storeInventary(Request $request)
    {
        $uniqueRule = Rule::unique('inventories')->where(function ($query) use ($request) {
            return $query->where('talla_id', $request->talla_id)
                ->where('color_id', $request->color_id)
                ->where('product_id', $request->product_id);
        });

        $validatedData = $request->validate([
            'imagen'     => 'required|image|mimes:jpg,png,webp|max:2048',
            'quantity'   => 'required|numeric|min:0',
            'talla_id'   => 'nullable|integer|exists:sizes,id',
            'color_id'   => 'nullable|integer|exists:colors,id',
            'product_id' => ['required', 'integer', 'exists:products,id', $uniqueRule],
        ], [
            'product_id.unique' => 'Ya existe un inventario con la misma talla y color para este producto.',
        ]);

        DB::beginTransaction();
        try {
            // Subir imagen a Cloudinary
            $uploadedFileUrl = Cloudinary::upload($request->file('imagen')->getRealPath())->getSecurePath();

            // Crear registro de imagen
            $image = ImageProduct::create([
                'image'      => $uploadedFileUrl,
                'product_id' => $validatedData['product_id'],
                'color_id'   => $validatedData['color_id']
            ]);
            // Agregar el `image_id` al inventario
            $validatedData['image_id'] = $image->id;

            // Crear el inventario
            $item = Inventory::create($validatedData);
            $product = Product::find($validatedData['product_id']);
            $product->updateStock();
            $inventarie = Inventory::with(['color', 'size', 'image'])->find($item->id);
            DB::commit();
            return response()->json(['success' => 'Registrado exitosamente.', 'item' => $inventarie], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error'   => 'Ocurrió un error, vuelve a intentarlo.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function updateQuantity(Request $request, $id)
    {
        $validatedData = $request->validate([
            'quantity' => 'required|numeric|min:1',
        ]);

        try {
            $inventory = Inventory::findOrFail($id);
            $inventory->quantity = $validatedData['quantity'];
            $inventory->save();
            $product = Product::find($inventory->product_id);
            $product->updateStock();

            return response()->json(['success' => 'Cantidad actualizada correctamente']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar la cantidad'], 500);
        }
    }

    public function show($slug)
    {
        $product = Product::getProductBySlug($slug);
        $inventaries = Inventory::with(['color', 'size', 'image'])->where('product_id', $product->id)->latest()->get();
        return Inertia::render('Dashboard/Product/Show', [
            'product' => $product,
            'inventaries' => $inventaries
        ]);
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
            'photoFile'   => 'nullable|image|mimes:jpg,png,webp|max:2048',
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
            // Si se sube una nueva imagen, actualizar en Cloudinary
            if ($request->hasFile('photoFile')) {
                // (Opcional) Eliminar imagen anterior en Cloudinary
                if ($product->photo) {
                    Cloudinary::destroy($this->getPublicIdFromUrl($product->photo));
                }

                // Subir nueva imagen a Cloudinary
                $uploadedFile = Cloudinary::upload($request->file('photoFile')->getRealPath());
                $validatedData['photo'] = $uploadedFile->getSecurePath(); // Nueva URL de la imagen
            }
            $product->fill($validatedData)->save();
            return redirect()->route('product.index')->with('success', 'Producto creado exitosamente.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Ocurrió un error, vuelve a intentarlo');
        }
    }

    private function getPublicIdFromUrl($url)
    {
        $parsedUrl = pathinfo($url);
        return $parsedUrl['filename'];
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

    public function deleteInventary($id)
    {
        try {
            $inventory = Inventory::findOrFail($id);
            if ($inventory->image_id) {
                Cloudinary::destroy($this->getPublicIdFromUrl($inventory->image->image));
            }
            $productId = $inventory->product_id;
            $inventory->delete();
            $product = Product::find($productId);

            if ($product) {
                $product->updateStock();
            }

            return response()->json(['success' => 'Inventario eliminado correctamente.']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar el inventario'], 500);
        }
    }
}
