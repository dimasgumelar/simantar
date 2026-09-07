<?php
namespace App\Repositories;

use App\Models\Logbook;

class LogbookRepository
{
    public function all($transmissionIds, $perPage, $sortField, $sortDirection)
    {
        $query = Logbook::with(['transmission', 'petugasList']);

        if (!empty($transmissionIds)) {
            $query->whereIn('transmission_id', $transmissionIds);
        }

        if ($sortField && in_array($sortField, ['tanggal', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderByDesc('tanggal');
        }

        if ($perPage > 0) {
            $logbooks = $query->paginate($perPage)->withQueryString()->onEachSide(0);
        } else {
            $logbooks = $query->get();
        }

        return $logbooks;
    }

    public function find($id)
    {
        return Logbook::with([
            'transmission',
            'petugasList',
            'events' => fn ($query) => $query->orderBy('start_time'),
            'notes' => fn ($query) => $query->orderBy('start_time'),
            'powers' => fn ($query) => $query->orderBy('created_at'),
            'guestBooks' => fn ($query) => $query->orderBy('created_at'),
        ])->find($id);
    }

    public function findByTransmissionAndDate($transmissionId, $tanggal)
    {
        return Logbook::with([
            'transmission',
            'petugasList',
            'events' => fn ($query) => $query->orderBy('start_time'),
            'notes' => fn ($query) => $query->orderBy('start_time'),
            'powers' => fn ($query) => $query->orderBy('created_at'),
            'guestBooks' => fn ($query) => $query->orderBy('created_at'),
        ])
            ->where('transmission_id', $transmissionId)
            ->where('tanggal', $tanggal)
            ->first();
    }

    public function existsForDate($transmissionId, $tanggal)
    {
        return Logbook::where('transmission_id', $transmissionId)
            ->where('tanggal', $tanggal)
            ->exists();
    }

    public function create(array $data): Logbook
    {
        return Logbook::create($data);
    }

    public function listOtherForTransmission($transmissionId, $excludeLogbookId)
    {
        return Logbook::where('transmission_id', $transmissionId)
            ->where('id', '!=', $excludeLogbookId)
            ->whereHas('events')
            ->orderByDesc('tanggal')
            ->get(['id', 'tanggal']);
    }

    public function addSigner($logbook, $userId)
    {
        $logbook->petugasList()->attach($userId, ['signed_at' => now()]);

        return $logbook;
    }

    public function delete($logbook)
    {
        return $logbook->delete();
    }
}
