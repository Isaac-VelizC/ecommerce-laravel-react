<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FrontendController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    //Banner
    Route::get('/banners', [BannerController::class, 'index'])->name('banner.index');
    Route::get('/banners/create', [BannerController::class, 'create'])->name('banner.create');
    Route::post('/banners/create', [BannerController::class, 'store'])->name('banner.store');
    //Brands
    Route::get('/brands', [BrandController::class, 'index'])->name('brand.index');
    //Category
    Route::get('/category', [CategoryController::class, 'index'])->name('category.index');
    //Products
    Route::get('/products', [ProductController::class, 'index'])->name('product.index');
    
    //Settings
    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
});

Route::get('contact', [FrontendController::class, 'PageContact'])->name('contact');
Route::get('blog', [FrontendController::class, 'PageBlog'])->name('blog');

require __DIR__.'/auth.php';
