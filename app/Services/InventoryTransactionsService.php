<?php
namespace App\Services;

use App\Repositories\FileRepository;
use App\Repositories\InventoryRepository;
use App\Repositories\InventoryTransactionsRepository;

class InventoryTransactionsService
{
    protected $inventoryRepo;
    protected $inventoryTransactionsRepo;
    protected $fileRepo;

    public function __construct(InventoryRepository $inventoryRepo, InventoryTransactionsRepository $inventoryTransactionsRepo, FileRepository $fileRepo)
    {
        $this->inventoryRepo = $inventoryRepo;
        $this->inventoryTransactionsRepo = $inventoryTransactionsRepo;
        $this->fileRepo = $fileRepo;
    }

    public function getAll($search, $perPage, $sortField, $sortDirection)
    {
        return $this->inventoryTransactionsRepo->all($search, $perPage, $sortField, $sortDirection);
    }

    public function getById($id)
    {
        return $this->inventoryTransactionsRepo->find($id);
    }

    public function create($data, $photo = null)
    {
        if ($data["status"] == 2) {
            $inventory = $this->inventoryRepo->find($data["inventory_id"]);
            $inventoryData["transmission_id"] = $data["transmission_id"];
            $this->inventoryRepo->update($inventory, $inventoryData);    
        }

        if ($data['photo']) {
            $data['photo_path'] = $this->fileRepo->store($photo, "inventory-transaction");
        }
        return $this->inventoryTransactionsRepo->create($data);
    }

    public function update($inventory, $data, $photo = null)
    {
        if ($photo) {
            $this->fileRepo->delete($inventory->photo_path);
            $data['photo_path'] = $this->fileRepo->store($photo, "inventories");
        } elseif ($data['photo'] === null && $data['photo_path'] === null) {
            $this->fileRepo->delete($inventory->photo_path);
            $data['photo_path'] = null;
        }

        return $this->inventoryTransactionsRepo->update($inventory, $data);

    }

    public function delete($inventory)
    {
        if ($inventory->id === 1) {
            // Prevent deletion of the default inventory
            return false;
        }
        return $this->inventoryTransactionsRepo->delete($inventory);
    }
}