<?php
namespace App\Services;

use App\Repositories\FileRepository;
use App\Repositories\MasterGensetRepository;

class MasterGensetService
{
    protected $mastergensetRepo;
    protected $fileRepo;

    public function __construct(MasterGensetRepository $mastergensetRepo, FileRepository $fileRepo)
    {
        $this->mastergensetRepo = $mastergensetRepo;
        $this->fileRepo = $fileRepo;
    }

    public function getAll($transmissionIds, $search, $perPage, $sortField, $sortDirection)
    {
        return $this->mastergensetRepo->all($transmissionIds, $search, $perPage, $sortField, $sortDirection);
    }

    public function getById($id)
    {
        return $this->mastergensetRepo->find($id);
    }

    public function create($data, $photo = null)
    {
        $data['category_id'] = 1;
        
        $lastInventory = $this->mastergensetRepo->all(null, null, 1, 'id', 'desc')->first();

        // Inventory code generation format INV202504010001 => INV{year}{month}{day}{incremental_number}
        $data['inventory_code'] = 'INV' . date('Ymd') . str_pad(($lastInventory ? $lastInventory->id + 1 : 1), 4, '0', STR_PAD_LEFT);
        
        if ($data['photo']) {
            $data['photo_path'] = $this->fileRepo->store($photo, "inventories");
        }
        return $this->mastergensetRepo->create($data);
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

        return $this->mastergensetRepo->update($inventory, $data);

    }

    public function delete($inventory)
    {
        if ($inventory->id === 1) {
            // Prevent deletion of the default inventory
            return false;
        }
        return $this->mastergensetRepo->delete($inventory);
    }
}