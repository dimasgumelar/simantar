<?php

namespace App\Repositories;

use App\Models\DutySchedule;

class DutyScheduleRepository
{
    public function getByTransmissionAndDateRange($transmissionId, $startDate, $endDate)
    {
        return DutySchedule::where('transmission_id', $transmissionId)
            ->whereBetween('date', [$startDate, $endDate])
            ->get();
    }

    public function upsert($transmissionId, $userId, $date, $shift, $createdBy)
    {
        return DutySchedule::updateOrCreate(
            [
                'transmission_id' => $transmissionId,
                'user_id' => $userId,
                'date' => $date,
            ],
            [
                'shift' => $shift,
                'created_by' => $createdBy,
            ]
        );
    }

    public function deleteEntry($transmissionId, $userId, $date)
    {
        return DutySchedule::where('transmission_id', $transmissionId)
            ->where('user_id', $userId)
            ->where('date', $date)
            ->delete();
    }
}
