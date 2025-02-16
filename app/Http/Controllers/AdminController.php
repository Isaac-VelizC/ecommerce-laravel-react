<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Categorie;
use App\Models\Order;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $data = User::select(DB::raw("COUNT(*) as count"), DB::raw("DAYNAME(created_at) as day_name"), DB::raw("DAY(created_at) as day"))
            ->where('created_at', '>', Carbon::today()->subDays(6))
            ->groupBy('day_name', 'day')
            ->orderBy('day')
            ->get();

        return Inertia::render('Dashboard', [
            'users' => $data
        ]);
    }

    public function getTotals()
    {
        return response()->json([
            'totalProducts' => Product::count(),
            'totalCategories' => Categorie::where('status', 'active')->count(),
            'totalUsersActives' => User::where('status', 'active')->count(),
            'totalOrders' => Order::where('status', 'new')->count(),
        ]);
    }

    public function salesData()
    {
        $sales = Order::select(
            DB::raw("DATE(created_at) as date"),
            DB::raw("SUM(total_amount) as total_sales")
        )
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->groupBy('created_at')
            ->orderBy('created_at')
            ->get();

        return response()->json($sales);
    }

    public function topProducts()
    {
        $products = Cart::whereNotNull('order_id')
            ->join('products', 'carts.product_id', '=', 'products.id')
            ->select(
                'products.title', // Asegúrate de que esta columna existe en `products`
                DB::raw("SUM(carts.quantity) as total_sold")
            )
            ->groupBy('products.title')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        return response()->json($products);
    }

    public function settings()
    {
        $data = Setting::first();
        return Inertia::render('Dashboard/Settings', ['infoApp' => $data]);
    }

    public function settingsUpdate(Request $request)
    {
        $validatedData = $request->validate([
            'short_des' => 'required|string',
            'description' => 'required|string',
            'photo' => 'required',
            'logo' => 'required',
            'address' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
        ]);
        try {
            $settings = Setting::first();
            $settings->fill($validatedData)->save();
            return back()->with('success', 'Configuración actualizada con éxito');
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return back()->with('error', 'Por favor, inténtelo de nuevo');
        }
    }

    public function changePassword()
    {
        return view('backend.layouts.changePassword');
    }

    /*public function changPasswordStore(Request $request)
    {
        $request->validate([
            'current_password' => ['required', new MatchOldPassword],
            'new_password' => ['required'],
            'new_confirm_password' => ['same:new_password'],
        ]);

        User::find(auth()->user()->id)->update(['password'=> Hash::make($request->new_password)]);

        return redirect()->route('admin')->with('success','Password successfully changed');
    }

    
    public function userPieChart(Request $request){
        // dd($request->all());
        $data = User::select(DB::raw("COUNT(*) as count"), DB::raw("DAYNAME(created_at) as day_name"), DB::raw("DAY(created_at) as day"))
        ->where('created_at', '>', Carbon::today()->subDay(6))
        ->groupBy('day_name','day')
        ->orderBy('day')
        ->get();
     $array[] = ['Name', 'Number'];
     foreach($data as $key => $value)
     {
       $array[++$key] = [$value->day_name, $value->count];
     }
    //  return $data;
     return view('backend.index')->with('course', json_encode($array));
    }

    public function storageLink(){
        // check if the storage folder already linked;
        if(File::exists(public_path('storage'))){
            // removed the existing symbolic link
            File::delete(public_path('storage'));

            //Regenerate the storage link folder
            try{
                Artisan::call('storage:link');
                request()->session()->flash('success', 'Successfully storage linked.');
                return redirect()->back();
            }
            catch(\Exception $exception){
                request()->session()->flash('error', $exception->getMessage());
                return redirect()->back();
            }
        }
        else{
            try{
                Artisan::call('storage:link');
                request()->session()->flash('success', 'Successfully storage linked.');
                return redirect()->back();
            }
            catch(\Exception $exception){
                request()->session()->flash('error', $exception->getMessage());
                return redirect()->back();
            }
        }
    }*/
}
