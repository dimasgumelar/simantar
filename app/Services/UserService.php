<?php
namespace App\Services;

use App\Models\User;
use App\Repositories\RoleRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\Str;

class UserService
{
    protected $userRepo;
    protected $roleRepo;

    public function __construct(UserRepository $userRepo, RoleRepository $roleRepo)
    {
        $this->userRepo = $userRepo;
        $this->roleRepo = $roleRepo;
    }

    public function getAll($search, $roleIds, $perPage, $sortField, $sortDirection)
    {
        // dd($search);
        return $this->userRepo->all($search, $roleIds, $perPage, $sortField, $sortDirection);
    }

    public function getById($id)
    {
        return $this->userRepo->find($id);
    }

    public function create($name, $email, $phone, $password, $roleId): User|null
    {
        $role = $this->roleRepo->findOrFail($roleId);
        if (!$role) {
            return null;
        }

        if (Str::startsWith($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        }

        $user = $this->userRepo->create($name, $email, $phone, $password);
        if (!$user) {
            return null;
        }

        $user->assignRole($role->name);

        return $user;
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

    public function delete($user)
    {
        return $this->userRepo->delete($user);
    }
}