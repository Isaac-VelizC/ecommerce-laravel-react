<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role)
    {
        if (!Auth::check()) {
            return redirect('login'); // O redirige a donde necesites
        }

        $user = Auth::user();
        if (!$user->hasRole($role)) {
            abort(403, 'Acceso no autorizado.'); // O redirige a una página de error personalizada
        }

        return $next($request);
    }
}
