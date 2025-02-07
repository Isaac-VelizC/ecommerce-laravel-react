<?php

namespace App\Http\Controllers;

use App\Models\PostCategorie;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\PostTag;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::getAllPost();
        return Inertia::render('Dashboard/Posts/Index', [
            'posts' => [
                'data' => $posts->items(),
                'current_page' => $posts->currentPage(), // Página actual
                'last_page' => $posts->lastPage(), // Última página
                'per_page' => $posts->perPage(), // Elementos por página
                'total' => $posts->total(), // Total de elementos
            ],
        ]);
    }

    public function create()
    {
        $categories = PostCategorie::get();
        $tags = PostTag::get();
        return Inertia::render('Dashboard/Posts/Create', [
            'categories' => $categories,
            'tags' => $tags,
            'isEditing' => false
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|min:5',
            'summary' => 'required|string|max:255',
            'description' => 'nullable|string',
            'photo' => 'nullable|string',
            'tags' => 'required|array',
            'post_cat_id' => 'required|exists:post_categories,id',
            'status' => 'required|in:active,inactive',
        ]);

        try {
            $slug = Str::slug($validatedData['title']);
            $slug = $this->generateUniqueSlug($slug);
            $postData = [
                'title' => $validatedData['title'],
                'summary' => $validatedData['summary'],
                'description' => $validatedData['description'] ?? null,
                'photo' => $validatedData['photo'] ?? null,
                'post_cat_id' => $validatedData['post_cat_id'],
                'status' => $validatedData['status'],
                'slug' => $slug,
                'added_by' => Auth::user()->id,
                'tags' => isset($validatedData['tags']) ? implode(',', $validatedData['tags']) : '',
            ];
            Post::create($postData);
            return redirect()->route('post.index')->with('success', 'Post creado exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Ocurrió un error al crear el post. Por favor, inténtalo de nuevo.');
        }
    }

    private function generateUniqueSlug($slug)
    {
        $count = Post::where('slug', $slug)->count();
        if ($count > 0) {
            return $slug . '-' . now()->format('ymdis') . '-' . rand(0, 999);
        }
        return $slug;
    }

    public function edit($id)
    {
        $post = Post::findOrFail($id);
        $categories = PostCategorie::get();
        $tags = PostTag::get();
        return Inertia::render('Dashboard/Posts/Create', ['categories' => $categories, 'tags' => $tags, 'postItem' => $post, 'isEditing' => true]);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|min:5',
            'summary' => 'required|string|max:255',
            'description' => 'nullable|string',
            'photo' => 'nullable|string',
            'tags' => 'required|array',
            'tags.*' => 'string', // Validar que cada elemento del array tags sea un string
            'post_cat_id' => 'required|exists:post_categories,id',
            'status' => 'required|in:active,inactive',
        ]);

        try {
            $slug = Str::slug($validatedData['title']);
            $slug = $this->generateUniqueSlug($slug);

            $post = Post::findOrFail($id);

            $post->update([
                'title' => $validatedData['title'],
                'summary' => $validatedData['summary'],
                'description' => $validatedData['description'] ?? null,
                'photo' => $validatedData['photo'] ?? null,
                'post_cat_id' => $validatedData['post_cat_id'],
                'status' => $validatedData['status'],
                'slug' => $slug,
                'tags' => implode(',', $validatedData['tags']), // Unir el array de tags en una cadena
            ]);

            return redirect()->route('post.index')->with('success', 'Post actualizado exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Ocurrió un error al actualizar el post. Por favor, inténtalo de nuevo.');
        }
    }

    public function destroy($id)
    {
        try {
            $post = Post::findOrFail($id);
            $post->delete();
            return response()->json(['success' => true, 'message' => 'Publicación eliminado exitosamente'], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => false, 'message' => 'Ocurrió un error, vuelve a intentarlo'], 500);
        }
    }
}
