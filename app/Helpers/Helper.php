<?php

namespace App\Helpers;

use App\Models\Inventory;
use App\Models\Size;
use Illuminate\Support\Facades\Auth;

class Helper
{
    public static function setWishlistStatus($products)
    {
        if (Auth::check()) {
            $userId = Auth::id();

            foreach ($products as $product) {
                $product->is_in_wishlist = $product->isInWishlist($userId, $product->id);
            }
        }
        return $products;
    }

    public static function inventorySelected($productId, $sizeId, $colorId)
    {
        return Inventory::where('product_id', $productId)
            ->where('talla_id', $sizeId)
            ->where('color_id', $colorId)->first();
    }

    public static function sizesProduct($idProduct) {
        $sizes = Inventory::where('product_id', $idProduct)->pluck('talla_id')->toArray();
        $sizes = Size::whereIn('id', $sizes)->get();
        return $sizes;
    }
}
