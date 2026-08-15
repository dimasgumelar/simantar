<?php

namespace App\Http\Controllers;

use App\Models\Logbook;
use App\Services\ExportService;
use App\Services\LogbookService;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class LogbookController extends Controller
{
    protected $logbookService;
    protected $exportService;

    public function __construct(LogbookService $logbookService, ExportService $exportService)
    {
        $this->logbookService = $logbookService;
        $this->exportService = $exportService;
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

    public function pdf(Logbook $logbook)
    {
        $logbook = $this->logbookService->getById($logbook->id);

        $pdf = Pdf::loadView('logbooks.pdf', compact('logbook'))
            ->setPaper('a4', 'portrait');

        $filename = 'logbook-' . str($logbook->transmission->name)->slug() . '-' . $logbook->tanggal->format('Y-m-d') . '.pdf';

        return $pdf->download($filename);
    }

    public function csv(Logbook $logbook)
    {
        $logbook = $this->logbookService->getById($logbook->id);

        $fileName = 'logbook-' . str($logbook->transmission->name)->slug() . '-' . $logbook->tanggal->format('Y-m-d') . '.csv';

        $callback = function () use ($logbook) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, ['Logbook Siaran']);
            fputcsv($handle, ['Transmisi', $logbook->transmission->name]);
            fputcsv($handle, ['Tanggal', $logbook->tanggal->format('Y-m-d')]);
            fputcsv($handle, ['Petugas', $logbook->petugasList->map(
                fn ($petugas) => $petugas->name . ' (TTD ' . Carbon::parse($petugas->pivot->signed_at)->format('Y-m-d H:i') . ')'
            )->join('; ')]);
            fputcsv($handle, []);

            fputcsv($handle, ['Power Transmisi']);
            fputcsv($handle, ['Watt', 'Waktu']);
            foreach ($logbook->powers as $power) {
                fputcsv($handle, [$power->power, Carbon::parse($power->created_at)->format('Y-m-d H:i')]);
            }
            fputcsv($handle, []);

            fputcsv($handle, ['Acara']);
            fputcsv($handle, ['No', 'Jam Mulai', 'Jam Selesai', 'Acara']);
            foreach ($logbook->events as $index => $event) {
                fputcsv($handle, [$index + 1, substr($event->start_time, 0, 5), substr($event->end_time, 0, 5), $event->name]);
            }
            fputcsv($handle, []);

            fputcsv($handle, ['Keterangan']);
            fputcsv($handle, ['No', 'Kategori', 'Jam Mulai', 'Jam Akhir', 'Catatan']);
            foreach ($logbook->notes as $index => $note) {
                fputcsv($handle, [$index + 1, ucfirst($note->category), substr($note->start_time, 0, 5), substr($note->end_time, 0, 5), $note->notes]);
            }

            fclose($handle);
        };

        return $this->exportService->export($fileName, $callback);
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
