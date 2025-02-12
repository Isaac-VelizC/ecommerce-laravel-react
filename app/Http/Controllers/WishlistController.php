<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\WishList;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WishlistController extends Controller
{
    protected $product = null;
    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    public function index()
    {
        return Inertia::render('Client/ListFavorite');
    }

    public function getFavorites(): JsonResponse
    {
        try {
            $favorites = WishList::with('product')
                ->where('user_id', Auth::id())
                ->latest()
                ->get();

            return response()->json([
                'success' => true,
                'favorites' => $favorites
            ], 200);
        } catch (\Exception $e) {
            //Log::error('Error al obtener favoritos del usuario ' . Auth::id() . ': ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los favoritos. Por favor, inténtalo de nuevo.'
            ], 500); // Error interno del servidor
        }
    }

    public function wishlist($slug)
    {
        try {
            $product = Product::where('slug', $slug)->firstOrFail();
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Producto no encontrado'], 404);
        }
        $idUser = Auth::id();
        // Alternar entre agregar o eliminar de favoritos
        $wishlistItem = WishList::where('user_id', $idUser)
            ->where('product_id', $product->id)
            ->first();

        if ($wishlistItem) {
            $wishlistItem->delete();
            return response()->json(['success' => 'Product removed from wishlist'], 200);
        } else {
            WishList::updateOrCreate(
                ['user_id' => $idUser, 'product_id' => $product->id], // Buscar si ya existe
                ['user_id' => $idUser, 'product_id' => $product->id]  // Si no existe, lo crea
            );
            return response()->json(['success' => 'Product added to wishlist'], 200);
        }
    }

    public function wishlistDelete(Request $request)
    {
        $wishlist = Wishlist::find($request->id);
        if ($wishlist) {
            $wishlist->delete();
            return response()->json(['success' => 'Eliminada con éxito de la lista de deseos.'], 200);
        }
        return response()->json(['error' => 'Por favor intentalo de nuevo'], 201);
    }

    public function wishlistDeleteAll()
    {
        $userId = Auth::id();
        $deleted = Wishlist::where('user_id', $userId)->delete();
        if ($deleted) {
            // Si se eliminaron registros, devolver un mensaje de éxito
            return redirect()->back()->with('success', 'Todos los elementos de la lista de deseos han sido eliminados.');
        } else {
            // Si no se eliminaron registros (ej. la lista estaba vacía), devolver un mensaje informativo
            return redirect()->back()->with('info', 'Tu lista de deseos ya está vacía.');
        }
    }
}
