<?php
namespace App\Services;

use App\Repositories\FonnteRepository;
use App\Repositories\InventoryRepository;
use App\Repositories\MaintenanceRepository;
use App\Repositories\MaintenanceStatusHistoryRepository;
use App\Repositories\TransmissionRepository;
use App\Repositories\UserRepository;
use Carbon\Carbon;

class MaintenanceService
{
    protected $maintenanceRepo;
    protected $maintenanceStatusHistoryRepo;
    protected $userRepo;
    protected $fonnteRepo;
    protected $inventoryRepo;
    protected $transmissionRepo;

    public function __construct(MaintenanceRepository $maintenanceRepo, MaintenanceStatusHistoryRepository $maintenanceStatusHistoryRepo, FonnteRepository $fonnteRepo, UserRepository $userRepo, InventoryRepository $inventoryRepo, TransmissionRepository $transmissionRepo)
    {
        $this->maintenanceRepo = $maintenanceRepo;
        $this->maintenanceStatusHistoryRepo = $maintenanceStatusHistoryRepo;
        $this->fonnteRepo = $fonnteRepo;
        $this->userRepo = $userRepo;
        $this->inventoryRepo = $inventoryRepo;
        $this->transmissionRepo = $transmissionRepo;
    }

    public function getAll($search, $perPage, $sortField, $sortDirection, $userId = null, $createdBy = null, $status = null)
    {
        return $this->maintenanceRepo->all($search, $perPage, $sortField, $sortDirection, $userId, $createdBy, $status);
    }

    public function info($userId = null, $createdBy = null, $status = null)
    {
        $maintenanceInfo = $this->maintenanceRepo->info($userId, $createdBy);
        $maintenanceInfoObject = [
            "pending" => 0,
            "inprogress" => 0,
            "completed" => 0,
            "approved" => 0,
            "rejected" => 0,
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
                case 3:
                    $maintenanceInfoObject['rejected'] = $m->status_count;
                    break;
                case 4:
                    $maintenanceInfoObject['approved'] = $m->status_count;
                    break;
                default:
                    break;
            }
        }

        return $maintenanceInfoObject;
    }

    public function getById($id)
    {
        return $this->maintenanceRepo->find($id);
    }

    public function create($data)
    {
        $user = $this->userRepo->find($data['user_id']);
        $inventory = $this->inventoryRepo->find($data['inventory_id']);
        $transmission = $this->transmissionRepo->find($data['transmission_id']);
        $timestamp = Carbon::parse($data['scheduled_at'], 'Asia/Jakarta')
            ->subDay()
            ->setTimezone('UTC') // konversi ke GMT 0
            ->timestamp;
        $scheduledAt = Carbon::parse($data['scheduled_at'], 'Asia/Jakarta')->locale('id');
        $formatted = $scheduledAt->translatedFormat('l, d F Y \p\u\k\u\l H:i');

        $data['schedule_response'] = "{}";        
        $maintenance = $this->maintenanceRepo->create($data);
        if (!$maintenance) {
            return $maintenance;
        }
        
        $maintenanceStatusHistoryData["maintenance_id"] = $maintenance->id;
        $maintenanceStatusHistoryData["status"] = 0;
        $maintenanceStatusHistoryData["note"] = "Pembuatan tugas";
        $maintenanceStatusHistoryData["created_by"] = $data["created_by"];
        $maintenanceStatusHistory = $this->maintenanceStatusHistoryRepo->create($maintenanceStatusHistoryData);
        if (!$maintenanceStatusHistory) {
            return $maintenanceStatusHistory;
        }

        $message = "Pemberitahuan kepada *".$user->name." untuk melakukan maintenance alat : *".$inventory->name."* di Transmisi ".$transmission->name." pada Hari ".$formatted."\n\nLink: ".config("app.url")."/tasks/".$maintenance->id."/view";
        $fonnteResponse = $this->fonnteRepo->send($user->phone, $message, $timestamp);
        $data['schedule_response'] = $fonnteResponse->body();        
        $this->maintenanceRepo->update($maintenance, $data);
        
        return $maintenance;
    }

    public function update($maintenance, $data)
    {
        return $this->maintenanceRepo->update($maintenance, $data);
    }

    public function complete($maintenance, $data, $userId)
    {
        $maintenanceStatusHistoryData["maintenance_id"] = $maintenance->id;
        $maintenanceStatusHistoryData["status"] = 2;
        $maintenanceStatusHistoryData["note"] = $data["feedback"];
        $maintenanceStatusHistoryData["created_by"] = $userId;
        $maintenanceStatusHistory = $this->maintenanceStatusHistoryRepo->create($maintenanceStatusHistoryData);
        if (!$maintenanceStatusHistory) {
            return $maintenanceStatusHistory;
        }

        $now = now('Asia/Jakarta');
        $formatted = $now->locale('id')->translatedFormat('l, d F Y \p\u\k\u\l H:i');
        
        $message = "Pemberitahuan bahwa *".$maintenance->user->name." telah melakukan maintenance alat : *".$maintenance->inventory->name."* di Transmisi ".$maintenance->transmission->name." pada Hari ".$formatted."\n\nLink: ".config("app.url")."/maintenances/".$maintenance->id."/view";
        $this->fonnteRepo->send($maintenance->created_by_user->phone, $message);
        return $maintenanceStatusHistory;
    }

    public function delete($maintenance)
    {
        return $this->maintenanceRepo->delete($maintenance);
    }

    public function start($maintenance, $userId)
    {
        $maintenanceStatusHistoryData["maintenance_id"] = $maintenance->id;
        $maintenanceStatusHistoryData["status"] = 1;
        $maintenanceStatusHistoryData["note"] = "Memulai tugas";
        $maintenanceStatusHistoryData["created_by"] = $userId;
        $maintenanceStatusHistory = $this->maintenanceStatusHistoryRepo->create($maintenanceStatusHistoryData);
        if (!$maintenanceStatusHistory) {
            return $maintenanceStatusHistory;
        }
        
        $now = now('Asia/Jakarta');
        $formatted = $now->locale('id')->translatedFormat('l, d F Y \p\u\k\u\l H:i');
        
        $message = "Pemberitahuan bahwa ".$maintenance->user->name." sedang melakukan maintenance alat : *".$maintenance->inventory->name."* di Transmisi ".$maintenance->transmission->name." pada Hari ".$formatted."\n\nLink: ".config("app.url")."/maintenances/".$maintenance->id."/view";
        $this->fonnteRepo->send($maintenance->created_by_user->phone, $message);
        
        return $maintenanceStatusHistory;
    }

    public function approve($maintenance, $data, $userId)
    {
        $maintenanceStatusHistoryData["maintenance_id"] = $maintenance->id;
        $maintenanceStatusHistoryData["status"] = 4;
        $maintenanceStatusHistoryData["note"] = $data["note"];
        $maintenanceStatusHistoryData["created_by"] = $userId;
        $maintenanceStatusHistory = $this->maintenanceStatusHistoryRepo->create($maintenanceStatusHistoryData);
        if (!$maintenanceStatusHistory) {
            return $maintenanceStatusHistory;
        }

        $now = now('Asia/Jakarta');
        $formatted = $now->locale('id')->translatedFormat('l, d F Y \p\u\k\u\l H:i');
        
        $message = "Pemberitahuan bahwa maintenance *".$maintenance->inventory->name."* di Transmisi ".$maintenance->transmission->name." pada Hari ".$formatted." telah disetujui \n\nLink: ".config("app.url")."/tasks/".$maintenance->id."/view";
        $this->fonnteRepo->send($maintenance->user->phone, $message);
        
        return $maintenanceStatusHistory;
    }
    
    public function reject($maintenance, $data, $userId)
    {
        $maintenanceStatusHistoryData["maintenance_id"] = $maintenance->id;
        $maintenanceStatusHistoryData["status"] = 3;
        $maintenanceStatusHistoryData["note"] = $data["note"];
        $maintenanceStatusHistoryData["created_by"] = $userId;
        $maintenanceStatusHistory = $this->maintenanceStatusHistoryRepo->create($maintenanceStatusHistoryData);
        if (!$maintenanceStatusHistory) {
            return $maintenanceStatusHistory;
        }
    
        $now = now('Asia/Jakarta');
        $formatted = $now->locale('id')->translatedFormat('l, d F Y \p\u\k\u\l H:i');
        
        $message = "Pemberitahuan bahwa maintenance *".$maintenance->inventory->name."* di Transmisi ".$maintenance->transmission->name." pada Hari ".$formatted." telah ditolak \n\nLink: ".config("app.url")."/tasks/".$maintenance->id."/view";
        $this->fonnteRepo->send($maintenance->user->phone, $message);
        
        return $maintenanceStatusHistory;
    }
}