<?php

namespace App\Http\Controllers;

use App\Models\PostCategorie;
use Illuminate\Http\Request;

class PostCategoryController extends Controller
{
    public function index()
    {
        $postCategory=PostCategorie::orderBy('id','DESC')->paginate(10);
        return view('backend.postcategory.index')->with('postCategories',$postCategory);
    }

    public function create()
    {
        return view('backend.postcategory.create');
    }

    public function store(Request $request)
    {
        // return $request->all();
        $this->validate($request,[
            'title'=>'string|required',
            'status'=>'required|in:active,inactive'
        ]);
        $data=$request->all();
        $slug=Str::slug($request->title);
        $count=PostCategorie::where('slug',$slug)->count();
        if($count>0){
            $slug=$slug.'-'.date('ymdis').'-'.rand(0,999);
        }
        $data['slug']=$slug;
        $status=PostCategorie::create($data);
        if($status){
            request()->session()->flash('success','Post Category Successfully added');
        }
        else{
            request()->session()->flash('error','Please try again!!');
        }
        return redirect()->route('post-category.index');
    }

    public function edit($id)
    {
        $postCategory=PostCategorie::findOrFail($id);
        return view('backend.postcategory.edit')->with('postCategory',$postCategory);
    }

    public function update(Request $request, $id)
    {
        $postCategory=PostCategorie::findOrFail($id);
         // return $request->all();
         $this->validate($request,[
            'title'=>'string|required',
            'status'=>'required|in:active,inactive'
        ]);
        $data=$request->all();
        $status=$postCategory->fill($data)->save();
        if($status){
            request()->session()->flash('success','Post Category Successfully updated');
        }
        else{
            request()->session()->flash('error','Please try again!!');
        }
        return redirect()->route('post-category.index');
    }

    public function destroy($id)
    {
        $postCategory=PostCategorie::findOrFail($id);
       
        $status=$postCategory->delete();
        
        if($status){
            request()->session()->flash('success','Post Category successfully deleted');
        }
        else{
            request()->session()->flash('error','Error while deleting post category');
        }
        return redirect()->route('post-category.index');
    }
}
