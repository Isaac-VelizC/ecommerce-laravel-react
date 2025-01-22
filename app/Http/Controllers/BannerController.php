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
        $banners = Banner::orderBy('id', 'DESC')->paginate(10);
        return Inertia::render('Dashboard/Banner/Index', [
            'banners' => $banners->items(),
            'pagination' => $banners,
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Banner/Create');
    }

    public function store(Request $request)
    {
        // Validación de los datos
        $validatedData = $request->validate([
            'title' => 'required|string|max:50',
            'description' => 'nullable|string',
            'photo' => 'required|file|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:active,inactive',
        ]);

        try {
            // Manejo del archivo
            if ($request->hasFile('photo')) {
                $file = $request->file('photo');
                $path = $file->store('banners', 'public'); // Almacena el archivo en la carpeta public/banners
                $validatedData['photo'] = $path; // Guarda la ruta del archivo en los datos validados
            }

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
        // Verificar si el slug ya existe y generar uno nuevo si es necesario
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
            'banner' => $banner
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
            // Llenar el modelo con los datos validados
            $banner->fill($validatedData);
            // Guardar los cambios
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
            // Mensaje de éxito
            return redirect()->back()->with('success', 'Banner successfully deleted');
        } catch (\Exception $e) {
            // Manejo de errores
            return redirect()->back()->with('error', 'Error occurred while deleting banner: ' . $e->getMessage());
        }
    }
}
