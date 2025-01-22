<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function index()
    {
        $brand = Brand::orderBy('id', 'DESC')->paginate();
        return Inertia::render('Dashboard/Brand/Index', [
            'brands' => $brand,
        ]);
    }

    public function create()
    {
        return view('backend.brand.create');
    }

    public function store(Request $request)
    {
        // Validación del request
        $validatedData = $request->validate([
            'title' => 'required|string',
        ]);
        try {
            // Generar el slug
            $slug = Str::slug($validatedData['title']);
            $slug = $this->generateUniqueSlug($slug);
            // Agregar el slug a los datos
            $validatedData['slug'] = $slug;
            // Crear la marca
            Brand::create($validatedData);
            // Mensaje de éxito
            return redirect()->route('brand.index')->with('success', 'Brand successfully created');
        } catch (\Exception $e) {
            // Manejo de errores
            return redirect()->route('brand.index')->with('error', 'Error, Please try again: ' . $e->getMessage());
        }
    }

    private function generateUniqueSlug($slug)
    {
        // Verificar si el slug ya existe y generar uno nuevo si es necesario
        $count = Brand::where('slug', $slug)->count();

        if ($count > 0) {
            return $slug . '-' . now()->format('ymdHis') . '-' . rand(0, 999);
        }

        return $slug;
    }

    public function edit($id)
    {
        try {
            // Buscar la marca por ID
            $brand = Brand::findOrFail($id);

            // Devolver la vista con la marca encontrada
            return view('backend.brand.edit', compact('brand'));
        } catch (\Exception $e) {
            // Manejo de errores
            return redirect()->route('brand.index')->with('error', 'Brand not found: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        // Validación del request
        $validatedData = $request->validate([
            'title' => 'required|string',
        ]);

        try {
            // Buscar la marca por ID
            $brand = Brand::findOrFail($id);

            // Llenar el modelo con los datos validados y guardar
            $brand->fill($validatedData)->save();

            // Mensaje de éxito
            return redirect()->route('brand.index')->with('success', 'Brand successfully updated');
        } catch (\Exception $e) {
            // Manejo de errores
            return redirect()->route('brand.index')->with('error', 'Error, Please try again: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            // Buscar la marca por ID
            $brand = Brand::findOrFail($id);

            // Eliminar la marca
            $brand->delete();

            // Mensaje de éxito
            return redirect()->route('brand.index')->with('success', 'Brand successfully deleted');
        } catch (\Exception $e) {
            // Manejo de errores
            return redirect()->route('brand.index')->with('error', 'Error, Please try again: ' . $e->getMessage());
        }
    }
}
