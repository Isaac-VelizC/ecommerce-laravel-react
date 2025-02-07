<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\PostTag;
use Inertia\Inertia;

class PostTagController extends Controller
{
    public function index()
    {
        $postTag = PostTag::orderBy('id', 'DESC')->paginate(10);
        return Inertia::render('Dashboard/Posts/Tags/Index', [
            'postTags' => [
                'data' => $postTag->items(),
                'current_page' => $postTag->currentPage(), // Página actual
                'last_page' => $postTag->lastPage(), // Última página
                'per_page' => $postTag->perPage(), // Elementos por página
                'total' => $postTag->total(), // Total de elementos
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'string|required|unique:post_tags,title',
        ]);
        try {
            // Generación del slug
            $slug = Str::slug($validatedData['title']);
            $slug = $this->generateUniqueSlug($slug);
            // Crear la nueva categoría
            $tag = PostTag::create([
                'title' => $validatedData['title'],
                'slug'  => $slug,
            ]);
            // Retornar la categoría en JSON
            return response()->json([
                'success'  => true,
                'message'  => 'Etiqueta creada exitosamente',
                'tag' => $tag,
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
            'title' => 'string|required',
        ]);
        try {
            $postTag = PostTag::findOrFail($id);
            $postTag->fill($validatedData)->save();
            return redirect()->route('post-tag.index')->with('success', 'Producto creado exitosamente.');
        } catch (\Throwable $th) {
            dd($th);
            return redirect()->back()->with('error', 'Ocurrió un error, vuelve a intentarlo');
        }
    }

    public function destroy($id)
    {
        try {
            $postTag = PostTag::findOrFail($id);
            $postTag->delete();

            return response()->json(['success' => true, 'message' => 'Etiqueta eliminado exitosamente.'], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => false, 'message' => 'Ocurrió un error, vuelve a intentarlo.'], 500);
        }
    }

    private function generateUniqueSlug($slug)
    {
        $count = PostTag::where('slug', $slug)->count();
        if ($count > 0) {
            return $slug . '-' . now()->format('ymdis') . '-' . rand(0, 999);
        }
        return $slug;
    }
}
