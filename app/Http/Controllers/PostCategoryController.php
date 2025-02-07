<?php

namespace App\Http\Controllers;

use App\Models\PostCategorie;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostCategoryController extends Controller
{
    public function index()
    {
        $postCategory = PostCategorie::orderBy('id', 'DESC')->paginate(10);
        return Inertia::render('Dashboard/Posts/Categorias/Index', [
            'postCategories' => [
                'data' => $postCategory->items(),
                'current_page' => $postCategory->currentPage(), // Página actual
                'last_page' => $postCategory->lastPage(), // Última página
                'per_page' => $postCategory->perPage(), // Elementos por página
                'total' => $postCategory->total(), // Total de elementos
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'string|required|unique:post_categories,title',
        ]);

        try {
            // Generar slug único
            $slug = Str::slug($validatedData['title']);
            $slug = $this->generateUniqueSlug($slug);

            // Crear la nueva categoría
            $category = PostCategorie::create([
                'title' => $validatedData['title'],
                'slug'  => $slug,
            ]);

            // Retornar la categoría en JSON
            return response()->json([
                'success'  => true,
                'message'  => 'Categoría creada exitosamente',
                'category' => $category,
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Ocurrió un error al crear la categoría',
                'error'   => $th->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|unique:post_categories,title,' . $id,
        ]);

        try {
            $postCategory = PostCategorie::findOrFail($id);
            $postCategory->fill($validatedData)->save();

            return response()->json([
                'success'  => true,
                'message'  => 'Categoría actualizada exitosamente',
                'category' => $postCategory,
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Ocurrió un error al actualizar la categoría',
                'error'   => $th->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $postCategory = PostCategorie::findOrFail($id);
            $postCategory->delete();
            return response()->json(['success' => true, 'message' => 'Categoria eliminado exitosamente.'], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => false, 'message' => 'Ocurrió un error, vuelve a intentarlo.'], 500);
        }
    }

    private function generateUniqueSlug($slug)
    {
        $count = PostCategorie::where('slug', $slug)->count();
        if ($count > 0) {
            return $slug . '-' . now()->format('ymdis') . '-' . rand(0, 999);
        }
        return $slug;
    }
}
