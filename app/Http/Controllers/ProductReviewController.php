<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User;
use App\Notifications\StatusNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class ProductReviewController extends Controller
{
    public function index()
    {
        $reviews = ProductReview::getAllReview();
        return Inertia::render('Dashboard/Review/Index', [
            'reviews' => [
                'data' => $reviews->items(),
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ],
        ]);
    }

    public function store(Request $request, $slug)
    {
        $validatedData = $request->validate([
            'rate' => 'required|numeric|min:1|max:5',
            'review' => 'nullable|string|max:500',
        ]);

        $product = Product::where('slug', $slug)->firstOrFail();

        $reviewData = [
            'product_id' => $product->id,
            'user_id' => Auth::id(),
            'rate' => $validatedData['rate'],
            'review' => $validatedData['review'] ?? null,
        ];

        try {
            ProductReview::create($reviewData);
        } catch (\Exception $e) {
            //\Log::error('Error al crear la reseña del producto: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Algo salió mal. Por favor, inténtalo de nuevo.');
        }

        $admins = User::where('role', 'admin')->get();
        $details = [
            'title' => '¡Nueva valoración de producto!',
            'actionURL' => route('page.product.detail', $product->slug),
            'fas' => 'fa-star',
        ];
        Notification::send($admins, new StatusNotification($details));

        // 6. Respuesta JSON con código de estado HTTP adecuado
        return redirect()->back()->with('success', '¡Gracias por tu valoración!');
    }

    public function edit($id)
    {
        $review = ProductReview::find($id);
        return view('backend.review.edit')->with('review', $review);
    }

    public function update(Request $request, $id)
    {
        $review = ProductReview::find($id);
        if ($review) {
            // $product_info=Product::getProductBySlug($request->slug);
            //  return $product_info;
            // return $request->all();
            $data = $request->all();
            $status = $review->fill($data)->update();

            // $user=User::where('role','admin')->get();
            // return $user;
            // $details=[
            //     'title'=>'Update Product Rating!',
            //     'actionURL'=>route('product-detail',$product_info->id),
            //     'fas'=>'fa-star'
            // ];
            // Notification::send($user,new StatusNotification($details));
            if ($status) {
                request()->session()->flash('success', 'Review Successfully updated');
            } else {
                request()->session()->flash('error', 'Something went wrong! Please try again!!');
            }
        } else {
            request()->session()->flash('error', 'Review not found!!');
        }

        return redirect()->route('review.index');
    }

    public function destroy($id)
    {
        try{
            $review = ProductReview::find($id);
            if (!$review) return response()->json(['error' => false, 'message' => 'Reseña no encontrado'], 500);
            $review->delete();
            return response()->json(['success' => true, 'message' => 'Reseña eliminado exitosamente'], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => false, 'message' => 'Error, inténtelo de nuevo: '], 500);
        }
    }
}
