<?php

namespace App\Http\Controllers;

use App\Models\Logbook;
use App\Services\LogbookService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class LogbookController extends Controller
{
    protected $logbookService;

    public function __construct(LogbookService $logbookService)
    {
        $this->logbookService = $logbookService;
    }

    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->hasAnyRole(['operator', 'koordinator']) && !$user->hasAnyRole(['admin', 'ketua tim', 'teknisi'])) {
            return $this->dayView($request);
        }

        $transmissionIds = $request->input('transmissions', []);
        $perPage = $request->input('per_page', 10);
        $sortField = $request->sort;
        $sortDirection = $request->direction;

        $logbooks = $this->logbookService->getAll($user, $transmissionIds, $perPage, $sortField, $sortDirection);
        $transmissions = $this->logbookService->getAccessibleTransmissions($user);

        return Inertia::render('Logbooks/Index', compact('logbooks', 'transmissions'));
    }

    protected function dayView(Request $request)
    {
        $user = $request->user();
        $transmissions = $this->logbookService->getAccessibleTransmissions($user);
        $accessibleIds = $transmissions->pluck('id')->all();

        $transmissionId = (int) $request->input('transmission_id');
        if (!in_array($transmissionId, $accessibleIds)) {
            $transmissionId = optional($transmissions->first())->id;
        }

        $tanggal = $request->input('tanggal') ?: now()->format('Y-m-d');

        $logbook = $transmissionId
            ? $this->logbookService->getByTransmissionAndDate($transmissionId, $tanggal)
            : null;

        return Inertia::render('Logbooks/DayView', [
            'transmissions' => $transmissions,
            'transmissionId' => $transmissionId,
            'tanggal' => $tanggal,
            'logbook' => $logbook,
            'copyableLogbooks' => $logbook ? $this->logbookService->getCopyableLogbooks($logbook) : [],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'transmission_id' => 'required|exists:transmissions,id',
            'tanggal' => 'required|date',
        ]);

        $accessibleIds = $this->logbookService->getAccessibleTransmissions($request->user())->pluck('id')->all();
        if (!in_array((int) $request->transmission_id, $accessibleIds)) {
            return Redirect::back()->with('error', 'Anda tidak memiliki akses ke transmisi ini.');
        }

        $logbook = $this->logbookService->create($request->transmission_id, $request->tanggal);
        if (!$logbook) {
            return Redirect::back()->with('error', 'Logbook untuk transmisi dan tanggal ini sudah ada.');
        }

        return Redirect::route('logbooks.index', [
            'transmission_id' => $logbook->transmission_id,
            'tanggal' => $logbook->tanggal->format('Y-m-d'),
        ])->with('success', 'Berhasil membuat logbook.');
    }

    public function show(Logbook $logbook)
    {
        $logbook = $this->logbookService->getById($logbook->id);

        return Inertia::render('Logbooks/Show', [
            'logbook' => $logbook,
            'copyableLogbooks' => $this->logbookService->getCopyableLogbooks($logbook),
        ]);
    }

    public function sign(Logbook $logbook, Request $request)
    {
        $signed = $this->logbookService->sign($logbook, $request->user());
        if (!$signed) {
            return Redirect::back()->with('error', 'Anda tidak berwenang menandatangani logbook ini.');
        }

        return Redirect::back()->with('success', 'Berhasil menandatangani logbook.');
    }

    public function copyEvents(Logbook $logbook, Request $request)
    {
        $request->validate([
            'source_logbook_id' => 'required|exists:logbooks,id',
        ]);

        $result = $this->logbookService->copyEvents($logbook, $request->source_logbook_id);
        if (!$result) {
            return Redirect::back()->with('error', 'Logbook sumber tidak valid.');
        }

        $message = "Berhasil menyalin {$result['copied']} acara.";
        if ($result['skipped'] > 0) {
            $message .= " {$result['skipped']} acara dilewati karena bentrok jam.";
        }

        return Redirect::back()->with($result['copied'] > 0 ? 'success' : 'error', $message);
    }
}
