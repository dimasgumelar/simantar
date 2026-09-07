<?php
namespace App\Services;

use App\Repositories\FileRepository;
use App\Repositories\TransmissionRepository;

class TransmissionService
{
    protected $transmissionRepo;
    protected $fileRepo;

    public function __construct(TransmissionRepository $transmissionRepo, FileRepository $fileRepo)
    {
        $this->transmissionRepo = $transmissionRepo;
        $this->fileRepo = $fileRepo;
    }

    public function getAll($search, $isActive, $isPowerOut, $perPage, $sortField, $sortDirection)
    {
        return $this->transmissionRepo->all($search, $isActive, $isPowerOut, $perPage, $sortField, $sortDirection);
    }

    public function getById($id)
    {
        return $this->transmissionRepo->find($id);
    }

    public function create($data, $photo = null)
    {
        if ($data['photo']) {
            $data['photo_path'] = $this->fileRepo->store($photo, "transmissions");
        }
        return $this->transmissionRepo->create($data);
    }

    public function update($transmission, $data, $photo = null)
    {
        if ($photo) {
            $this->fileRepo->delete($transmission->photo_path);
            $data['photo_path'] = $this->fileRepo->store($photo, "transmissions");
        } elseif ($data['photo'] === null && $data['photo_path'] === null) {
            $this->fileRepo->delete($transmission->photo_path);
            $data['photo_path'] = null;
        }

        return $this->transmissionRepo->update($transmission, $data);
    }

    public function delete($transmission)
    {
        return $this->transmissionRepo->delete($transmission);
    }

    public function updateScheduleSettings($transmission, $adminTransmisiId, ?array $shiftCodes)
    {
        return $this->transmissionRepo->update($transmission, [
            'admin_transmisi_id' => $adminTransmisiId,
            'shift_codes' => $shiftCodes,
        ]);
    }
}