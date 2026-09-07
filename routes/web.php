<?php

use App\Http\Controllers\DutyScheduleController;
use App\Http\Controllers\GuestBookController;
use App\Http\Controllers\LogbookController;
use App\Http\Controllers\LogbookEventController;
use App\Http\Controllers\LogbookNoteController;
use App\Http\Controllers\LogbookPowerController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransmissionAdminController;
use App\Http\Controllers\TransmissionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserTransmissionController;
use App\Http\Controllers\WebController;
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
    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.photo.update');
    Route::delete('/profile/photo', [ProfileController::class, 'destroyPhoto'])->name('profile.photo.destroy');

    Route::get('/users/export', [UserController::class, 'export'])->name('users.export');
    Route::get('/transmissions/export', [TransmissionController::class, 'export'])->name('transmissions.export');
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
    Route::delete('/users/{user}/transmissions/{id}/delete', [UserTransmissionController::class, 'destroy'])->name('users.transmissions.destroy');

    Route::get('/transmissions/create', [TransmissionController::class, 'create'])->name('transmissions.create');
    Route::post('/transmissions', [TransmissionController::class, 'store'])->name('transmissions.store');
    Route::get('/transmissions/{transmission}/edit', [TransmissionController::class, 'edit'])->name('transmissions.edit');
    Route::post('/transmissions/{transmission}', [TransmissionController::class, 'update'])->name('transmissions.update');
    Route::post('/transmissions/{transmission}/delete', [TransmissionController::class, 'destroy'])->name('transmissions.destroy');

    Route::get('/transmissions/{transmission}/users', [UserTransmissionController::class, 'transmissionUsers'])->name('transmissions.users');
    Route::get('/transmissions/{transmission}/users/create', [UserTransmissionController::class, 'transmissionUsersCreate'])->name('transmissions.users.create');
    Route::post('/transmissions/{transmission}/users', [UserTransmissionController::class, 'storeByTransmission'])->name('transmissions.users.store');
    Route::delete('/transmissions/{transmission}/users/{id}/delete', [UserTransmissionController::class, 'destroyByTransmission'])->name('transmissions.users.destroy');
});

Route::middleware(['auth', 'role:admin|ketua tim|teknisi|operator|koordinator'])->group(function () {
    Route::get('/transmissions', [TransmissionController::class, 'index'])->name('transmissions.index');
    Route::get('/transmissions/{transmission}/view', [TransmissionController::class, 'show'])->name('transmissions.view');

    Route::get('/logbooks', [LogbookController::class, 'index'])->name('logbooks.index');
    Route::get('/logbooks/{logbook}/view', [LogbookController::class, 'show'])->name('logbooks.view');
    Route::get('/logbooks/{logbook}/pdf', [LogbookController::class, 'pdf'])->name('logbooks.pdf');
    Route::get('/logbooks/{logbook}/csv', [LogbookController::class, 'csv'])->name('logbooks.csv');
});

Route::middleware(['auth', 'role:operator|koordinator'])->group(function () {
    Route::post('/logbooks', [LogbookController::class, 'store'])->name('logbooks.store');
    Route::post('/logbooks/{logbook}/sign', [LogbookController::class, 'sign'])->name('logbooks.sign');
    Route::post('/logbooks/{logbook}/copy-events', [LogbookController::class, 'copyEvents'])->name('logbooks.events.copy');

    Route::post('/logbooks/{logbook}/events', [LogbookEventController::class, 'store'])->name('logbooks.events.store');
    Route::post('/logbooks/{logbook}/events/{event}', [LogbookEventController::class, 'update'])->name('logbooks.events.update');
    Route::delete('/logbooks/{logbook}/events/{event}/delete', [LogbookEventController::class, 'destroy'])->name('logbooks.events.destroy');

    Route::post('/logbooks/{logbook}/notes', [LogbookNoteController::class, 'store'])->name('logbooks.notes.store');
    Route::post('/logbooks/{logbook}/notes/{note}', [LogbookNoteController::class, 'update'])->name('logbooks.notes.update');
    Route::delete('/logbooks/{logbook}/notes/{note}/delete', [LogbookNoteController::class, 'destroy'])->name('logbooks.notes.destroy');

    Route::post('/logbooks/{logbook}/powers', [LogbookPowerController::class, 'store'])->name('logbooks.powers.store');
    Route::delete('/logbooks/{logbook}/powers/{power}/delete', [LogbookPowerController::class, 'destroy'])->name('logbooks.powers.destroy');

    Route::post('/logbooks/{logbook}/guest-books', [GuestBookController::class, 'store'])->name('logbooks.guestbooks.store');
    Route::post('/logbooks/{logbook}/guest-books/{guestBook}', [GuestBookController::class, 'update'])->name('logbooks.guestbooks.update');
    Route::delete('/logbooks/{logbook}/guest-books/{guestBook}/delete', [GuestBookController::class, 'destroy'])->name('logbooks.guestbooks.destroy');
});

Route::middleware(['auth', 'role:admin|sdm'])->group(function () {
    Route::get('/schedules/admin-transmisi/{transmission}/edit', [TransmissionAdminController::class, 'edit'])->name('schedules.admin-transmisi.edit');
    Route::put('/schedules/admin-transmisi/{transmission}', [TransmissionAdminController::class, 'update'])->name('schedules.admin-transmisi.update');
});

Route::middleware('auth')->group(function () {
    Route::get('/schedules', [DutyScheduleController::class, 'index'])->name('schedules.index');
    Route::get('/schedules/{transmission}', [DutyScheduleController::class, 'show'])->name('schedules.show');
    Route::post('/schedules/{transmission}', [DutyScheduleController::class, 'store'])->name('schedules.store');
    Route::get('/schedules/{transmission}/csv', [DutyScheduleController::class, 'csv'])->name('schedules.csv');
    Route::get('/schedules/{transmission}/pdf', [DutyScheduleController::class, 'pdf'])->name('schedules.pdf');
});

require __DIR__.'/auth.php';
