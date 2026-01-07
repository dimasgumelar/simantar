<?php
namespace App\Repositories;

use App\Models\Inventory;

class InventoryRepository
{
    public function all($transmissionIds, $search, $perPage, $sortField, $sortDirection)
    {
        $query = Inventory::query()->select('inventories.*');
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('inventories.name', 'like', "%{$search}%")
                ->orWhere('inventories.inventory_code', 'like', "%{$search}%")
                ->orWhere('categories.name', 'like', "%{$search}%")
                ->orWhere('transmissions.name', 'like', "%{$search}%")
                ->orWhere('inventories.description', 'like', "%{$search}%");
            });
        }
        $query->join('categories', 'inventories.category_id', '=', 'categories.id');
        $query->join('transmissions', 'inventories.transmission_id', '=', 'transmissions.id');

        if ($transmissionIds) {
            $query->whereIn('inventories.transmission_id', $transmissionIds);
        }

        if ($sortField && in_array($sortField, ['id', 'inventory_code', 'name', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection);
        }

        if ($sortField == "category") {
            $query->orderBy("categories.name", $sortDirection);
        }

        if ($sortField == "transmission") {
            $query->orderBy("transmissions.name", $sortDirection);
        }

        if ($perPage > 0) {
            $inventories = $query->with(['category:id,name', 'transmission:id,name'])->paginate($perPage)->withQueryString()->onEachSide(0);
        } else {
            $inventories = $query->get();
        }


        return $inventories;
    }

    public function find($id)
    {
        return Inventory::find($id);
    }

    public function create($data): Inventory
    {
        return Inventory::create($data);
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