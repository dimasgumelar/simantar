<?php

namespace App\Services;

use App\Models\Logbook;
use App\Models\LogbookEvent;
use App\Models\LogbookNote;
use App\Models\LogbookPower;
use App\Models\Transmission;
use Carbon\CarbonPeriod;

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
