<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UsersController extends Controller
{
    public function index()
    {
        $users = User::where('role', '!=', 'admin')->orderBy('id', 'ASC')->paginate(10);
        return Inertia::render('Dashboard/Users/Index', [
            'users' => [
                'data' => $users->items(), // Los productos
                'current_page' => $users->currentPage(), // Página actual
                'last_page' => $users->lastPage(), // Última página
                'per_page' => $users->perPage(), // Elementos por página
                'total' => $users->total(), // Total de elementos
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Users/Create', ['isEditing' => false]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'string|required|max:30',
            'email' => 'string|required|unique:users',
            'password' => 'string|required',
            'role' => 'required|in:admin,user',
            'status' => 'required|in:active,inactive',
            'photo' => 'nullable|string',
        ]);
        try {
            $data = $request->all();
            $data['password'] = Hash::make($request->password);
            User::create($data);
            return redirect()->route('user.index')->with('success', 'Usuario creado exitosamente.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Ocurrió un error, vuelve a intentarlo');
        }
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);
        return Inertia::render('Dashboard/Users/Create', ['user' => $user, 'isEditing' => true]);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:30',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'role' => 'required|in:admin,user',
            'password' => 'nullable|string|min:8', // Recomiendo añadir min:8
            'status' => 'required|in:active,inactive',
            'photo' => 'nullable|string',
        ]);

        try {
            $user = User::findOrFail($id);
            // Actualiza el password solo si se proporciona
            if ($request->filled('password')) {
                $validatedData['password'] = Hash::make($validatedData['password']);
            } else {
                unset($validatedData['password']);
            }
            $user->update($validatedData);
            return redirect()->route('user.index')->with('success', 'Usuario actualizado exitosamente.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Ocurrió un error, vuelve a intentarlo');
        }
    }

    public function destroy($id)
    {
        try {
            $delete = User::findorFail($id);
            $delete->delete();
            return redirect()->back()->with('success', 'Usuario eliminado exitosamente.');
        } catch (\Throwable $th) {
            dd($th);
            return redirect()->back()->with('error', 'Ocurrió un error, vuelve a intentarlo');
        }
    }
}
