<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\FrontendController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PostCategoryController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PostTagController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
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
    Route::get('/banners/edit/{id?}', [BannerController::class, 'edit'])->name('banner.edit');
    Route::put('/banners/update/{id?}', [BannerController::class, 'update'])->name('banner.update');
    Route::delete('/banners/delete/{id?}', [BannerController::class, 'destroy'])->name('banner.delete');
    //Brands
    Route::get('/brands', [BrandController::class, 'index'])->name('brand.index');
    Route::post('/brands/create', [BrandController::class, 'store'])->name('brand.store');
    Route::put('/brands/update/{id?}', [BrandController::class, 'update'])->name('brand.update');
    Route::delete('/brands/delete/{id?}', [BrandController::class, 'destroy'])->name('brand.delete');
    //Category
    Route::get('/category', [CategoryController::class, 'index'])->name('category.index');
    Route::get('/category/create', [CategoryController::class, 'create'])->name('category.create');
    Route::post('/category/create', [CategoryController::class, 'store'])->name('category.store');
    Route::get('/category/edit/{id?}', [CategoryController::class, 'edit'])->name('category.edit');
    Route::put('/category/update/{id?}', [CategoryController::class, 'update'])->name('category.update');
    Route::delete('/category/delete/{id?}', [CategoryController::class, 'destroy'])->name('category.delete');
    Route::get('/api/categories/{id}/children', [CategoryController::class, 'getChildByParent']);
    //Products
    Route::get('/products', [ProductController::class, 'index'])->name('product.index');
    Route::get('/products/create', [ProductController::class, 'create'])->name('product.create');
    Route::post('/products/create', [ProductController::class, 'store'])->name('product.store');
    Route::get('/products/edit/{id?}', [ProductController::class, 'edit'])->name('product.edit');
    Route::put('/products/update/{id?}', [ProductController::class, 'update'])->name('product.update');
    Route::delete('/products/delete/{id?}', [ProductController::class, 'destroy'])->name('product.delete');
    //Posts
    Route::get('/posts', [PostController::class, 'index'])->name('post.index');
    Route::get('/posts/create', [PostController::class, 'create'])->name('post.create');
    Route::post('/posts/create', [PostController::class, 'store'])->name('post.store');
    Route::get('/posts/edit/{id?}', [PostController::class, 'edit'])->name('post.edit');
    Route::put('/posts/update/{id?}', [PostController::class, 'update'])->name('post.update');
    Route::delete('/api/posts/delete/{id?}', [PostController::class, 'destroy'])->name('post.delete');
    //Post categories
    Route::get('/posts/categories', [PostCategoryController::class, 'index'])->name('post.categories.index');
    Route::post('/api/posts/categories', [PostCategoryController::class, 'store'])->name('post.categories.store');
    Route::put('/api/posts/categories/update/{id?}', [PostCategoryController::class, 'update'])->name('post.categories.update');
    Route::delete('/posts/categories/delete/{id?}', [PostCategoryController::class, 'destroy'])->name('post.categories.delete');
    //Post Tags
    Route::get('/posts/tags', [PostTagController::class, 'index'])->name('post.tags.index');
    Route::post('/api/posts/tags', [PostTagController::class, 'store'])->name('post.tags.store');
    Route::delete('/posts/tags/delete/{id?}', [PostTagController::class, 'destroy'])->name('post.tags.delete');
    //Coupons
    Route::get('/coupon', [CouponController::class, 'index'])->name('coupon.index');
    Route::get('/coupon/create', [CouponController::class, 'create'])->name('coupon.create');
    Route::post('/coupon/create', [CouponController::class, 'store'])->name('coupon.store');
    Route::get('/coupon/edit/{id?}', [CouponController::class, 'edit'])->name('coupon.edit');
    Route::put('/coupon/update/{id?}', [CouponController::class, 'update'])->name('coupon.update');
    Route::delete('/api/coupon/delete/{id?}', [CouponController::class, 'destroy'])->name('coupon.delete');
    //Users
    Route::get('/users', [UsersController::class, 'index'])->name('user.index');
    Route::get('/users/create', [UsersController::class, 'create'])->name('user.create');
    Route::post('/users/create', [UsersController::class, 'store'])->name('user.store');
    Route::get('/users/edit/{id?}', [UsersController::class, 'edit'])->name('user.edit');
    Route::put('/users/update/{id?}', [UsersController::class, 'update'])->name('user.update');
    Route::delete('/api/users/delete/{id?}', [UsersController::class, 'destroy'])->name('user.delete');
    //Settings
    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
    Route::patch('/settings/update', [AdminController::class, 'settingsUpdate'])->name('settings.update');
});

Route::get('api/welcome', [HomeController::class, 'pageWelcome'])->name('page.welcome');
Route::get('product/detail/{slug}', [FrontendController::class, 'productDetail'])->name('page.product.detail');
Route::get('favorites', [WishlistController::class, 'index'])->name('page.list.favorite');
Route::get('shop', [FrontendController::class, 'productLists'])->name('page.shop');
Route::get('blog', [FrontendController::class, 'PageBlog'])->name('blog');
Route::get('contact', [FrontendController::class, 'PageContact'])->name('contact');

Route::get('/cart', [CartController::class, 'cart'])->name('cart');
Route::get('/api/list/cart', [CartController::class, 'listCart'])->name('api.list.cart');
Route::get('/add-to-cart/{slug}', [CartController::class, 'addToCart'])->name('add-to-cart');
//Route::post('/add-to-cart', [CartController::class, 'singleAddToCart'])->name('single-add-to-cart');
Route::get('/cart-delete/{id}', [CartController::class, 'cartDelete'])->name('cart.delete');
Route::post('cart-update', [CartController::class, 'cartUpdate'])->name('cart.update');

Route::get('/checkout', [CartController::class, 'checkout'])->name('checkout')->middleware('user');

require __DIR__.'/auth.php';
