<?php
namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserRepository
{
    public function all($search, $roleIds, $perPage, $sortField, $sortDirection)
    {
        $query = User::with('roles');
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if (!empty($roleIds)) {
            $query->whereHas('roles', function($q) use ($roleIds) {
                $q->whereIn('roles.id', $roleIds);
            });
        }

        if ($sortField && in_array($sortField, ['name', 'email', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection);
        }

       $users = $perPage == 0
            ? $query->get()
            : $query->paginate($perPage)->withQueryString()->onEachSide(0);

        return $users;
    }

    public function find($id)
    {
        return User::find($id);
    }

    public function create($name, $email, $phone, $password, $nip = null, $pangkatGolongan = null, $jabatan = null): User
    {
        return User::create([
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'password' => Hash::make($password),
            'nip' => $nip,
            'pangkat_golongan' => $pangkatGolongan,
            'jabatan' => $jabatan,
        ]);
    }

    public function update($user, $name, $phone, $password, $nip = null, $pangkatGolongan = null, $jabatan = null)
    {
        $user->update([
            'name' => $name,
            'email' => $user->email,
            'phone' => $phone,
            'password' => $password
                ? Hash::make($password)
                : $user->password,
            'nip' => $nip,
            'pangkat_golongan' => $pangkatGolongan,
            'jabatan' => $jabatan,
        ]);

        return $user;
    }

    public function delete($user)
    {
        return $user->delete();
    }
}