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
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\MonitoringSiaranController;
use App\Http\Controllers\MonitoringPelaksanaanLiveController;
use App\Http\Controllers\MonitoringLiveController;

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
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::post('/categories/{category}/delete', [CategoryController::class, 'destroy'])->name('categories.destroy');
});

Route::middleware(['auth'])->group(function () {

    // HALAMAN FORM INPUT
    Route::get('/monitoring-siaran/create', [MonitoringSiaranController::class, 'create'])
        ->name('monitoring-siaran.create');

    // LIST + FILTER (SEMUA DATA)
    Route::get('/monitoring-siaran', [MonitoringSiaranController::class, 'index'])
        ->name('monitoring-siaran.index');

    // DATA SAYA
    Route::get('/monitoring-siaran/my-data', [MonitoringSiaranController::class, 'myData'])
        ->name('monitoring-siaran.my-data');
     // FORM EDIT - 
    Route::get('/monitoring-siaran/{monitoringSiaran}/edit', [MonitoringSiaranController::class, 'edit'])
        ->name('monitoring-siaran.edit');

    // SIMPAN
    Route::post('/monitoring-siaran', [MonitoringSiaranController::class, 'store'])
        ->name('monitoring-siaran.store');

    // UPDATE
    Route::put('/monitoring-siaran/{monitoringSiaran}', [MonitoringSiaranController::class, 'update'])
        ->name('monitoring-siaran.update');

    // DELETE
    Route::delete('/monitoring-siaran/{monitoringSiaran}', [MonitoringSiaranController::class, 'destroy'])
        ->name('monitoring-siaran.destroy');

    // EXPORT
    Route::get('/monitoring-siaran-export/csv', [MonitoringSiaranController::class, 'exportCsv'])
        ->name('monitoring-siaran.export.csv');

    Route::get('/monitoring-siaran-export/pdf', [MonitoringSiaranController::class, 'exportPdf'])
        ->name('monitoring-siaran.export.pdf');
        
   // ================= MONITORING LIVE ROUTES =================
    Route::prefix('monitoring-live')->group(function () {
        // Form input
        Route::get('/create', [MonitoringLiveController::class, 'create'])
            ->name('monitoring-live.create');
        
        // List semua data + filter
        Route::get('/', [MonitoringLiveController::class, 'index'])
            ->name('monitoring-live.index');
        
        // Data saya
        Route::get('/my-data', [MonitoringLiveController::class, 'myData'])
            ->name('monitoring-live.my-data');
        
        // Form edit
        Route::get('/{monitoringLive}/edit', [MonitoringLiveController::class, 'edit'])
            ->name('monitoring-live.edit');
        
        // Simpan data
        Route::post('/', [MonitoringLiveController::class, 'store'])
            ->name('monitoring-live.store');
        
        // Update data
        Route::put('/{monitoringLive}', [MonitoringLiveController::class, 'update'])
            ->name('monitoring-live.update');
        
        // Hapus data
        Route::delete('/{monitoringLive}', [MonitoringLiveController::class, 'destroy'])
            ->name('monitoring-live.destroy');
        
        // Export
        Route::get('/export/csv', [MonitoringLiveController::class, 'exportCsv'])
            ->name('monitoring-live.export.csv');
    });

    // ================= MONITORING PELAKSANAAN LIVE ROUTES =================
    Route::prefix('monitoring-pelaksanaan-live')->group(function () {
        // Form input
        Route::get('/create', [MonitoringPelaksanaanLiveController::class, 'create'])
            ->name('monitoring-pelaksanaan-live.create');
        
        // List semua data + filter
        Route::get('/', [MonitoringPelaksanaanLiveController::class, 'index'])
            ->name('monitoring-pelaksanaan-live.index');
        
        // Data saya
        Route::get('/my-data', [MonitoringPelaksanaanLiveController::class, 'myData'])
            ->name('monitoring-pelaksanaan-live.my-data');
        
        // Form edit
        Route::get('/{monitoringPelaksanaanLive}/edit', [MonitoringPelaksanaanLiveController::class, 'edit'])
            ->name('monitoring-pelaksanaan-live.edit');
        
        // Simpan data
        Route::post('/', [MonitoringPelaksanaanLiveController::class, 'store'])
            ->name('monitoring-pelaksanaan-live.store');
        
        // Update data
        Route::put('/{monitoringPelaksanaanLive}', [MonitoringPelaksanaanLiveController::class, 'update'])
            ->name('monitoring-pelaksanaan-live.update');
        
        // Hapus data
        Route::delete('/{monitoringPelaksanaanLive}', [MonitoringPelaksanaanLiveController::class, 'destroy'])
            ->name('monitoring-pelaksanaan-live.destroy');
        
        // Export
        Route::get('/export/csv', [MonitoringPelaksanaanLiveController::class, 'exportCsv'])
            ->name('monitoring-pelaksanaan-live.export.csv');
    });
});


require __DIR__.'/auth.php';