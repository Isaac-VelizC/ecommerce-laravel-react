<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Size extends Model
{
    protected $fillable=['name'];

    public function productInventary() {
        return $this->belongsTo(Inventory::class, 'talla_id', 'id');
    }
}
