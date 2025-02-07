<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    protected $fillable = ['title', 'slug', 'summary', 'photo', 'status', 'is_parent', 'parent_id', 'added_by'];

    public function children()
    {
        return $this->hasMany(Categorie::class, 'parent_id');
    }

    public function parent_info()
    {
        return $this->hasOne(Categorie::class, 'id', 'parent_id');
    }
    public static function getAllCategory()
    {
        return  Categorie::orderBy('id', 'DESC')->with('parent_info')->paginate(10);
    }

    public static function shiftChild($cat_id)
    {
        return Categorie::whereIn('id', $cat_id)->update(['is_parent' => 1]);
    }
    public static function getChildByParentID($id)
    {
        return Categorie::where('parent_id', $id)->orderBy('id', 'ASC')->pluck('title', 'id');
    }

    public function child_cat()
    {
        return $this->hasMany(Categorie::class, 'parent_id', 'id')->where('status', 'active');
    }
    public static function getAllParentWithChild()
    {
        return Categorie::with('child_cat')->where('is_parent', 1)->where('status', 'active')->orderBy('title', 'ASC')->get();
    }
    public function products()
    {
        return $this->hasMany(Product::class, 'cat_id', 'id')->where('status', 'active');
    }
    public function sub_products()
    {
        return $this->hasMany(Product::class, 'child_cat_id', 'id')->where('status', 'active');
    }
    public static function getProductByCat($slug)
    {
        // dd($slug);
        return Categorie::with('products')->where('slug', $slug)->first();
        // return Product::where('cat_id',$id)->where('child_cat_id',null)->paginate(10);
    }
    public static function getProductBySubCat($slug)
    {
        // return $slug;
        return Categorie::with('sub_products')->where('slug', $slug)->first();
    }
    public static function countActiveCategoryriCategorie()
    {
        $data = Categorie::where('status', 'active')->count();
        if ($data) {
            return $data;
        }
        return 0;
    }
}
