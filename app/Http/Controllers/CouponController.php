<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CouponController extends Controller
{
    public function index()
    {
        $coupon = Coupon::orderBy('id', 'DESC')->paginate('10');
        return Inertia::render('Dashboard/Coupon/Index', [
            'coupons' => [
                'data' => $coupon->items(), // Los productos
                'current_page' => $coupon->currentPage(), // Página actual
                'last_page' => $coupon->lastPage(), // Última página
                'per_page' => $coupon->perPage(), // Elementos por página
                'total' => $coupon->total(), // Total de elementos
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Coupon/Create', ['isEditing' =>  false]);
    }

    public function store(Request $request)
    {
        // Validar el descuento si es tipo 'Porcentaje'
        if ($request->type === 'Porcentaje') {
            $request->validate([
                'value' => 'required|integer|min:1|max:100',
            ], [
                'value.min' => 'El valor debe ser un número entre 1 y 100.',
                'value.max' => 'El valor debe ser un número entre 1 y 100.'
            ]);
        }
        // Validar los demás campos
        $validatedData = $request->validate([
            'code'   => 'required|string|min:5',
            'type'   => ['required', Rule::in(['Fijo', 'Porcentaje'])],
            'value'  => 'required|numeric',
            'status' => ['required', Rule::in(['active', 'inactive'])]
        ]);
        try {
            Coupon::create($validatedData);
            return redirect()->route('coupon.index')->with('success', trans('Coupon successfully added'));
        } catch (\Exception $e) {
            //Log::error('Error al crear el cupón: ' . $e->getMessage());
            return redirect()->back()->with('error', trans('Error, Please try again') . ': ' . trans($e->getMessage()));
        }
    }


    public function edit($id)
    {
        try {
            $coupon = Coupon::find($id);
            return Inertia::render('Dashboard/Coupon/Create', [
                'coupon' => $coupon,
                'isEditing' =>  true
            ]);
        } catch (\Exception $e) {
            return redirect()->route('backend.coupon.index')->with('success', 'Coupon not found');
        }
    }

    public function update(Request $request, $id)
    {
        // Validar el descuento si es tipo 'Porcentaje'
        if ($request->type === 'Porcentaje') {
            $request->validate([
                'value' => 'required|integer|min:1|max:100',
            ], [
                'value.min' => 'El valor debe ser un número entre 1 y 100.',
                'value.max' => 'El valor debe ser un número entre 1 y 100.'
            ]);
        }
        // Validar los demás campos
        $validatedData = $request->validate([
            'code'   => 'required|string|min:5',
            'type'   => ['required', Rule::in(['Fijo', 'Porcentaje'])],
            'value'  => 'required|numeric',
            'status' => ['required', Rule::in(['active', 'inactive'])]
        ]);
        
        try {
            $coupon = Coupon::find($id);
            $coupon->fill($validatedData)->save();
            return redirect()->route('coupon.index')->with('success', 'Coupon Successfully updated');
        } catch (\Exception $e) {
            return redirect()->back()->with(
                'error',
                'Please try again ' . $e->getMessage()
            );
        }
    }

    public function destroy($id)
    {
        try {
            $coupon = Coupon::find($id);
            $coupon->delete();
            return response()->json(['success' => true, 'message' => 'Cupón eliminado exitosamente'], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => false, 'message' => 'Error, inténtelo de nuevo: '], 500);
        }
    }

    public function couponStore(Request $request)
    {
        $coupon = Coupon::where('code', $request->code)->first();
        if (!$coupon) {
            return back()->with('error', 'Invalid coupon code, Please try again');
        }
        if ($coupon) {
            $total_price = Cart::where('user_id', Auth::user()->id)->where('order_id', null)->sum('price');

            session()->put('coupon', [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'value' => $coupon->discount($total_price)
            ]);

            return back()->with('success', 'Coupon successfully applied');
        }
    }
}
