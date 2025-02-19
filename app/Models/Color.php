<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Color extends Model
{
    use HasFactory;

    protected $table = "colors";
    
    protected $fillable=['name', 'codigo_hex'];

    public function productInventary() {
        return $this->belongsTo(Inventory::class, 'color_id', 'id');
    }
}
