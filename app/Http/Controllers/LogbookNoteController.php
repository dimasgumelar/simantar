<?php

namespace App\Http\Controllers;

use App\Models\Logbook;
use App\Models\LogbookNote;
use App\Services\LogbookService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class LogbookNoteController extends Controller
{
    protected $logbookService;

    public function __construct(LogbookService $logbookService)
    {
        $this->logbookService = $logbookService;
    }

    public function store(Logbook $logbook, Request $request)
    {
        $request->validate([
            'category' => 'required|in:' . implode(',', LogbookNote::CATEGORIES),
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'notes' => 'required|string',
        ]);

        $this->logbookService->addNote($logbook->id, $request->category, $request->start_time, $request->end_time, $request->notes);

        return Redirect::back()->with('success', 'Berhasil menambah keterangan.');
    }

    public function update(Logbook $logbook, LogbookNote $note, Request $request)
    {
        $request->validate([
            'category' => 'required|in:' . implode(',', LogbookNote::CATEGORIES),
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'notes' => 'required|string',
        ]);

        $this->logbookService->updateNote($note, $request->category, $request->start_time, $request->end_time, $request->notes);

        return Redirect::back()->with('success', 'Berhasil mengubah keterangan.');
    }

    public function destroy(Logbook $logbook, LogbookNote $note)
    {
        $this->logbookService->deleteNote($note);

        return Redirect::back()->with('success', 'Berhasil menghapus keterangan.');
    }
}
