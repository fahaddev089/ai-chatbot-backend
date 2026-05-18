<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use OpenAI\Laravel\Facades\OpenAI;

class ChatController extends Controller
{
    // New conversation banao
    public function createConversation()
    {
        $conversation = Conversation::create(['title' => 'New Chat']);
        return response()->json($conversation);
    }

    // Message bhejo
    public function sendMessage(Request $request, $conversationId)
    {
        $request->validate([
            'message' => 'required|string',
            'image' => 'nullable|image|max:5120',
        ]);

        $conversation = Conversation::findOrFail($conversationId);

        $isFirstMessage = ! $conversation->messages()->exists();
        if ($isFirstMessage) {
            $title = preg_replace('/\s+/', ' ', trim($request->message));
            $conversation->update([
                'title' => Str::limit($title ?: 'Image conversation', 70, ''),
            ]);
        }

        // Image handle karo
        $imagePath = null;
        $imageContent = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('chat-images', 'public');
            $imageData = base64_encode(file_get_contents($request->file('image')->path()));
            $imageContent = "data:image/jpeg;base64,{$imageData}";
        }

        // User message save karo
        Message::create([
            'conversation_id' => $conversationId,
            'role' => 'user',
            'content' => $request->message,
            'image_path' => $imagePath,
        ]);

        // Previous messages lo
        $history = $conversation->messages()
            ->orderBy('created_at')
            ->get()
            ->map(function ($msg) {
                return [
                    'role' => $msg->role,
                    'content' => $msg->content,
                ];
            })->toArray();

        // OpenAI ko bhejo
        $messages = $history;
        if ($imageContent) {
            array_pop($messages);
            $messages[] = [
                'role' => 'user',
                'content' => [
                    ['type' => 'text', 'text' => $request->message],
                    ['type' => 'image_url', 'image_url' => ['url' => $imageContent]],
                ],
            ];
        }

        $response = OpenAI::chat()->create([
            'model' => 'gpt-4o',
            'messages' => $messages,
            'max_tokens' => 1000,
        ]);

        $aiReply = $response->choices[0]->message->content;

        // AI response save karo
        $aiMessage = Message::create([
            'conversation_id' => $conversationId,
            'role' => 'assistant',
            'content' => $aiReply,
        ]);

        return response()->json([
            'reply' => $aiReply,
            'message_id' => $aiMessage->id,
            'conversation' => $conversation->fresh(),
        ]);
    }

    // Conversation history lo
    public function getMessages($conversationId)
    {
        $conversation = Conversation::with('messages')->findOrFail($conversationId);
        return response()->json($conversation);
    }

    // Sari conversations lo
    public function getConversations()
    {
        $conversations = Conversation::latest()->get();
        return response()->json($conversations);
    }
}
