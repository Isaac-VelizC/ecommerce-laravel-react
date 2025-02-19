<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $category = Categorie::getAllCategory();
        return Inertia::render('Dashboard/Category/Index', [
            'categories' => [
                'data' => $category->items(),
                'current_page' => $category->currentPage(), // Página actual
                'last_page' => $category->lastPage(), // Última página
                'per_page' => $category->perPage(), // Elementos por página
                'total' => $category->total(), // Total de elementos
            ],
        ]);
    }

    private function generateUniqueSlug($slug)
    {
        $count = Categorie::where('slug', $slug)->count();
        if ($count > 0) {
            return $slug . '-' . now()->format('ymdHis') . '-' . rand(0, 999);
        }
        return $slug;
    }

    public function create()
    {
        $parent_cats = Categorie::where('is_parent', 1)->orderBy('title', 'ASC')->get();
        return Inertia::render('Dashboard/Category/Create', ['parent_cats' => $parent_cats, 'isEditing' => false]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'string|required|max:25|regex:/^[A-Za-zÑñáéíóúÁÉÍÓÚ ]+$/',
            'summary' => 'string|nullable',
            'photoFile'   => 'required|image|mimes:jpg,png,webp|max:2048',
            'status' => 'required|in:active,inactive',
            'is_parent' => 'sometimes|boolean',
            'parent_id' => 'nullable|exists:categories,id',
        ]);
        try {
            $slug = Str::slug($request->title);
            $slug = $this->generateUniqueSlug($slug);
            $validatedData['slug'] = $slug;
            $validatedData['is_parent'] = $request->input('is_parent', 0);
            // Subir imagen a Cloudinary
            $uploadedFile = Cloudinary::upload($request->file('photoFile')->getRealPath());
            $validatedData['photo'] = $uploadedFile->getSecurePath();

            Categorie::create($validatedData);
            return redirect()->route('category.index')->with('success', 'Category successfully added');
        } catch (\Throwable $th) {
            return back()->with('error', 'Error occurred, Please try again!');
        }
    }

    public function edit($id)
    {
        $parent_cats = Categorie::where('is_parent', 1)
            ->where('id', '!=', $id)
            ->get();
        $category = Categorie::findOrFail($id);
        return Inertia::render('Dashboard/Category/Create', [
            'category' => $category,
            'parent_cats' => $parent_cats,
            'isEditing' => true
        ]);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title' => 'string|required|max:25|regex:/^[A-Za-zÑñáéíóúÁÉÍÓÚ ]+$/',
            'summary' => 'string|nullable',
            'photoFile'   => 'nullable|image|mimes:jpg,png,webp|max:2048',
            'status' => 'required|in:active,inactive',
            'is_parent' => 'sometimes|boolean',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        try {
            $category = Categorie::findOrFail($id);
            $validatedData['is_parent'] = $request->input('is_parent', 0);
            // Si se sube una nueva imagen, actualizar en Cloudinary
            if ($request->hasFile('photoFile')) {
                // (Opcional) Eliminar imagen anterior en Cloudinary
                if ($category->photo) {
                    Cloudinary::destroy($this->getPublicIdFromUrl($category->photo));
                }

                // Subir nueva imagen a Cloudinary
                $uploadedFile = Cloudinary::upload($request->file('photoFile')->getRealPath());
                $validatedData['photo'] = $uploadedFile->getSecurePath(); // Nueva URL de la imagen
            }

            $category->fill($validatedData)->update();
            return redirect()->route('category.index')->with('success', 'Category successfully updated');
        } catch (\Throwable $th) {
            return back()->with('error', 'Error occurred, Please try again!');
        }
    }

    private function getPublicIdFromUrl($url)
    {
        $parsedUrl = pathinfo($url);
        return $parsedUrl['filename']; // Extrae el `public_id` de la imagen
    }

    public function destroy($id)
    {
        try {
            $category = Categorie::findOrFail($id);
            // Si hay categorías hijas, puedes decidir cómo manejarlas aquí
            Categorie::where('parent_id', $id)->pluck('id');
            $category->delete();
            return response()->json(['success' => true, 'message' => 'Category successfully deleted'], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => false, 'message' => 'Error while deleting category'], 500);
        }
    }

    public function getChildByParent($id)
    {
        $children = Categorie::where('parent_id', $id)->get();
        return response()->json($children);
    }
}
