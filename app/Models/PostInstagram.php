<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostInstagram extends Model
{
    protected $fillable = ['instagram_id', 'image_url', 'permalink', 'caption', 'is_active'];
}
