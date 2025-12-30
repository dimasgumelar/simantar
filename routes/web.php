<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransmissionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserTransmissionController;
use App\Http\Controllers\WebController;
use App\Http\Controllers\MaintenancePeralatanController;
use App\Models\MaintenancePeralatan;
use App\Models\MasterDetailPeralatanMaintenance;
use App\Models\MasterPeralatanMaintenance;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }

    return redirect()->route('login');
});

Route::get('/dashboard', [WebController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/users/export', [UserController::class, 'export'])->name('users.export');
    Route::get('/transmissions/export', [TransmissionController::class, 'export'])->name('transmissions.export');
    Route::get('/inventories/export', [InventoryController::class, 'export'])->name('inventories.export');
    Route::get('/maintenances/export', [MaintenanceController::class, 'export'])->name('maintenances.export');
    Route::get('/tasks/export', [FeedbackController::class, 'export'])->name('tasks.export');
});

Route::middleware(['auth', 'role:admin|ketua tim'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/view', [UserController::class, 'show'])->name('users.view');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::post('/users/{user}/delete', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('/users/{user}/transmissions', [UserTransmissionController::class, 'userTransmissions'])->name('users.transmissions');
    Route::get('/users/{user}/transmissions/create', [UserTransmissionController::class, 'userTransmissionsCreate'])->name('users.transmissions.create');
    Route::post('/users/{user}/transmissions', [UserTransmissionController::class, 'store'])->name('users.transmissions.store');
    Route::post('/users/{user}/transmissions/{id}/delete', [UserTransmissionController::class, 'destroy'])->name('users.transmissions.destroy');

    Route::get('/transmissions/create', [TransmissionController::class, 'create'])->name('transmissions.create');
    Route::post('/transmissions', [TransmissionController::class, 'store'])->name('transmissions.store');
    Route::get('/transmissions/{transmission}/edit', [TransmissionController::class, 'edit'])->name('transmissions.edit');
    Route::post('/transmissions/{transmission}', [TransmissionController::class, 'update'])->name('transmissions.update');
    Route::post('/transmissions/{transmission}/delete', [TransmissionController::class, 'destroy'])->name('transmissions.destroy');
});

Route::middleware(['auth', 'role:admin|ketua tim|teknisi'])->group(function () {
    Route::get('/inventories/create', [InventoryController::class, 'create'])->name('inventories.create');
    Route::post('/inventories', [InventoryController::class, 'store'])->name('inventories.store');
    Route::get('/inventories/{inventory}/edit', [InventoryController::class, 'edit'])->name('inventories.edit');
    Route::post('/inventories/{inventory}', [InventoryController::class, 'update'])->name('inventories.update');
    Route::post('/inventories/{inventory}/delete', [InventoryController::class, 'destroy'])->name('inventories.destroy');

    Route::get('/maintenances', [MaintenanceController::class, 'index'])->name('maintenances.index');
    Route::get('/maintenances/create', [MaintenanceController::class, 'create'])->name('maintenances.create');
    Route::post('/maintenances', [MaintenanceController::class, 'store'])->name('maintenances.store');
    Route::get('/maintenances/{maintenance}/view', [MaintenanceController::class, 'show'])->name('maintenances.view');
    // Route::get('/maintenances/{maintenance}/edit', [MaintenanceController::class, 'edit'])->name('maintenances.edit');
    Route::post('/maintenances/{maintenance}', [MaintenanceController::class, 'update'])->name('maintenances.update');
    Route::post('/maintenances/{maintenance}/delete', [MaintenanceController::class, 'destroy'])->name('maintenances.destroy');
});

Route::middleware(['auth', 'role:admin|ketua tim|teknisi|operator'])->group(function () {
    Route::get('/transmissions', [TransmissionController::class, 'index'])->name('transmissions.index');
    Route::get('/transmissions/{transmission}/view', [TransmissionController::class, 'show'])->name('transmissions.view');
    Route::get('/inventories', [InventoryController::class, 'index'])->name('inventories.index');
    Route::get('/inventories/{inventory}/view', [InventoryController::class, 'show'])->name('inventories.view');

    Route::post('/feedbacks/{maintenance}/store', [FeedbackController::class, 'store'])->name('feedbacks.store');
    Route::post('/feedbacks/upload', [FeedbackController::class, 'upload'])->name('feedbacks.upload');
    Route::post('/feedbacks/{feedback}/delete', [FeedbackController::class, 'destroy'])->name('feedbacks.destroy');
    Route::get('/tasks', [FeedbackController::class, 'index'])->name('tasks.index');
    Route::post('/tasks/{maintenance}/start', [FeedbackController::class, 'start'])->name('tasks.start');
    Route::get('/tasks/{maintenance}/view', [FeedbackController::class, 'show'])->name('tasks.view');
    Route::post('/tasks/{maintenance}/complete', [FeedbackController::class, 'complete'])->name('tasks.complete');

    //Maintenance Harian
    Route::get('/transmissionmaintenance', [MaintenancePeralatanController::class, 'index'])->name('transmissionmaintenance.index');
    //Route::get('/dailymaintenance/{daily}/view', [MaintenancePeralatanController::class, 'show'])->name('daily.view');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::post('/categories/{category}/delete', [CategoryController::class, 'destroy'])->name('categories.destroy');
});

require __DIR__ . '/auth.php';
