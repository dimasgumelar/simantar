<?php

namespace App\Http\Controllers;

use App\Models\Logbook;
use App\Models\LogbookEvent;
use App\Services\LogbookService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class LogbookEventController extends Controller
{
    protected $logbookService;

    public function __construct(LogbookService $logbookService)
    {
        $this->logbookService = $logbookService;
    }

    public function store(Logbook $logbook, Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $event = $this->logbookService->addEvent($logbook->id, $request->name, $request->start_time, $request->end_time);
        if (!$event) {
            return Redirect::back()->with('error', 'Jam acara bersinggungan dengan acara lain pada logbook ini.');
        }

        return Redirect::back()->with('success', 'Berhasil menambah acara.');
    }

    public function update(Logbook $logbook, LogbookEvent $event, Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $updated = $this->logbookService->updateEvent($event, $request->name, $request->start_time, $request->end_time);
        if (!$updated) {
            return Redirect::back()->with('error', 'Jam acara bersinggungan dengan acara lain pada logbook ini.');
        }

        return Redirect::back()->with('success', 'Berhasil mengubah acara.');
    }

    public function destroy(Logbook $logbook, LogbookEvent $event)
    {
        $this->logbookService->deleteEvent($event);

        return Redirect::back()->with('success', 'Berhasil menghapus acara.');
    }
}
