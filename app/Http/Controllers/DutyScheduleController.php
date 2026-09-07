<?php

namespace App\Http\Controllers;

use App\Models\Transmission;
use App\Services\DutyScheduleService;
use App\Services\ExportService;
use App\Services\UserTransmissionService;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DutyScheduleController extends Controller
{
    protected $dutyScheduleService;
    protected $userTransmissionService;
    protected $exportService;

    public function __construct(DutyScheduleService $dutyScheduleService, UserTransmissionService $userTransmissionService, ExportService $exportService)
    {
        $this->dutyScheduleService = $dutyScheduleService;
        $this->userTransmissionService = $userTransmissionService;
        $this->exportService = $exportService;
    }

    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->hasAnyRole(Transmission::SCHEDULE_LIST_ALL_ROLES)) {
            $transmissions = Transmission::with('adminTransmisi')->orderBy('name')->get();
        } else {
            $transmissions = $user->transmissions()->with('adminTransmisi')->orderBy('name')->get();
        }

        $transmissions = $transmissions->map(function ($transmission) use ($user) {
            $transmission->is_admin_transmisi = $transmission->admin_transmisi_id === $user->id;
            $transmission->can_view_schedule = $transmission->scheduleCanBeViewedBy($user);
            return $transmission;
        });

        return Inertia::render('Schedules/Index', compact('transmissions'));
    }

    public function show(Transmission $transmission, Request $request)
    {
        $user = $request->user();

        if (!$transmission->scheduleCanBeViewedBy($user)) {
            abort(403);
        }

        [$linkedUsers, $grid] = $this->resolveGrid($transmission, $request);

        return Inertia::render('Schedules/Show', [
            'transmission' => $transmission->load('adminTransmisi'),
            'employees' => $linkedUsers,
            'startDate' => $grid['startDate'],
            'endDate' => $grid['endDate'],
            'dates' => $grid['dates'],
            'entries' => $grid['entries'],
            'shiftCodes' => $transmission->getShiftCodes(),
            'shiftLegend' => $transmission->getShiftLegend(),
            'canEdit' => $transmission->scheduleCanBeEditedBy($user),
            'maxRangeMonths' => DutyScheduleService::MAX_RANGE_MONTHS,
        ]);
    }

    public function store(Request $request, Transmission $transmission)
    {
        $user = $request->user();

        if (!$transmission->scheduleCanBeEditedBy($user)) {
            abort(403);
        }

        $data = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'entries' => 'array',
            'entries.*.user_id' => 'required|integer|exists:users,id',
            'entries.*.date' => 'required|date',
            'entries.*.shift' => ['nullable', Rule::in($transmission->getShiftCodes())],
        ]);

        [$startDate, $endDate] = $this->dutyScheduleService->resolveDateRange($data['start_date'], $data['end_date']);

        $linkedUserIds = $this->userTransmissionService->getAllByTransmissionId($transmission->id, 0, 'name', 'ASC')
            ->pluck('user_id')->all();

        foreach ($data['entries'] as $entry) {
            if (!in_array($entry['user_id'], $linkedUserIds)) {
                abort(422, 'Pegawai tidak terdaftar di transmisi ini.');
            }

            $date = Carbon::parse($entry['date']);
            if ($date->lt($startDate) || $date->gt($endDate)) {
                abort(422, 'Tanggal di luar rentang yang dipilih.');
            }
        }

        $this->dutyScheduleService->saveScheduleEntries($transmission->id, $data['entries'], $user->id);

        return redirect()->route('schedules.show', [
            'transmission' => $transmission->id,
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
        ])->with('success', 'Berhasil menyimpan jadwal dinas.');
    }

    public function csv(Transmission $transmission, Request $request)
    {
        $user = $request->user();

        if (!$transmission->scheduleCanBeViewedBy($user)) {
            abort(403);
        }

        [$linkedUsers, $grid] = $this->resolveGrid($transmission, $request);

        $fileName = 'jadwal-dinas-' . str($transmission->name)->slug() . '-' . $grid['startDate'] . '_' . $grid['endDate'] . '.csv';

        $callback = function () use ($linkedUsers, $grid) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, array_merge(['Pegawai'], $grid['dates']));

            foreach ($linkedUsers as $employee) {
                $row = [$employee->name];
                foreach ($grid['dates'] as $date) {
                    $row[] = $grid['entries'][$employee->user_id][$date] ?? '';
                }
                fputcsv($handle, $row);
            }

            fclose($handle);
        };

        return $this->exportService->export($fileName, $callback);
    }

    public function pdf(Transmission $transmission, Request $request)
    {
        $user = $request->user();

        if (!$transmission->scheduleCanBeViewedBy($user)) {
            abort(403);
        }

        [$linkedUsers, $grid] = $this->resolveGrid($transmission, $request);

        $monthGroups = collect($grid['dates'])
            ->groupBy(fn ($date) => Carbon::parse($date)->format('Y-m'))
            ->map(fn ($dates, $yearMonth) => [
                'label' => Carbon::parse($yearMonth . '-01')->locale('id')->translatedFormat('F Y'),
                'dates' => $dates->values()->all(),
            ])
            ->values();

        $pdf = Pdf::loadView('schedules.pdf', [
            'transmission' => $transmission,
            'employees' => $linkedUsers,
            'entries' => $grid['entries'],
            'startDate' => $grid['startDate'],
            'endDate' => $grid['endDate'],
            'monthGroups' => $monthGroups,
            'shiftLegend' => $transmission->getShiftLegend(),
        ])->setPaper('a4', 'landscape');

        $fileName = 'jadwal-dinas-' . str($transmission->name)->slug() . '-' . $grid['startDate'] . '_' . $grid['endDate'] . '.pdf';

        return $pdf->download($fileName);
    }

    protected function resolveGrid(Transmission $transmission, Request $request)
    {
        [$startDate, $endDate] = $this->dutyScheduleService->resolveDateRange(
            $request->input('start_date'),
            $request->input('end_date')
        );

        $linkedUsers = $this->userTransmissionService->getAllByTransmissionId($transmission->id, 0, 'name', 'ASC');
        $grid = $this->dutyScheduleService->getScheduleGrid($transmission->id, $startDate, $endDate);

        return [$linkedUsers, $grid];
    }
}
