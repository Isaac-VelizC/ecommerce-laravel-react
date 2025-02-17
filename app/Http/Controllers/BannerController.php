<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
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
            'title'       => 'required|string|max:50',
            'description' => 'nullable|string',
            'photoFile'   => 'required|image|mimes:jpg,png,webp|max:2048',
            'status'      => 'required|in:active,inactive',
        ]);
        
        try {
            // Generación del slug único
            $slug = Str::slug($validatedData['title']);
            $slug = $this->generateUniqueSlug($slug);
            $validatedData['slug'] = $slug;

            // Subir imagen a Cloudinary
            $uploadedFile = Cloudinary::upload($request->file('photoFile')->getRealPath());
            $validatedData['photo'] = $uploadedFile->getSecurePath();
            // Crear el banner con la URL de la imagen
            Banner::create($validatedData);

            return redirect()->route('banner.index')->with('success', 'Banner agregado correctamente');
        } catch (\Throwable $th) {
            return back()->with('error', 'Error al agregar el banner: ' . $th->getMessage());
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
        // Validación de los datos
        $validatedData = $request->validate([
            'title'       => 'required|string|max:50',
            'description' => 'nullable|string',
            'photoFile'   => 'nullable|image|mimes:jpg,png,webp|max:2048', // No es obligatorio
            'status'      => 'required|in:active,inactive',
        ]);

        try {
            // Buscar el banner existente
            $banner = Banner::findOrFail($id);

            // Si se sube una nueva imagen, actualizar en Cloudinary
            if ($request->hasFile('photoFile')) {
                // (Opcional) Eliminar imagen anterior en Cloudinary
                if ($banner->photo) {
                    Cloudinary::destroy($this->getPublicIdFromUrl($banner->photo));
                }

                // Subir nueva imagen a Cloudinary
                $uploadedFile = Cloudinary::upload($request->file('photoFile')->getRealPath());
                $validatedData['photo'] = $uploadedFile->getSecurePath(); // Nueva URL de la imagen
            }

            // Actualizar el banner con los datos nuevos
            $banner->update($validatedData);

            return redirect()->route('banner.index')->with('success', 'Banner actualizado correctamente');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al actualizar el banner: ' . $e->getMessage());
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
            Banner::findOrFail($id)->delete();
            return response()->json(['success' => true, 'message' => 'Banner eliminado exitosamente'], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => false, 'message' => 'Error while deleting banner'], 500);
        }
    }
}
