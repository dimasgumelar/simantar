<?php
namespace App\Repositories;

use App\Models\MaintenanceStatusHistory;
use Illuminate\Support\Facades\DB;

class MaintenanceStatusHistoryRepository
{
    public function all($search, $perPage, $sortField, $sortDirection, $userId = null, $createdBy = null, $status = null)
    {
        $query = MaintenanceStatusHistory::query()->select('maintenances.*');
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('inventories.name', 'like', "%{$search}%")
                ->orWhere('transmissions.name', 'like', "%{$search}%")
                ->orWhere('maintenances.description', 'like', "%{$search}%")
                ->orWhere('users.name', 'like', "%{$search}%");
            });
        }
        $query->join('inventories', 'maintenances.inventory_id', '=', 'inventories.id');
        $query->join('transmissions', 'maintenances.transmission_id', '=', 'transmissions.id');
        $query->join('users', 'maintenances.user_id', '=', 'users.id');
        if ($sortField && in_array($sortField, ['id', 'status', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection);
        }

        if ($sortField == "inventory") {
            $query->orderBy("inventories.name", $sortDirection);
        }

        if ($sortField == "transmission") {
            $query->orderBy("transmissions.name", $sortDirection);
        }

        if ($sortField == "name") {
            $query->orderBy("users.name", $sortDirection);
        }

        if ($userId) {
            $query->where("user_id", $userId);
        }

        if ($createdBy) {
            $query->where("created_by", $createdBy);
        }

        if ($status) {
            $query->where("status", $status);
        }

        $maintenanceStatusHistories = $query->with(['inventory:id,name', 'transmission:id,name', 'user:id,name'])->paginate($perPage)->withQueryString()->onEachSide(0);

        return $maintenanceStatusHistories;
    }

    public function info($userId = null, $createdBy = null)
    {
        $query = MaintenanceStatusHistory::query()->select('maintenances.status', DB::raw('COUNT(maintenances.status) as status_count'));
        
        if ($userId) {
            $query->where("user_id", $userId);
        }

        if ($createdBy) {
            $query->where("created_by", $createdBy);
        }

        $query->groupBy("maintenances.status");

        $maintenanceStatusHistories = $query->get();

        return $maintenanceStatusHistories;
    }

    public function find($id)
    {
        return MaintenanceStatusHistory::find($id);
    }

    public function create($data): MaintenanceStatusHistory
    {
        return MaintenanceStatusHistory::create($data);
    }

    public function update($maintenanceStatusHistory, $data)
    {
        $maintenanceStatusHistory->update($data);
        return $maintenanceStatusHistory;
    }

    public function delete($maintenanceStatusHistory)
    {
        return $maintenanceStatusHistory->delete();
    }
}