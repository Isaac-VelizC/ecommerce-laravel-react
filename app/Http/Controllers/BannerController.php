<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::orderBy('id', 'ASC')->paginate(10);
        return Inertia::render('Dashboard/Banner/Index', [
            'banners' => [
                'data' => $banners->items(), // Los productos
                'current_page' => $banners->currentPage(), // Página actual
                'last_page' => $banners->lastPage(), // Última página
                'per_page' => $banners->perPage(), // Elementos por página
                'total' => $banners->total(), // Total de elementos
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Banner/Create', [
            'isEditing' => false,
        ]);
    }

    public function store(Request $request)
    {
        // Validación de los datos
        $validatedData = $request->validate([
            'title' => 'required|string|max:50',
            'description' => 'nullable|string',
            'photo' => 'required|string',
            'status' => 'required|in:active,inactive',
        ]);
        try {
            // Generación del slug
            $slug = Str::slug($validatedData['title']);
            $slug = $this->generateUniqueSlug($slug);
            $validatedData['slug'] = $slug;
            // Creación del banner
            Banner::create($validatedData);

            return redirect()->route('banner.index')->with('success', 'Banner successfully added');
        } catch (\Throwable $th) {
            return back()->with('error', 'Error occurred while adding banner: ' . $th->getMessage());
        }
    }

    private function generateUniqueSlug($slug)
    {
        $count = Banner::where('slug', $slug)->count();

        if ($count > 0) {
            return $slug . '-' . now()->format('ymdHis') . '-' . rand(0, 999);
        }

        return $slug;
    }

    public function edit($id)
    {
        $banner = Banner::findOrFail($id);
        return Inertia::render('Dashboard/Banner/Create', [
            'banner' => $banner,
            'isEditing' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:50',
            'description' => 'nullable|string',
            'photo' => 'required|string',
            'status' => 'required|in:active,inactive',
        ]);
        try {
            $banner = Banner::findOrFail($id);
            $banner->fill($validatedData);
            $banner->save();
            // Mensaje de éxito
            return redirect()->route('banner.index')->with('success', 'Banner successfully updated');
        } catch (\Exception $e) {
            // Manejo de errores
            return back()->with('error', 'Error occurred while updating banner: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            Banner::findOrFail($id)->delete();
            return response()->json(['success' => true, 'message' => 'Banner eliminado exitosamente'], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => false, 'message' => 'Error while deleting banner'], 500);
        }
    }
}
