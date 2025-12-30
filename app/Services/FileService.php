<?php
namespace App\Services;

use App\Repositories\FileRepository;
use App\Repositories\InventoryRepository;

class FileService
{
    protected $fileRepo;

    public function __construct(FileRepository $fileRepo)
    {
        $this->fileRepo = $fileRepo;
    }

    public function getAll($search, $perPage, $sortField, $sortDirection)
    {
        return $this->fileRepo->all($search, $perPage, $sortField, $sortDirection);
    }

    public function getById($id)
    {
        return $this->fileRepo->find($id);
    }

    public function create($data, $file = null)
    {
        if ($data['file']) {
            $data['file_path'] = $this->fileRepo->store($file, "files");
        }
        return $this->fileRepo->create($data);
    }

    public function update($file, $data)
    {
        return $this->fileRepo->update($file, $data);
    }

    public function delete($file)
    {
        return $this->fileRepo->destroy($file);
    }
}