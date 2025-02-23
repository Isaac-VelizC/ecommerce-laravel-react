<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\FrontendController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PostCategoryController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PostTagController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductReviewController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('home');


Route::middleware(['auth', 'checkrole:admin'])->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');
    Route::get('/dashboard/totals', [AdminController::class, 'getTotals'])->name('get.totals');
    Route::get('/api/sales-data', [AdminController::class, 'salesData'])->name('sales.data');
    Route::get('/api/top-products', [AdminController::class, 'topProducts'])->name('top.products');
    //Banner
    Route::get('/banners', [BannerController::class, 'index'])->name('banner.index');
    Route::get('/banners/create', [BannerController::class, 'create'])->name('banner.create');
    Route::post('/banners/create', [BannerController::class, 'store'])->name('banner.store');
    Route::get('/banners/edit/{id?}', [BannerController::class, 'edit'])->name('banner.edit');
    Route::post('/banners/update/{id?}', [BannerController::class, 'update'])->name('banner.update');
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
    Route::post('/category/update/{id?}', [CategoryController::class, 'update'])->name('category.update');
    Route::delete('/category/delete/{id?}', [CategoryController::class, 'destroy'])->name('category.delete');
    Route::get('/api/categories/{id}/children', [CategoryController::class, 'getChildByParent']);
    //Products
    Route::get('/products', [ProductController::class, 'index'])->name('product.index');
    Route::get('/products/create', [ProductController::class, 'create'])->name('product.create');
    Route::post('/products/create', [ProductController::class, 'store'])->name('product.store');
    Route::get('/products/inventary/{slug}', [ProductController::class, 'PageFormInventary'])->name('product.create.inventary');
    Route::post('/products/inventary', [ProductController::class, 'storeInventary'])->name('product.inventary.store');
    Route::patch('/inventory/{id}', [ProductController::class, 'updateQuantity'])->name('inventory.update');
    Route::get('/products/show/{slug}', [ProductController::class, 'show'])->name('product.show');
    Route::get('/products/edit/{id?}', [ProductController::class, 'edit'])->name('product.edit');
    Route::post('/products/update/{id?}', [ProductController::class, 'update'])->name('product.update');
    Route::delete('/products/delete/{id?}', [ProductController::class, 'destroy'])->name('product.delete');
    ///Shipping o envios
    Route::get('/shipping', [ShippingController::class, 'index'])->name('shipping.index');
    Route::get('/shipping/create', [ShippingController::class, 'create'])->name('shipping.create');
    Route::post('/shipping/create', [ShippingController::class, 'store'])->name('shipping.store');
    Route::get('/shipping/edit/{id?}', [ShippingController::class, 'edit'])->name('shipping.edit');
    Route::put('/shipping/update/{id?}', [ShippingController::class, 'update'])->name('shipping.update');
    Route::delete('/shipping/delete/{id?}', [ShippingController::class, 'destroy'])->name('shipping.delete');
    // Orders o pedidos
    Route::get('/orders', [OrderController::class, 'index'])->name('order.index');
    Route::get('/order/view/{id}', [OrderController::class, 'show'])->name('order.show');
    Route::get('/order/pdf/{id}', [OrderController::class, 'pdf'])->name('order.pdf');
    //Reviews product
    Route::get('/product/reviews', [ProductReviewController::class, 'index'])->name('review.index');
    Route::delete('/product/reviews/delete/{id?}', [ProductReviewController::class, 'destroy'])->name('review.delete');
    //Posts
    Route::get('/posts', [PostController::class, 'index'])->name('post.index');
    Route::get('/posts/create', [PostController::class, 'create'])->name('post.create');
    Route::post('/posts/create', [PostController::class, 'store'])->name('post.store');
    Route::get('/posts/edit/{id?}', [PostController::class, 'edit'])->name('post.edit');
    Route::post('/posts/update/{id?}', [PostController::class, 'update'])->name('post.update');
    Route::delete('/api/posts/delete/{id?}', [PostController::class, 'destroy'])->name('post.delete');
    
    //Post categories
    Route::get('/categories/posts', [PostCategoryController::class, 'index'])->name('post.categories.index');
    Route::post('/api/posts/categories', [PostCategoryController::class, 'store'])->name('post.categories.store');
    Route::put('/api/posts/categories/update/{id?}', [PostCategoryController::class, 'update'])->name('post.categories.update');
    Route::delete('/categories/posts/delete/{id?}', [PostCategoryController::class, 'destroy'])->name('post.categories.delete');
    //Post Tags
    Route::get('/tags/posts', [PostTagController::class, 'index'])->name('post.tags.index');
    Route::post('/api/posts/tags', [PostTagController::class, 'store'])->name('post.tags.store');
    Route::delete('/tags/posts/delete/{id?}', [PostTagController::class, 'destroy'])->name('post.tags.delete');
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
    Route::post('/users/update/{id?}', [UsersController::class, 'update'])->name('user.update');
    Route::delete('/api/users/delete/{id?}', [UsersController::class, 'destroy'])->name('user.delete.status');
    //Settings
    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
    Route::post('/settings/update', [AdminController::class, 'settingsUpdate'])->name('settings.update');
    //Messages
    Route::get('/messages', [MessageController::class, 'index'])->name('messages.index');
    Route::get('/api/message/five', [MessageController::class, 'messageFive'])->name('messages.five');
    Route::get('/message/{id}', [MessageController::class, 'show'])->name('messages.show');
    Route::delete('/api/message/delete/{id?}', [MessageController::class, 'destroy'])->name('message.delete');
    // Notification
    Route::get('/notification/{id}', [NotificationController::class, 'show'])->name('admin.notification');
    Route::get('/notifications', [NotificationController::class, 'index'])->name('all.notification');
    Route::delete('/notification/{id}', [NotificationController::class, 'delete'])->name('notification.delete');
});

Route::middleware(['auth', 'checkrole:user', 'custom-auth'])->group(function () {
    //Carrito
    Route::get('/cart', [CartController::class, 'cart'])->name('cart');
    Route::get('/api/list/cart', [CartController::class, 'listCart'])->name('api.list.cart');
    Route::get('/add-to-cart/{slug}', [CartController::class, 'addToCart'])->name('add-to-cart');
    Route::post('/add-to-cart', [CartController::class, 'singleAddToCart'])->name('single-add-to-cart');
    Route::get('/cart-delete/{id}', [CartController::class, 'cartDelete'])->name('cart.delete');
    Route::post('/cart-update/{id}/{quantity}', [CartController::class, 'cartUpdate'])->name('cart.update');
    Route::get('/checkout', [CartController::class, 'checkout'])->name('checkout');
    //Route::post('/checkout', [CartController::class, 'checkoutStore'])->name('checkout.store');
    Route::post('cart/order', [OrderController::class, 'store'])->name('cart.order');
    // Favoritos
    Route::get('/api/wishlist', [WishlistController::class, 'getFavorites'])->name('get-favorites');
    Route::get('/wishlist/{slug}', [WishlistController::class, 'wishlist'])->name('add-to-wishlist');
    Route::delete('/wishlist-delete/{id}', [WishlistController::class, 'wishlistDelete'])->name('wishlist-delete');
    Route::get('/wishlist-delete-all', [WishlistController::class, 'wishlistDeleteAll'])->name('delete.all.favorites');
    // Product Review
    //Route::resource('/review', 'ProductReviewController');
    Route::post('/product/{slug}/review', [ProductReviewController::class, 'store'])->name('review.store');
    // Perfil
    Route::get('/account/profile', [ProfileController::class, 'edit'])->name('perfil.account');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/account/orders', [ProfileController::class, 'TagOrderClient'])->name('account.orders');
    Route::get('/account/reviews', [ProfileController::class, 'TagReviewClient'])->name('account.reviews');
    
});

Route::get('/settings/app', [FrontendController::class, 'settingsApp'])->name('settings.app');

// Frontend Routes
Route::get('/api/welcome', [HomeController::class, 'pageWelcome'])->name('page.welcome');
Route::get('/product/detail/{slug}', [FrontendController::class, 'productDetail'])->name('page.product.detail');
Route::get('/shop/{slug}', [FrontendController::class, 'productLists'])->name('page.product.category');

Route::get('/product-cat/{slug}', [FrontendController::class, 'productCat'])->name('product.cat');
Route::get('/product-sub-cat/{slug}/{sub_slug}', [FrontendController::class, 'productSubCat'])->name('product.sub.cat');
Route::get('/product-brand/{slug}', [FrontendController::class, 'productBrand'])->name('product.brand');

Route::get('/api/product/suggestions', [SearchController::class, 'search'])->name('search');
Route::get('/api/product/search/{search?}', [SearchController::class, 'productSearch'])->name('product.search');
Route::get('/api/popular-searches', [SearchController::class, 'popularSearches']);
Route::post('/api/save-search', [SearchController::class, 'saveSearch']);

Route::get('/blog', [FrontendController::class, 'PageBlog'])->name('blog');
Route::get('/favorites', [WishlistController::class, 'index'])->name('page.list.favorite');
Route::get('/products/all', [FrontendController::class, 'PageProducts'])->name('page.products');
Route::get('/about-us', [FrontendController::class, 'PageAboutUs'])->name('page.about.us');
Route::get('/contact', [FrontendController::class, 'PageContact'])->name('contact');
Route::post('/contact/message', [MessageController::class, 'store'])->name('contact.store');
Route::fallback(function () {
    return Inertia::render('Errors/404')->toResponse(request())->setStatusCode(404);
});

require __DIR__.'/auth.php';
