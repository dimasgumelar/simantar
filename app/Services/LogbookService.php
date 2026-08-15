<?php
namespace App\Services;

use App\Models\Transmission;
use App\Repositories\LogbookEventRepository;
use App\Repositories\LogbookNoteRepository;
use App\Repositories\LogbookPowerRepository;
use App\Repositories\LogbookRepository;
use Illuminate\Support\Facades\DB;

class LogbookService
{
    protected $logbookRepo;
    protected $logbookEventRepo;
    protected $logbookNoteRepo;
    protected $logbookPowerRepo;

    public function __construct(
        LogbookRepository $logbookRepo,
        LogbookEventRepository $logbookEventRepo,
        LogbookNoteRepository $logbookNoteRepo,
        LogbookPowerRepository $logbookPowerRepo
    ) {
        $this->logbookRepo = $logbookRepo;
        $this->logbookEventRepo = $logbookEventRepo;
        $this->logbookNoteRepo = $logbookNoteRepo;
        $this->logbookPowerRepo = $logbookPowerRepo;
    }

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

    public function getAll($user, $transmissionIds, $perPage, $sortField, $sortDirection)
    {
        if ($user->hasAnyRole(['operator', 'koordinator']) && !$user->hasAnyRole(['admin', 'ketua tim', 'teknisi'])) {
            $accessibleIds = $this->getAccessibleTransmissions($user)->pluck('id')->all();
            $transmissionIds = empty($transmissionIds)
                ? $accessibleIds
                : array_values(array_intersect($transmissionIds, $accessibleIds));
        }

        return $this->logbookRepo->all($transmissionIds, $perPage, $sortField, $sortDirection);
    }

    public function getById($id)
    {
        return $this->logbookRepo->find($id);
    }

    public function getByTransmissionAndDate($transmissionId, $tanggal)
    {
        return $this->logbookRepo->findByTransmissionAndDate($transmissionId, $tanggal);
    }

    public function create($transmissionId, $tanggal)
    {
        if ($this->logbookRepo->existsForDate($transmissionId, $tanggal)) {
            return null;
        }

        return $this->logbookRepo->create([
            'transmission_id' => $transmissionId,
            'tanggal' => $tanggal,
        ]);
    }

    public function addEvent($logbookId, $name, $startTime, $endTime)
    {
        if ($this->logbookEventRepo->overlaps($logbookId, $startTime, $endTime)) {
            return null;
        }

        return $this->logbookEventRepo->create([
            'logbook_id' => $logbookId,
            'name' => $name,
            'start_time' => $startTime,
            'end_time' => $endTime,
        ]);
    }

    public function updateEvent($event, $name, $startTime, $endTime)
    {
        if ($this->logbookEventRepo->overlaps($event->logbook_id, $startTime, $endTime, $event->id)) {
            return null;
        }

        return $this->logbookEventRepo->update($event, [
            'name' => $name,
            'start_time' => $startTime,
            'end_time' => $endTime,
        ]);
    }

    public function deleteEvent($event)
    {
        return $this->logbookEventRepo->delete($event);
    }

    public function addNote($logbookId, $category, $startTime, $endTime, $notes)
    {
        return $this->logbookNoteRepo->create([
            'logbook_id' => $logbookId,
            'category' => $category,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'notes' => $notes,
        ]);
    }

    public function updateNote($note, $category, $startTime, $endTime, $notes)
    {
        return $this->logbookNoteRepo->update($note, [
            'category' => $category,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'notes' => $notes,
        ]);
    }

    public function deleteNote($note)
    {
        return $this->logbookNoteRepo->delete($note);
    }

    public function addPower($logbookId, $power)
    {
        return $this->logbookPowerRepo->create([
            'logbook_id' => $logbookId,
            'power' => $power,
        ]);
    }

    public function deletePower($power)
    {
        return $this->logbookPowerRepo->delete($power);
    }

    public function getCopyableLogbooks($logbook)
    {
        return $this->logbookRepo->listOtherForTransmission($logbook->transmission_id, $logbook->id);
    }

    public function copyEvents($logbook, $sourceLogbookId)
    {
        $source = $this->logbookRepo->find($sourceLogbookId);
        if (!$source || $source->id === $logbook->id || $source->transmission_id !== $logbook->transmission_id) {
            return null;
        }

        $copied = 0;
        $skipped = 0;

        foreach ($source->events as $event) {
            if ($this->logbookEventRepo->overlaps($logbook->id, $event->start_time, $event->end_time)) {
                $skipped++;
                continue;
            }

            $this->logbookEventRepo->create([
                'logbook_id' => $logbook->id,
                'name' => $event->name,
                'start_time' => $event->start_time,
                'end_time' => $event->end_time,
            ]);
            $copied++;
        }

        return ['copied' => $copied, 'skipped' => $skipped];
    }

    public function canSign($logbook, $user)
    {
        if ($logbook->petugasList->contains('id', $user->id)) {
            return false;
        }

        if ($user->id === $logbook->transmission->koordinator_id) {
            return true;
        }

        return DB::table('user_transmissions')
            ->where('transmission_id', $logbook->transmission_id)
            ->where('user_id', $user->id)
            ->exists();
    }

    public function sign($logbook, $user)
    {
        if (!$this->canSign($logbook, $user)) {
            return null;
        }

        return $this->logbookRepo->addSigner($logbook, $user->id);
    }
}
