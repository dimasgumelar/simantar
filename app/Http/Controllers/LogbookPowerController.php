<?php

namespace App\Http\Controllers;

use App\Models\Logbook;
use App\Models\LogbookPower;
use App\Services\LogbookService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class LogbookPowerController extends Controller
{
    protected $logbookService;

    public function __construct(LogbookService $logbookService)
    {
        $this->logbookService = $logbookService;
    }

    public function store(Logbook $logbook, Request $request)
    {
        $request->validate([
            'power' => 'required|integer|min:1',
        ]);

        $this->logbookService->addPower($logbook->id, $request->power);

        return Redirect::back()->with('success', 'Berhasil menambah catatan power.');
    }

    public function destroy(Logbook $logbook, LogbookPower $power)
    {
        $this->logbookService->deletePower($power);

        return Redirect::back()->with('success', 'Berhasil menghapus catatan power.');
    }
}
