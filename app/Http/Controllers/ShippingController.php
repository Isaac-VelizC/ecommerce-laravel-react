<?php

namespace App\Http\Controllers;

use App\Models\Shipping;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShippingController extends Controller
{
    public function index()
    {
        $shipping = Shipping::orderBy('id', 'DESC')->paginate(10);
        return Inertia::render('Dashboard/Shipping/Index', [
            'shippings' => [
                'data' => $shipping->items(),
                'current_page' => $shipping->currentPage(),
                'last_page' => $shipping->lastPage(),
                'per_page' => $shipping->perPage(),
                'total' => $shipping->total(),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Shipping/Create', ['isEditing' => false]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'type' => 'string|required',
            'price' => 'nullable|numeric',
            'status' => 'required|in:active,inactive'
        ]);
        try {
            Shipping::create($validatedData);
            return redirect()->route('shipping.index')->with('success', 'Envío creado exitosamente');
        } catch (\Throwable $th) {
            return back()->with('error', 'Error, inténtelo de nuevo: ' . $th->getMessage());
        }
    }

    public function edit($id)
    {
        $shipping = Shipping::find($id);
        if (!$shipping) {
            return back()->with('error', 'Envío no encotrado');
        }
        return Inertia::render('Dashboard/Shipping/Create', ['shipping' => $shipping, 'isEditing' => true]);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'type' => 'string|required',
            'price' => 'nullable|numeric',
            'status' => 'required|in:active,inactive'
        ]);
        try {
            $shipping = Shipping::find($id);
            $shipping->fill($validatedData)->save();
            return redirect()->route('shipping.index')->with('success', 'Envío actualizado exitosamente');
        } catch (\Throwable $th) {
            return back()->with('error', 'Error, inténtelo de nuevo: ' . $th->getMessage());
        }
    }

    public function destroy($id)
    {
        try{
            $shipping = Shipping::find($id);
            if (!$shipping) return response()->json(['error' => false, 'message' => 'Envío no encontrado'], 500);
            $shipping->delete();
            return response()->json(['success' => true, 'message' => 'Envío eliminado exitosamente'], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => false, 'message' => 'Error, inténtelo de nuevo: '], 500);
        }
    }
}
