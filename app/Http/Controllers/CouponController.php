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
        return view('backend.coupon.index')->with('coupons', $coupon);
    }

    public function create()
    {
        return view('backend.coupon.create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'code' => 'string|required',
            'type' => 'required|in:fixed,percent',
            'value' => 'required|numeric',
            'status' => 'required|in:active,inactive'
        ]);
        try {
            Coupon::create($validatedData);
            return redirect()->route('coupon.index')->with('success', 'Coupon successfully added');
        } catch (\Exception $e) {
            return redirect()->route('coupon.index')->with('error', 'Error, Please try again: ' . $e->getMessage());
        }
    }

    public function edit($id)
    {
        try {
            $coupon = Coupon::find($id);
            return Inertia::render('backend.coupon.edit', [
                'coupon' => $coupon
            ]);
        } catch (\Exception $e) {
            return redirect()->route('backend.coupon.index')->with('success', 'Coupon not found');
        }
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'code' => 'string|required',
            'type' => 'required|in:fixed,percent',
            'value' => 'required|numeric',
            'status' => 'required|in:active,inactive'
        ]);
        try {
            $coupon = Coupon::find($id);
            $coupon->fill($validatedData)->save();
            return Inertia::render('coupon.index', [
                'success' => 'Coupon Successfully updated'
            ]);
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
            // Mensaje de éxito
            return redirect()->route('coupon.index')->with('success', 'Coupon successfully deleted');
        } catch (\Exception $e) {
            // Manejo de errores
            return redirect()->back()->with('error', 'Error, Please try again: ' . $e->getMessage());
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
