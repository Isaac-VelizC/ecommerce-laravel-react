<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $validatedData = $request->validate([
            'code' => 'string|required|min:5',
            'type' => 'required|in:Fijo,Porcentaje',
            'value' => 'required|numeric|min:1',
            'status' => 'required|in:active,inactive'
        ]);
        try {
            Coupon::create($validatedData);
            return redirect()->route('coupon.index')->with('success', 'Coupon successfully added');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error, Please try again: ' . $e->getMessage());
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
        $validatedData = $request->validate([
            'code' => 'string|required|min:5',
            'type' => 'required|in:Fijo,Porcentaje',
            'value' => 'required|numeric|min:1',
            'status' => 'required|in:active,inactive'
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
