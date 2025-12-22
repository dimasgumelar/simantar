<?php
namespace App\Repositories;

use App\Models\Maintenance;
use Illuminate\Support\Facades\DB;

class MaintenanceRepository
{
    // public function all($search, $perPage, $sortField, $sortDirection, $userId = null, $createdBy = null, $status = null)
    // {
    //     $query = Maintenance::query()->select('maintenances.*');
    //     if ($search) {
    //         $query->where(function($q) use ($search) {
    //             $q->where('inventories.name', 'like', "%{$search}%")
    //             ->orWhere('transmissions.name', 'like', "%{$search}%")
    //             ->orWhere('maintenances.description', 'like', "%{$search}%")
    //             ->orWhere('users.name', 'like', "%{$search}%");
    //         });
    //     }
    //     $query->join('inventories', 'maintenances.inventory_id', '=', 'inventories.id');
    //     $query->join('transmissions', 'maintenances.transmission_id', '=', 'transmissions.id');
    //     $query->join('users', 'maintenances.user_id', '=', 'users.id');
    //     if ($sortField && in_array($sortField, ['id', 'status', 'created_at'])) {
    //         $query->orderBy($sortField, $sortDirection);
    //     }

    //     if ($sortField == "inventory") {
    //         $query->orderBy("inventories.name", $sortDirection);
    //     }

    //     if ($sortField == "transmission") {
    //         $query->orderBy("transmissions.name", $sortDirection);
    //     }

    //     if ($sortField == "name") {
    //         $query->orderBy("users.name", $sortDirection);
    //     }

    //     if ($userId) {
    //         $query->where("user_id", $userId);
    //     }

    //     if ($createdBy) {
    //         $query->where("created_by", $createdBy);
    //     }

    //     if ($status) {
    //         $query->where("status", $status);
    //     }

    //     $maintenances = $query->with(['inventory:id,name', 'transmission:id,name', 'user:id,name'])->paginate($perPage)->withQueryString()->onEachSide(0);

    //     return $maintenances;
    // }

    public function all($search, $perPage, $sortField, $sortDirection, $userId = null, $createdBy = null, $status = null)
    {
        $query = Maintenance::query()
            ->select('maintenances.*', 'latest.status as latest_status', 'latest.status_date');

        // Join untuk status terbaru
        $query->leftJoin(DB::raw("
            (
                SELECT msh1.maintenance_id, msh1.status, msh1.created_at AS status_date
                FROM maintenance_status_histories msh1
                LEFT JOIN maintenance_status_histories msh2
                    ON msh1.maintenance_id = msh2.maintenance_id 
                    AND msh2.id > msh1.id
                WHERE msh2.id IS NULL
            ) AS latest
        "), 'latest.maintenance_id', '=', 'maintenances.id');

        // Join lainnya
        $query->join('inventories', 'maintenances.inventory_id', '=', 'inventories.id');
        $query->join('transmissions', 'maintenances.transmission_id', '=', 'transmissions.id');
        $query->join('users', 'maintenances.user_id', '=', 'users.id');

        // Searching
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('inventories.name', 'like', "%{$search}%")
                ->orWhere('transmissions.name', 'like', "%{$search}%")
                ->orWhere('maintenances.description', 'like', "%{$search}%")
                ->orWhere('users.name', 'like', "%{$search}%");
            });
        }

        // Sorting
        if ($sortField && in_array($sortField, ['id', 'created_at'])) {
            $query->orderBy("maintenances.$sortField", $sortDirection);
        }

        if ($sortField == "status") {
            $query->orderBy("latest.status", $sortDirection);
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

        // Filter
        if ($userId) {
            $query->where("user_id", $userId);
        }

        if ($createdBy) {
            $query->where("created_by", $createdBy);
        }

        if ($status) {
            $query->where("latest.status", $status); // pakai status terbaru!
        }

        // Final
        return $query
            ->with(['inventory:id,name', 'transmission:id,name', 'user:id,name'])
            ->paginate($perPage)
            ->withQueryString()
            ->onEachSide(0);
    }

    public function info($userId = null, $createdBy = null)
    {
        // Step 1: Ambil created_at terbaru untuk setiap maintenance_id
        $latestStatusTimeSub = DB::table('maintenance_status_histories')
            ->select('maintenance_id', DB::raw('MAX(created_at) AS latest_created_at'))
            ->groupBy('maintenance_id');

        // Step 2: Join dengan tabel status history untuk ambil status berdasarkan waktu terbaru
        $latestStatusSub = DB::table('maintenance_status_histories as msh')
            ->joinSub($latestStatusTimeSub, 't', function($join) {
                $join->on('msh.maintenance_id', '=', 't.maintenance_id')
                    ->on('msh.created_at', '=', 't.latest_created_at');
            })
            ->select('msh.maintenance_id', 'msh.status');

        // Step 3: Query utama
        $query = DB::table('maintenances')
            ->joinSub($latestStatusSub, 'latest', function ($join) {
                $join->on('latest.maintenance_id', '=', 'maintenances.id');
            })
            ->select('latest.status', DB::raw('COUNT(latest.status) as status_count'));

        if ($userId) {
            $query->where("maintenances.user_id", $userId);
        }

        if ($createdBy) {
            $query->where("maintenances.created_by", $createdBy);
        }

        $query->groupBy("latest.status");

        return $query->get();
    }

    public function find($id)
    {
        return Maintenance::find($id);
    }

    public function create($data): Maintenance
    {
        return Maintenance::create($data);
    }

    public function update($maintenance, $data)
    {
        $maintenance->update($data);
        return $maintenance;
    }

    public function delete($maintenance)
    {
        return $maintenance->delete();
    }
}