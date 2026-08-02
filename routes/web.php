<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShellController;
use App\Http\Controllers\RemoteController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::view('/', 'index');
Route::view('/terminal', 'applications.terminal')->name('apps.terminal');
Route::view('/settings', 'applications.settings')->name('apps.settings');

Route::get('/info', [RemoteController::class, 'info'])->name('remote.info');

Route::prefix('/shell')->group(function () {
    Route::post('/input', [ShellController::class, 'in'])->name('shell.in');
});
