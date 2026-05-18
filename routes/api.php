<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/conversations', [ChatController::class, 'createConversation']);
Route::get('/conversations', [ChatController::class, 'getConversations']);
Route::get('/conversations/{id}/messages', [ChatController::class, 'getMessages']);
Route::post('/conversations/{id}/messages', [ChatController::class, 'sendMessage']);
