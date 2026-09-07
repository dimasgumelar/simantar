<?php

namespace App\Services;

use App\Models\DutySchedule;
use App\Models\GuestBook;
use App\Models\Logbook;
use App\Models\LogbookEvent;
use App\Models\LogbookNote;
use App\Models\LogbookPower;
use App\Models\Transmission;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getAccessibleTransmissions($user)
    {
        if ($user->hasRole('koordinator')) {
            return Transmission::where('koordinator_id', $user->id)->orderBy('name')->get();
        }

        if ($user->hasRole('operator')) {
            return $user->transmissions()->orderBy('name')->get();
        }

        return Transmission::orderBy('name')->get();
    }

    public function getStats($user, array $transmissionIds, string $from, string $to)
    {
        $accessibleIds = $this->getAccessibleTransmissions($user)->pluck('id')->all();

        $ids = empty($transmissionIds)
            ? $accessibleIds
            : array_values(array_intersect($transmissionIds, $accessibleIds));

        $dates = collect(CarbonPeriod::create($from, $to))
            ->map(fn ($date) => $date->format('Y-m-d'))
            ->all();

        return [
            'dailyCounts' => $this->dailyCounts($ids, $from, $to, $dates),
            'noteCategories' => $this->noteCategories($ids, $from, $to),
            'powerTrend' => $this->powerTrend($ids, $from, $to, $dates),
            'signatureStatus' => $this->signatureStatus($ids, $from, $to),
            'guestBookByTransmission' => $this->guestBookByTransmission($ids, $from, $to),
            'guestBookTrend' => $this->guestBookTrend($ids, $from, $to, $dates),
        ];
    }

    protected function dailyCounts(array $ids, string $from, string $to, array $dates)
    {
        if (empty($ids)) {
            return collect($dates)
                ->map(fn ($date) => ['date' => $date, 'acara' => 0, 'keterangan' => 0])
                ->all();
        }

        $eventCounts = LogbookEvent::join('logbooks', 'logbook_events.logbook_id', '=', 'logbooks.id')
            ->whereIn('logbooks.transmission_id', $ids)
            ->whereBetween('logbooks.tanggal', [$from, $to])
            ->selectRaw('logbooks.tanggal as date, count(*) as total')
            ->groupBy('logbooks.tanggal')
            ->pluck('total', 'date');

        $noteCounts = LogbookNote::join('logbooks', 'logbook_notes.logbook_id', '=', 'logbooks.id')
            ->whereIn('logbooks.transmission_id', $ids)
            ->whereBetween('logbooks.tanggal', [$from, $to])
            ->selectRaw('logbooks.tanggal as date, count(*) as total')
            ->groupBy('logbooks.tanggal')
            ->pluck('total', 'date');

        return collect($dates)->map(fn ($date) => [
            'date' => $date,
            'acara' => (int) ($eventCounts[$date] ?? 0),
            'keterangan' => (int) ($noteCounts[$date] ?? 0),
        ])->all();
    }

    protected function noteCategories(array $ids, string $from, string $to)
    {
        if (empty($ids)) {
            return collect(LogbookNote::CATEGORIES)
                ->map(fn ($category) => ['category' => $category, 'count' => 0, 'duration_minutes' => 0])
                ->all();
        }

        $stats = LogbookNote::join('logbooks', 'logbook_notes.logbook_id', '=', 'logbooks.id')
            ->whereIn('logbooks.transmission_id', $ids)
            ->whereBetween('logbooks.tanggal', [$from, $to])
            ->selectRaw('
                logbook_notes.category as category,
                count(*) as total,
                sum(timestampdiff(minute, logbook_notes.start_time, logbook_notes.end_time)) as total_minutes
            ')
            ->groupBy('logbook_notes.category')
            ->get()
            ->keyBy('category');

        return collect(LogbookNote::CATEGORIES)
            ->map(function ($category) use ($stats) {
                $row = $stats->get($category);

                return [
                    'category' => $category,
                    'count' => $row ? (int) $row->total : 0,
                    'duration_minutes' => $row ? (int) $row->total_minutes : 0,
                ];
            })
            ->all();
    }

    protected function powerTrend(array $ids, string $from, string $to, array $dates)
    {
        if (empty($ids)) {
            return collect($dates)->map(fn ($date) => ['date' => $date, 'avg_power' => null])->all();
        }

        $averages = LogbookPower::join('logbooks', 'logbook_powers.logbook_id', '=', 'logbooks.id')
            ->whereIn('logbooks.transmission_id', $ids)
            ->whereBetween('logbooks.tanggal', [$from, $to])
            ->selectRaw('logbooks.tanggal as date, avg(logbook_powers.power) as avg_power')
            ->groupBy('logbooks.tanggal')
            ->pluck('avg_power', 'date');

        return collect($dates)->map(fn ($date) => [
            'date' => $date,
            'avg_power' => isset($averages[$date]) ? round((float) $averages[$date], 1) : null,
        ])->all();
    }

    public function getScheduleOverview($user, array $transmissionIds, string $from, string $to)
    {
        $accessibleIds = $this->getAccessibleTransmissions($user)->pluck('id')->all();

        $ids = empty($transmissionIds)
            ? $accessibleIds
            : array_values(array_intersect($transmissionIds, $accessibleIds));

        if (empty($ids)) {
            return [];
        }

        $days = Carbon::parse($from)->diffInDays(Carbon::parse($to)) + 1;

        $employeeCounts = DB::table('user_transmissions')
            ->whereIn('transmission_id', $ids)
            ->selectRaw('transmission_id, count(*) as total')
            ->groupBy('transmission_id')
            ->pluck('total', 'transmission_id');

        $filledSlots = DutySchedule::whereIn('transmission_id', $ids)
            ->whereBetween('date', [$from, $to])
            ->selectRaw('transmission_id, count(*) as total')
            ->groupBy('transmission_id')
            ->pluck('total', 'transmission_id');

        $filledDays = DutySchedule::whereIn('transmission_id', $ids)
            ->whereBetween('date', [$from, $to])
            ->selectRaw('transmission_id, count(distinct date) as total')
            ->groupBy('transmission_id')
            ->pluck('total', 'transmission_id');

        return Transmission::whereIn('id', $ids)
            ->with('adminTransmisi:id,name')
            ->orderBy('name')
            ->get()
            ->map(function ($transmission) use ($user, $employeeCounts, $filledSlots, $filledDays, $days) {
                $employeeCount = (int) ($employeeCounts[$transmission->id] ?? 0);
                $expectedSlots = $employeeCount * $days;
                $filled = (int) ($filledSlots[$transmission->id] ?? 0);
                $percent = $expectedSlots > 0 ? (int) round(($filled / $expectedSlots) * 100) : 0;

                $status = 'belum_terisi';
                if ($employeeCount === 0) {
                    $status = 'tanpa_pegawai';
                } elseif ($percent >= 100) {
                    $status = 'terisi';
                } elseif ($percent > 0) {
                    $status = 'sebagian';
                }

                return [
                    'id' => $transmission->id,
                    'name' => $transmission->name,
                    'admin_transmisi' => $transmission->adminTransmisi->name ?? null,
                    'employee_count' => $employeeCount,
                    'filled_days' => (int) ($filledDays[$transmission->id] ?? 0),
                    'total_days' => $days,
                    'percent' => $percent,
                    'status' => $status,
                    'can_view' => $transmission->scheduleCanBeViewedBy($user),
                ];
            })
            ->values()
            ->all();
    }

    protected function guestBookTrend(array $ids, string $from, string $to, array $dates)
    {
        if (empty($ids)) {
            return collect($dates)->map(fn ($date) => ['date' => $date, 'count' => 0])->all();
        }

        $counts = GuestBook::join('logbooks', 'guest_books.logbook_id', '=', 'logbooks.id')
            ->whereIn('logbooks.transmission_id', $ids)
            ->whereBetween('logbooks.tanggal', [$from, $to])
            ->selectRaw('logbooks.tanggal as date, count(*) as total')
            ->groupBy('logbooks.tanggal')
            ->pluck('total', 'date');

        return collect($dates)->map(fn ($date) => [
            'date' => $date,
            'count' => (int) ($counts[$date] ?? 0),
        ])->all();
    }

    protected function guestBookByTransmission(array $ids, string $from, string $to)
    {
        if (empty($ids)) {
            return [];
        }

        $counts = GuestBook::join('logbooks', 'guest_books.logbook_id', '=', 'logbooks.id')
            ->whereIn('logbooks.transmission_id', $ids)
            ->whereBetween('logbooks.tanggal', [$from, $to])
            ->selectRaw('logbooks.transmission_id, count(*) as total')
            ->groupBy('logbooks.transmission_id')
            ->pluck('total', 'transmission_id');

        return Transmission::whereIn('id', $ids)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn ($transmission) => [
                'transmission' => $transmission->name,
                'count' => (int) ($counts[$transmission->id] ?? 0),
            ])
            ->values()
            ->all();
    }

    protected function signatureStatus(array $ids, string $from, string $to)
    {
        if (empty($ids)) {
            return [];
        }

        $logbooks = Logbook::with('transmission:id,name')
            ->whereIn('transmission_id', $ids)
            ->whereBetween('tanggal', [$from, $to])
            ->withCount('petugasList')
            ->get(['id', 'transmission_id', 'tanggal']);

        return $logbooks
            ->groupBy(fn ($logbook) => $logbook->transmission->name)
            ->map(function ($group, $transmissionName) {
                $signed = $group->where('petugas_list_count', '>', 0)->count();

                return [
                    'transmission' => $transmissionName,
                    'signed' => $signed,
                    'unsigned' => $group->count() - $signed,
                ];
            })
            ->values()
            ->all();
    }
}
