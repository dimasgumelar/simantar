<?php

namespace App\Services;

use App\Repositories\DutyScheduleRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DutyScheduleService
{
    const MAX_RANGE_MONTHS = 2;

    protected $dutyScheduleRepo;

    public function __construct(DutyScheduleRepository $dutyScheduleRepo)
    {
        $this->dutyScheduleRepo = $dutyScheduleRepo;
    }

    public function resolveDateRange($rawStartDate, $rawEndDate)
    {
        $startDate = $rawStartDate ? Carbon::parse($rawStartDate) : now()->startOfMonth();
        $endDate = $rawEndDate ? Carbon::parse($rawEndDate) : now()->endOfMonth();

        if ($endDate->lt($startDate)) {
            [$startDate, $endDate] = [$endDate, $startDate];
        }

        $maxEndDate = $startDate->copy()->addMonths(self::MAX_RANGE_MONTHS);
        if ($endDate->gt($maxEndDate)) {
            $endDate = $maxEndDate;
        }

        return [$startDate->startOfDay(), $endDate->startOfDay()];
    }

    public function getScheduleGrid($transmissionId, Carbon $startDate, Carbon $endDate)
    {
        $schedules = $this->dutyScheduleRepo->getByTransmissionAndDateRange($transmissionId, $startDate->toDateString(), $endDate->toDateString());

        $entries = [];
        foreach ($schedules as $schedule) {
            $entries[$schedule->user_id][$schedule->date->toDateString()] = $schedule->shift;
        }

        $dates = [];
        $cursor = $startDate->copy();
        while ($cursor->lte($endDate)) {
            $dates[] = $cursor->toDateString();
            $cursor->addDay();
        }

        return [
            'startDate' => $startDate->toDateString(),
            'endDate' => $endDate->toDateString(),
            'dates' => $dates,
            'entries' => $entries,
        ];
    }

    public function saveScheduleEntries($transmissionId, array $entries, $createdBy)
    {
        DB::transaction(function () use ($transmissionId, $entries, $createdBy) {
            foreach ($entries as $entry) {
                if (empty($entry['shift'])) {
                    $this->dutyScheduleRepo->deleteEntry($transmissionId, $entry['user_id'], $entry['date']);
                    continue;
                }

                $this->dutyScheduleRepo->upsert($transmissionId, $entry['user_id'], $entry['date'], $entry['shift'], $createdBy);
            }
        });

        return true;
    }
}
