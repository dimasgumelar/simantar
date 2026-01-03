<?php
namespace App\Services;

use App\Repositories\FonnteRepository;
use App\Repositories\InventoryRepository;
use App\Repositories\MaintenanceStatusHistoryRepository;
use App\Repositories\TransmissionRepository;
use App\Repositories\UserRepository;
use Carbon\Carbon;

class MaintenanceStatusHistoryService
{
    protected $maintenanceStatusHistoryRepo;
    protected $userRepo;
    protected $fonnteRepo;
    protected $inventoryRepo;
    protected $transmissionRepo;

    public function __construct(MaintenanceStatusHistoryRepository $maintenanceStatusHistoryRepo, FonnteRepository $fonnteRepo, UserRepository $userRepo, InventoryRepository $inventoryRepo, TransmissionRepository $transmissionRepo)
    {
        $this->maintenanceStatusHistoryRepo = $maintenanceStatusHistoryRepo;
        $this->fonnteRepo = $fonnteRepo;
        $this->userRepo = $userRepo;
        $this->inventoryRepo = $inventoryRepo;
        $this->transmissionRepo = $transmissionRepo;
    }

    public function getAll($search, $perPage, $sortField, $sortDirection, $userId = null, $createdBy = null, $status = null)
    {
        return $this->maintenanceStatusHistoryRepo->all($search, $perPage, $sortField, $sortDirection, $userId, $createdBy, $status);
    }

    public function info($userId = null, $createdBy = null, $status = null)
    {
        $maintenanceInfo = $this->maintenanceStatusHistoryRepo->info($userId, $createdBy);
        $maintenanceInfoObject = [
            "pending" => 0,
            "inprogress" => 0,
            "completed" => 0,
        ];

        foreach ($maintenanceInfo as $m) {
            switch ($m->status) {
                case 0:
                    $maintenanceInfoObject['pending'] = $m->status_count;
                    break;
                case 1:
                    $maintenanceInfoObject['inprogress'] = $m->status_count;
                    break;
                case 2:
                    $maintenanceInfoObject['completed'] = $m->status_count;
                    break;
                default:
                    break;
            }
        }

        return $maintenanceInfoObject;
    }

    public function getById($id)
    {
        return $this->maintenanceStatusHistoryRepo->find($id);
    }

    public function create($data)
    {
        $maintenanceStatusHistory = $this->maintenanceStatusHistoryRepo->create($data);
        if (!$maintenanceStatusHistory) {
            return $maintenanceStatusHistory;
        }

        return $maintenanceStatusHistory;
    }

    public function update($maintenance, $data)
    {
        return $this->maintenanceStatusHistoryRepo->update($maintenance, $data);
    }

    public function delete($maintenance)
    {
        return $this->maintenanceStatusHistoryRepo->delete($maintenance);
    }
}