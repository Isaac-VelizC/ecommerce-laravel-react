<?php

namespace App\Http\Controllers;

use App\Models\User;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
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
                'data' => $users->items(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
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
            'photoFile' => 'nullable|image|mimes:jpg,png,webp|max:2048',
        ]);
        try {
            $data = $request->all();
            $data['password'] = Hash::make($request->password);

            $uploadedFile = Cloudinary::upload($request->file('photoFile')->getRealPath());
            $data['photo'] = $uploadedFile->getSecurePath();
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
            'password' => 'nullable|string|min:8',
            'status' => 'required|in:active,inactive',
            'photoFile' => 'nullable|image|mimes:jpg,png,webp|max:2048',
        ]);

        try {
            $user = User::findOrFail($id);
            // Actualiza el password solo si se proporciona
            if ($request->filled('password')) {
                $validatedData['password'] = Hash::make($validatedData['password']);
            } else {
                unset($validatedData['password']);
            }
            // Si se sube una nueva imagen, actualizar en Cloudinary
            if ($request->hasFile('photoFile')) {
                // (Opcional) Eliminar imagen anterior en Cloudinary
                if ($user->photo) {
                    Cloudinary::destroy($this->getPublicIdFromUrl($user->photo));
                }

                // Subir nueva imagen a Cloudinary
                $uploadedFile = Cloudinary::upload($request->file('photoFile')->getRealPath());
                $validatedData['photo'] = $uploadedFile->getSecurePath(); // Nueva URL de la imagen
            }
            $user->update($validatedData);
            return redirect()->route('user.index')->with('success', 'Usuario actualizado exitosamente.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Ocurrió un error, vuelve a intentarlo');
        }
    }

    private function getPublicIdFromUrl($url)
    {
        $parsedUrl = pathinfo($url);
        return $parsedUrl['filename'];
    }

    public function destroy($id)
    {
        try {
            // Buscar el usuario por ID y cambiar su estado
            $user = User::findOrFail($id);
            $user->status = ($user->status === 'active') ? 'inactive' : 'active';
            $user->save();
            // Redirigir con mensaje de éxito
            return response()->json(['success' => true, 'message' => 'Usuario ' . ($user->status === 'active' ? 'activado' : 'inactivado') . ' exitosamente.', 'user' => $user], 200);
        } catch (\Throwable $th) {
            // Manejo de errores
            return response()->json(['error' => 'Ocurrió un error, vuelve a intentarlo']);
        }
    }
}
