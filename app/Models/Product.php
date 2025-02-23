<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['title', 'slug', 'summary', 'description', 'cat_id', 'child_cat_id', 'price', 'brand_id', 'discount', 'status', 'photo', 'size', 'stock', 'is_featured', 'condition'];

    public function cat_info()
    {
        return $this->hasOne(Categorie::class, 'id', 'cat_id');
    }
    public function sub_cat_info()
    {
        return $this->hasOne(Categorie::class, 'id', 'child_cat_id');
    }
    public static function getAllProduct()
    {
        return Product::with(['cat_info', 'sub_cat_info', 'brand'])->orderBy('id', 'desc')->paginate(10);
    }
    public function rel_prods()
    {
        return $this->hasMany(Product::class, 'cat_id', 'cat_id')->where('status', 'active')->orderBy('id', 'DESC')->limit(8);
    }
    public function getReview()
    {
        return $this->hasMany(ProductReview::class, 'product_id', 'id')->with('user_info')->where('status', 'active')->orderBy('id', 'DESC');
    }

    public function images()
    {
        return $this->hasMany(ImageProduct::class, 'product_id', 'id')->orderBy('id', 'DESC');
    }

    public function inventories()
    {
        return $this->hasMany(Inventory::class, 'product_id', 'id')->orderBy('id', 'DESC');
    }

    public function updateStock()
    {
        $this->stock = $this->inventories()->sum('quantity');
        $this->save();
    }

    public static function getProductBySlug($slug, $userId = null)
    {
        $product = Product::withAvg('getReview', 'rate')
            ->with(['cat_info', 'rel_prods', 'getReview', 'brand'])
            ->where('slug', $slug)
            ->first();

        if ($product && $userId) {
            $product->is_in_wishlist = $product->isInWishlist($userId, $product->id);
        }

        return $product;
    }

    public static function countActiveProduct()
    {
        $data = Product::where('status', 'active')->count();
        if ($data) {
            return $data;
        }
        return 0;
    }

    public function carts()
    {
        return $this->hasMany(Cart::class)->whereNotNull('order_id');
    }

    public function isInWishlist($userId, $productId)
    {
        return $this->hasMany(WishList::class, 'product_id')
            ->where('user_id', $userId)
            ->where('product_id', $productId)
            ->exists();
    }

    public function brand()
    {
        return $this->hasOne(Brand::class, 'id', 'brand_id');
    }
}
