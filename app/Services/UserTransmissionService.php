<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserTransmission;
use App\Repositories\RoleRepository;
use App\Repositories\UserRepository;
use App\Repositories\UserTransmissionRepository;
use Illuminate\Support\Str;

class UserTransmissionService
{
    protected $userRepo;
    protected $roleRepo;
    protected $userTransmissionRepo;

    public function __construct(UserRepository $userRepo, RoleRepository $roleRepo, UserTransmissionRepository $userTransmissionRepo)
    {
        $this->userRepo = $userRepo;
        $this->roleRepo = $roleRepo;
        $this->userTransmissionRepo = $userTransmissionRepo;
    }

    public function getAllByUserId($userId, $perPage, $sortField, $sortDirection)
    {
        return $this->userTransmissionRepo->getAllByUserId($userId, $perPage, $sortField, $sortDirection);
    }

    public function getTransmissionAvailableForUser($userId, $perPage, $sortField, $sortDirection)
    {
        return $this->userTransmissionRepo->getTransmissionAvailableForUser($userId, $perPage, $sortField, $sortDirection);
    }

    public function getAllByTransmissionId($transmissionId, $perPage, $sortField, $sortDirection)
    {
        return $this->userTransmissionRepo->getAllByTransmissionId($transmissionId, 0, $sortField, $sortDirection);
    }

    public function getById($id)
    {
        return $this->userRepo->find($id);
    }

    public function create($userId, $transmissionId): UserTransmission|null
    {
        try {
            $userTransmission = $this->userTransmissionRepo->create($userId, $transmissionId);
            if (!$userTransmission) {
                return null;
            }
            return $userTransmission;
        } catch (\Throwable $th) {
            return null;
        }
    }

    public function update($user, $name, $phone, $password, $roleId)
    {
        $userUpdated = $this->userRepo->update($user, $name, $phone, $password);
        if (!$userUpdated) {
            return null;
        }

        $role = $this->roleRepo->find($roleId);
        if (!$role) {
            return null;
        }

        $userUpdated->syncRoles([$role->name]);
        return $userUpdated;
    }

    public function delete($userTransmissionId)
    {
        return $this->userTransmissionRepo->delete($userTransmissionId);
    }
}
