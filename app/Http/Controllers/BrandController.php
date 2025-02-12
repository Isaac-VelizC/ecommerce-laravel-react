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
        $brand = Brand::orderBy('id', 'DESC')->paginate(10);
        return Inertia::render('Dashboard/Brand/Index', [
            'brands' => [
                'data' => $brand->items(), // Los productos
                'current_page' => $brand->currentPage(), // Página actual
                'last_page' => $brand->lastPage(), // Última página
                'per_page' => $brand->perPage(), // Elementos por página
                'total' => $brand->total(), // Total de elementos
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|unique:brands',
            'status' => 'required|in:active,inactive',
        ]);
        try {
            // Generar el slug
            $slug = Str::slug($validatedData['title']);
            $slug = $this->generateUniqueSlug($slug);
            // Agregar el slug a los datos
            $validatedData['slug'] = $slug;
            // Crear la marca
            $brand = Brand::create($validatedData);
            // Mensaje de éxito
            return redirect()->route('brand.index')->with('success', $brand->title . ' successfully created');
        } catch (\Exception $e) {
            // Manejo de errores
            return redirect()->route('brand.index')->with('error', 'Error, Please try again: ' . $e->getMessage());
        }
    }

    private function generateUniqueSlug($slug)
    {
        $count = Brand::where('slug', $slug)->count();

        if ($count > 0) {
            return $slug . '-' . now()->format('ymdHis') . '-' . rand(0, 999);
        }
        return $slug;
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|unique:brands,title,' . $id,
            'status' => 'required|in:active,inactive',
        ]);

        try {
            // Buscar la marca por ID
            $brand = Brand::findOrFail($id);
            // Llenar el modelo con los datos validados y guardar
            $brand->fill($validatedData)->save();
            // Mensaje de éxito
            return redirect()->back()->with('success', 'Brand successfully updated');
        } catch (\Exception $e) {
            // Manejo de errores
            return redirect()->back()->with('error', 'Error, Please try again: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            // Buscar la marca por ID
            $brand = Brand::findOrFail($id);
            // Eliminar la marca
            $brand->delete();
            return response()->json(['success' => true, 'message' => 'Marca eliminado exitosamente'], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => false, 'message' => 'Error while deleting marca'], 500);
        }
    }
}
