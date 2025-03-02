<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $fillable = ['quantity', 'image_id', 'status', 'product_id', 'talla_id', 'color_id'];

    public function color() {
        return $this->belongsTo(Color::class, 'color_id', 'id');
    }

    public function size() {
        return $this->belongsTo(Size::class, 'talla_id', 'id');
    }

    public function image() {
        return $this->belongsTo(ImageProduct::class, 'image_id', 'id');
    }

    public function product() {
        return $this->belongsTo(Product::class);
    }
    public function carts() {
        return $this->hasMany(Cart::class, 'inventary_id', 'id');
    }
}
