<?php
namespace App\Repositories;

use App\Models\User;
use App\Models\Transmission;
use App\Models\UserTransmission;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserTransmissionRepository
{
    public function getAllByUserId($userId, $perPage, $sortField, $sortDirection)
    {
        $query = DB::table('user_transmissions')
            ->join('transmissions', 'transmissions.id', '=', 'user_transmissions.transmission_id')
            ->join('users', 'users.id', '=', 'user_transmissions.user_id')
            ->where('user_transmissions.user_id', $userId)
            ->select('user_transmissions.*', 'transmissions.name');

        if ($sortField && in_array($sortField, ['name', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection);
        }

        $transmissions = $query->paginate($perPage)->withQueryString()->onEachSide(0);

        return $transmissions;
    }

    public function getTransmissionAvailableForUser($userId, $perPage, $sortField, $sortDirection)
    {
        $transmissions = Transmission::whereNotIn('id', function ($query) use ($userId) {
            $query->select('transmission_id')
                ->from('user_transmissions')
                ->where('user_id', $userId);
        })
        ->orderBy($sortField, $sortDirection);

        if ($perPage > 0) {
            $data = $transmissions->paginate($perPage);
        } else {
            $data = $transmissions->get();
        }

        return $data;
    }

    public function getUsersAvailableForTransmission($transmissionId, $perPage, $sortField, $sortDirection)
    {
        $users = User::whereNotIn('id', function ($query) use ($transmissionId) {
            $query->select('user_id')
                ->from('user_transmissions')
                ->where('transmission_id', $transmissionId);
        })
        ->whereDoesntHave('roles', function ($query) {
            $query->where('name', 'sdm');
        })
        ->orderBy($sortField, $sortDirection);

        if ($perPage > 0) {
            $data = $users->paginate($perPage);
        } else {
            $data = $users->get();
        }

        return $data;
    }

    public function getAllByTransmissionId($transmissionId, $perPage, $sortField, $sortDirection)
    {
        $query = DB::table('user_transmissions')
            ->join('transmissions', 'transmissions.id', '=', 'user_transmissions.transmission_id')
            ->join('users', 'users.id', '=', 'user_transmissions.user_id')
            ->where('user_transmissions.transmission_id', $transmissionId)
            ->select('user_transmissions.*', 'users.name', 'users.nip');

        if ($sortField && in_array($sortField, ['name', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection);
        }

        if ($perPage > 0) {
            $transmissions = $query->paginate($perPage)->withQueryString()->onEachSide(0);
        } else {
            $transmissions = $query->get();
        }

        return $transmissions;
    }

    public function find($id)
    {
        return UserTransmission::find($id);
    }

    public function create($userId, $transmissionId): UserTransmission
    {
        return UserTransmission::create([
            'user_id' => $userId,
            'transmission_id' => $transmissionId,
        ]);
    }

    public function update($user, $name, $phone, $password)
    {
        $user->update([
            'name' => $name,
            'email' => $user->email,
            'phone' => $phone,
            'password' => $password
                ? Hash::make($password)
                : $user->password,
        ]);

        return $user;
    }

    public function delete($userTransmissionId)
    {
        return UserTransmission::destroy($userTransmissionId);
    }
}