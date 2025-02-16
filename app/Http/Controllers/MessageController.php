<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::paginate(20);
        return Inertia::render('Dashboard/Message/Index', [
            'messages' => [
                'data' => $messages->items(),
                'current_page' => $messages->currentPage(),
                'last_page' => $messages->lastPage(),
                'per_page' => $messages->perPage(),
                'total' => $messages->total()
            ],
        ]);
    }

    public function messageFive()
    {
        $message = Message::whereNull('read_at')->limit(5)->get();
        return response()->json($message);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|min:2',
            'email' => 'required|email',
            'message' => 'required|string|min:15|max:250',
            'subject' => 'required|string',
            'phone' => 'required|string'
        ]);

        try {
            Message::create($validatedData);
            return redirect()->back()->with('success', 'Mensage enviado con exito');
            //$userPhoto = Auth::check() ? Auth::user()->photo : null;

            /*return response()->json([
                'url' => route('message.show', $message->id),
                'date' => $message->created_at->format('F d, Y h:i A'),
                'name' => $message->name,
                'email' => $message->email,
                'phone' => $message->phone,
                'message' => $message->message,
                'subject' => $message->subject,
                'photo' => $userPhoto
            ], 201);*/
        } catch (\Throwable $th) {
            //Log::error('Error al almacenar el mensaje: ' . $th->getMessage());
            return response()->json([
                'error' => 'Hubo un problema al guardar el mensaje. Inténtelo nuevamente.'
            ], 500);
        }
    }

    public function show($id)
    {
        $message = Message::find($id);
        if ($message) {
            $message->read_at = \Carbon\Carbon::now();
            $message->save();
            return Inertia::render('Dashboard/Message/Show', ['message' => $message]);
        } else {
            return back();
        }
    }

    public function destroy($id)
    {
        try {
            $message = Message::find($id);
            $message->delete();
            return response()->json(['success' => true, 'message' => 'Mensaje eliminado exitosamente'], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => false, 'message' => 'Error while deleting message'], 500);
        }
    }
}
