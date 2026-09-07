<?php

namespace App\Http\Controllers;

use App\Models\GuestBook;
use App\Models\Logbook;
use App\Services\LogbookService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class GuestBookController extends Controller
{
    protected $logbookService;

    public function __construct(LogbookService $logbookService)
    {
        $this->logbookService = $logbookService;
    }

    public function store(Logbook $logbook, Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'institution' => 'nullable|string|max:255',
            'purpose' => 'required|string|max:255',
            'phone' => 'nullable|string|max:30',
            'time_in' => 'nullable|date_format:H:i',
            'time_out' => 'nullable|date_format:H:i|after_or_equal:time_in',
            'notes' => 'nullable|string',
        ]);

        $this->logbookService->addGuestBook(
            $logbook->id,
            $data['name'],
            $data['institution'] ?? null,
            $data['purpose'],
            $data['phone'] ?? null,
            $data['time_in'] ?? null,
            $data['time_out'] ?? null,
            $data['notes'] ?? null
        );

        return Redirect::back()->with('success', 'Berhasil menambah data buku tamu.');
    }

    public function update(Logbook $logbook, GuestBook $guestBook, Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'institution' => 'nullable|string|max:255',
            'purpose' => 'required|string|max:255',
            'phone' => 'nullable|string|max:30',
            'time_in' => 'nullable|date_format:H:i',
            'time_out' => 'nullable|date_format:H:i|after_or_equal:time_in',
            'notes' => 'nullable|string',
        ]);

        $this->logbookService->updateGuestBook(
            $guestBook,
            $data['name'],
            $data['institution'] ?? null,
            $data['purpose'],
            $data['phone'] ?? null,
            $data['time_in'] ?? null,
            $data['time_out'] ?? null,
            $data['notes'] ?? null
        );

        return Redirect::back()->with('success', 'Berhasil mengubah data buku tamu.');
    }

    public function destroy(Logbook $logbook, GuestBook $guestBook)
    {
        $this->logbookService->deleteGuestBook($guestBook);

        return Redirect::back()->with('success', 'Berhasil menghapus data buku tamu.');
    }
}
