<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Redirect;
use App\Rules\StrongPassword;
use App\Services\ExportService;
use App\Services\RoleService;
use App\Services\UserService;

class UserController extends Controller
{
    protected $userService;
    protected $roleService;
    protected $exportService;

    public function __construct(UserService $userService, RoleService $roleService, ExportService $exportService)
    {
        $this->userService = $userService;
        $this->roleService = $roleService;
        $this->exportService = $exportService;
    }
    // Tampilkan semua user
    public function index(Request $request)
    {
        // Ambil input filter
        $search = $request->input('search');
        $roleIds = $request->input('roles', []);
        $perPage = $request->input('per_page', 10);

        // Ambil input sorting
        $sortField = $request->input('sort', '');
        $sortDirection = $request->input('direction', 'asc');

        $users = $this->userService->getAll($search, $roleIds, $perPage, $sortField, $sortDirection);
        $roles = $this->roleService->getAll();

        return Inertia::render('Users/Index', compact('users', 'roles'));
    }

    public function export(Request $request)
    {
        // Ambil input filter
        $search = $request->input('search');
        $roleIds = $request->input('roles', []);
        $perPage = 0;

        // Ambil input sorting
        $sortField = $request->input('sort', '');
        $sortDirection = $request->input('direction', 'asc');

        $users = $this->userService->getAll($search, $roleIds, $perPage, $sortField, $sortDirection);

        $fileName = 'users_' . now('Asia/Jakarta')->format('Ymd_His') . '.csv';
        $callback = function () use ($users) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Nama', 'Email', 'Telepon', 'Peran', 'Tanggal Ditambahkan', 'Tanggal Diperbarui']);

            foreach ($users as $user) {
                fputcsv($handle, [
                    $user->id,
                    $user->name,
                    $user->email,
                    "'" . $user->phone,
                    $user->roles->pluck('name')->join(', '),
                    $user->created_at,
                    $user->updated_at,
                ]);
            }
            fclose($handle);
        };

        return $this->exportService->export($fileName, $callback);
    }

    // Tampilkan form tambah user
    public function create()
    {
        return Inertia::render('Users/Form', [
            'roles' => $this->roleService->getAll(),
        ]);
    }

    // Simpan user baru
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => ['nullable', 'string', 'min:9', 'regex:/^\d+$/'],
            'nip' => 'nullable|string|max:50|unique:users,nip',
            'pangkat_golongan' => 'nullable|string|max:255',
            'jabatan' => 'nullable|string|max:255',
            'password' => [
                'required',
                'string',
                'min:8',
                new StrongPassword(),
            ],
            'role' => 'required|exists:roles,id',
        ]);

        $user = $this->userService->create($request->name, $request->email, $request->phone, $request->password, $request->role, $request->nip, $request->pangkat_golongan, $request->jabatan);
        if (!$user) {
            return Redirect::back()->with('error', 'Gagal menambah data pengguna.');
        }
        
        return Redirect::route('users.index')->with('success', 'Berhasil menambah data pengguna.');
    }

    // Tampilkan form edit
    public function edit(User $user)
    {
        return Inertia::render('Users/Form', [
            'user' => $user->load('roles'),
            'roles' => $this->roleService->getAll(),
            'isEdit' => true,
        ]);
    }

    public function show(User $user)
    {
        return Inertia::render('Users/Show', [
            'user' => $user->load('roles'),
        ]);
    }

    // Update user
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required', 'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'phone' => ['nullable', 'string', 'min:9', 'regex:/^\d+$/'],
            'nip' => ['nullable', 'string', 'max:50', Rule::unique('users', 'nip')->ignore($user->id)],
            'pangkat_golongan' => 'nullable|string|max:255',
            'jabatan' => 'nullable|string|max:255',
            'password' => [
                'nullable',
                'string',
                'min:8',
                new StrongPassword(),
            ],
            'role' => 'required|exists:roles,id',
        ]);

        $userUpdated = $this->userService->update($user, $request->name, $request->phone, $request->password, $request->role, $request->nip, $request->pangkat_golongan, $request->jabatan);
        if (!$userUpdated) {
            return Redirect::back()->with('error', 'Gagal mengubah data pengguna.');
        }
        
        return Redirect::route('users.index')->with('success', 'Berhasil mengubah data pengguna.');
    }

    // Hapus user
    public function destroy(User $user)
    {
        $userDeleted = $this->userService->delete($user);
        if (!$userDeleted) {
            return Redirect::back()->with('error', 'Gagal menghapus data pengguna.');
        }

        return Redirect::route('users.index')->with('success', 'Berhasil menghapus data pengguna.');
    }
}