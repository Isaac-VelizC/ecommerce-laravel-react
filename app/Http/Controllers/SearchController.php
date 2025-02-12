<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\SearchQuerie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SearchController extends Controller
{
    // Búsqueda con autocompletado
    public function productSearch($search)
    {
        $resultados = [];

        /*if (!empty($search)) {
            $resultados = Product::where('status', 'active')
                ->where(function ($query) use ($search) {
                    $query->whereRaw("SOUNDEX(title) = SOUNDEX(?)", [$search])
                        ->orWhere('title', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('summary', 'like', "%{$search}%");
                })
                ->latest()
                ->limit(18)
                ->get();
        }*/
        if (!empty($search)) {
            $resultados = Product::where('status', 'active')
                ->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('title', 'like', "%" . substr($search, 0, -1) . "%") // Ejemplo: quitar la última letra
                        ->orWhere('slug', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('summary', 'like', "%{$search}%");
                })
                ->latest()
                ->limit(18)
                ->get();
        }

        return Inertia::render('Client/Search', [
            'products' => $resultados,
            'query' => $search
        ]);
    }

    // Autocompletado de búsqueda
    public function search(Request $request)
    {
        $search = $request->query('query', '');

        if (empty($search)) {
            return response()->json([]);
        }

        $products = Product::where('status', 'active')
            ->where(fn($query) => $query->where('title', 'like', "%{$search}%")
                ->orWhere('slug', 'like', "%{$search}%"))
            ->latest()
            ->limit(5)
            ->get(['id', 'title', 'slug']);

        return response()->json($products);
    }

    // Guardar búsquedas en la base de datos
    public function saveSearch(Request $request)
    {
        try {
            $searchQuery = trim($request->input('query'));
            if ($searchQuery) {
                $searchQuerie = SearchQuerie::firstOrCreate(['query' => $searchQuery], ['count' => 0]);
                $searchQuerie->increment('count');
                //['count' => DB::raw('COALESCE(count, 0) + 1')] //No funcioan no Sqlite
                return response()->json(['message' => 'Búsqueda guardada']);
            } else {
                return response()->json(['message' => 'Búsqueda vacía, no se guarda'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al guardar la búsqueda', 'error' => $e->getMessage()], 500); // Devuelve una respuesta de error
        }
    }
    // Obtener los más buscados
    public function popularSearches()
    {
        $popular = SearchQuerie::orderByDesc('count')
            ->limit(5)
            ->pluck('query');

        return response()->json($popular);
    }
}
