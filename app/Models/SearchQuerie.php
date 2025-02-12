<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SearchQuerie extends Model
{
    use HasFactory;
    protected $table = 'search_queries';

    protected $fillable = ['query', 'count'];

    public $timestamps = false;
}
