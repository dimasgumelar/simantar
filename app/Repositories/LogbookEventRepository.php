<?php
namespace App\Repositories;

use App\Models\LogbookEvent;

class LogbookEventRepository
{
    public function create(array $data): LogbookEvent
    {
        return LogbookEvent::create($data);
    }

    public function update($event, array $data)
    {
        $event->update($data);
        return $event;
    }

    public function delete($event)
    {
        return $event->delete();
    }

    public function allByLogbookId($logbookId)
    {
        return LogbookEvent::where('logbook_id', $logbookId)
            ->orderBy('start_time')
            ->get();
    }

    public function overlaps($logbookId, $startTime, $endTime, $excludeEventId = null)
    {
        return LogbookEvent::where('logbook_id', $logbookId)
            ->when($excludeEventId, fn ($query) => $query->where('id', '!=', $excludeEventId))
            ->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime)
            ->exists();
    }

    public function distinctNamesByTransmissionId($transmissionId)
    {
        return LogbookEvent::whereHas('logbook', fn ($query) => $query->where('transmission_id', $transmissionId))
            ->select('name')
            ->distinct()
            ->orderBy('name')
            ->pluck('name');
    }
}
