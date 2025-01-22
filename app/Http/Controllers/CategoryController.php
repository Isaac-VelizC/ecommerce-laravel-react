<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $category = Categorie::getAllCategory();
        return Inertia::render('Dashboard/Category/Index', [
            'categories' => $category
        ]);
    }

    public function create()
    {
        $parent_cats = Categorie::where('is_parent', 1)->orderBy('title', 'ASC')->get();
        return view('backend.category.create')->with('parent_cats', $parent_cats);
    }

    public function store(Request $request)
    {
        // return $request->all();
        $request->validate([
            'title' => 'string|required',
            'summary' => 'string|nullable',
            'photo' => 'string|nullable',
            'status' => 'required|in:active,inactive',
            'is_parent' => 'sometimes|in:1',
            'parent_id' => 'nullable|exists:categories,id',
        ]);
        $data = $request->all();
        $slug = Str::slug($request->title);
        $count = Categorie::where('slug', $slug)->count();
        if ($count > 0) {
            $slug = $slug . '-' . date('ymdis') . '-' . rand(0, 999);
        }
        $data['slug'] = $slug;
        $data['is_parent'] = $request->input('is_parent', 0);
        // return $data;   
        $status = Categorie::create($data);
        if ($status) {
            request()->session()->flash('success', 'Category successfully added');
        } else {
            request()->session()->flash('error', 'Error occurred, Please try again!');
        }
        return redirect()->route('category.index');
    }

    public function edit($id)
    {
        $parent_cats = Categorie::where('is_parent', 1)->get();
        $category = Categorie::findOrFail($id);
        return view('backend.category.edit')->with('category', $category)->with('parent_cats', $parent_cats);
    }

    public function update(Request $request, $id)
    {
        // return $request->all();
        $category = Categorie::findOrFail($id);
        $request->validate([
            'title' => 'string|required',
            'summary' => 'string|nullable',
            'photo' => 'string|nullable',
            'status' => 'required|in:active,inactive',
            'is_parent' => 'sometimes|in:1',
            'parent_id' => 'nullable|exists:categories,id',
        ]);
        $data = $request->all();
        $data['is_parent'] = $request->input('is_parent', 0);
        // return $data;
        $status = $category->fill($data)->save();
        if ($status) {
            request()->session()->flash('success', 'Category successfully updated');
        } else {
            request()->session()->flash('error', 'Error occurred, Please try again!');
        }
        return redirect()->route('category.index');
    }

    public function destroy($id)
    {
        $category = Categorie::findOrFail($id);
        $child_cat_id = Categorie::where('parent_id', $id)->pluck('id');
        // return $child_cat_id;
        $status = $category->delete();

        if ($status) {
            if (count($child_cat_id) > 0) {
                Categorie::shiftChild($child_cat_id);
            }
            request()->session()->flash('success', 'Category successfully deleted');
        } else {
            request()->session()->flash('error', 'Error while deleting category');
        }
        return redirect()->route('category.index');
    }

    public function getChildByParent(Request $request)
    {
        $category = Categorie::findOrFail($request->id);
        $child_cat = Categorie::getChildByParentID($request->id);
        // return $child_cat;
        if (count($child_cat) <= 0) {
            return response()->json(['status' => false, 'msg' => '', 'data' => null]);
        } else {
            return response()->json(['status' => true, 'msg' => '', 'data' => $child_cat]);
        }
    }
}
