<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostCategorie extends Model
{
    protected $fillable=['title','slug','status'];

    public function post(){
        return $this->hasMany(Post::class, 'post_cat_id','id')->where('status','active');
    }

    public static function getBlogByCategory($slug){
        return PostCategorie::with('post')->where('slug',$slug)->first();
    }
}
