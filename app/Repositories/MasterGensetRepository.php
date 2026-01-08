<?php
namespace App\Repositories;

use App\Models\Inventory;
use App\Models\MasterGenset;

class MasterGensetRepository
{
    public function all($transmissionIds, $search, $perPage, $sortField, $sortDirection)
    {
        $query = MasterGenset::query()->select('*');
        
        if ($transmissionIds) {
            $query->whereIn('id_transmisi', $transmissionIds);
        }

        if ($sortField && in_array($sortField, ['id', 'name', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection);
        }

        if ($perPage > 0) {
            $mGensets = $query->paginate($perPage)->withQueryString()->onEachSide(0);
        } else {
            $mGensets = $query->get();
        }

        return $mGensets;
    }

    public function find($id)
    {
        return MasterGenset::find($id);
    }

    public function create($data): MasterGenset
    {
        return MasterGenset::create($data);
    }

    public function update($inventory, $data)
    {
        $inventory->update($data);
        return $inventory;
    }

    public function delete($inventory)
    {
        return $inventory->delete();
    }
}