<?php

namespace App\Http\Controllers;

use App\Models\Transmission;
use App\Services\ExportService;
use App\Services\TransmissionService;
use App\Services\UserTransmissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransmissionController extends Controller
{
    protected $transmissionService;
    protected $exportService;
    protected $userTransmissionService;

    public function __construct(TransmissionService $transmissionService, ExportService $exportService, UserTransmissionService $userTransmissionService)
    {
        $this->transmissionService = $transmissionService;
        $this->exportService = $exportService;
        $this->userTransmissionService = $userTransmissionService;
    }
    public function index(Request $request)
    {
        $search = $request->input('search');
        $isActives = $request->input('status', []);
        $isPowerOuts = $request->input('is_power_out', []);
        $perPage = $request->input('per_page', 10);

        // Ambil input sorting
        $sortField = $request->input('sort', '');
        $sortDirection = $request->input('direction', 'asc');

        $transmissions = $this->transmissionService->getAll($search, $isActives, $isPowerOuts, $perPage, $sortField, $sortDirection);

        return Inertia::render('Transmissions/Index', compact('transmissions'));
    }

    public function export(Request $request)
    {
        $search = $request->input('search');
        $isActives = $request->input('status', []);
        $isPowerOuts = $request->input('is_power_out', []);
        $perPage = 0;

        // Ambil input sorting
        $sortField = $request->input('sort', '');
        $sortDirection = $request->input('direction', 'asc');

        $transmissions = $this->transmissionService->getAll($search, $isActives, $isPowerOuts, $perPage, $sortField, $sortDirection);

        $fileName = 'transmissions_' . now('Asia/Jakarta')->format('Ymd_His') . '.csv';
        $callback = function () use ($transmissions) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Nama', 'Alamat', 'Latitude', 'Longitude', 'Status', 'Deskripsi', 'Foto', 'Tanggal Ditambahkan', 'Tanggal Diperbarui']);

            foreach ($transmissions as $transmission) {
                fputcsv($handle, [
                    $transmission->id,
                    $transmission->name,
                    $transmission->address,
                    $transmission->latitude,
                    $transmission->longitude,
                    $transmission->is_active == 1 ? "Aktif" : "Tidak Aktif",
                    $transmission->description,
                    config('app.url')."/storage/".$transmission->photo_path,
                    $transmission->created_at,
                    $transmission->updated_at,
                ]);
            }
            fclose($handle);
        };

        return $this->exportService->export($fileName, $callback);
    }

    public function create()
    {
        return Inertia::render('Transmissions/Form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'latitude' => 'required|numeric|max:90|min:-90',
            'longitude' => 'required|numeric|max:180|min:-180',
            'is_active' => 'required|min:0|max:1',
            'is_power_out' => 'nullable|boolean',
            'photo' => 'nullable|image|max:2048',
            'description' => 'nullable|string|max:1000',
            'transmission_type' => 'nullable|string|max:50',
        ]);

        $transmission = $this->transmissionService->create($data, $request->file('photo') ?? null);
        if (!$transmission) {
            return redirect()->back()->with('error', 'Gagal membuat data transmisi.');
        }

        return redirect()->route('transmissions.index')->with('success', 'Berhasil membuat data transmisi.');
    }

    public function show(Transmission $transmission)
    {
        return Inertia::render('Transmissions/Show', [
            'transmission' => $transmission->load('koordinator'),
        ]);
    }

    public function edit(Transmission $transmission)
    {
        return Inertia::render('Transmissions/Form', [
            'transmission' => $transmission,
            'isEdit' => true,
            'linkedUsers' => $this->userTransmissionService->getAllByTransmissionId($transmission->id, 0, 'name', 'ASC'),
        ]);
    }

    public function update(Request $request, Transmission $transmission)
    {
        $request->merge(['koordinator_id' => $request->koordinator_id ?: null]);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'latitude' => 'required|numeric|max:90|min:-90',
            'longitude' => 'required|numeric|max:180|min:-180',
            'is_active' => 'required|min:0|max:1',
            'is_power_out' => 'nullable|boolean',
            'photo' => 'nullable|image|max:2048',
            'photo_path' => 'nullable|string',
            'description' => 'nullable|string',
            'transmission_type' => 'nullable|string|max:50',
            'koordinator_id' => 'nullable|exists:users,id',
        ]);

        $transmissionUpdated = $this->transmissionService->update($transmission, $data, $request->file('photo') ?? null);
        if (!$transmissionUpdated) {
            return redirect()->back()->with('error', 'Gagal mengubah data transmisi.');
        }

        return redirect()->route('transmissions.index')->with('success', 'Berhasil mengubah data transmisi.');
    }

    public function destroy(Transmission $transmission)
    {
        $transmissionDeleted = $this->transmissionService->delete($transmission);
        if (!$transmissionDeleted) {
            return redirect()->back()->with('error', 'Gagal menghapus data transmisi.');
        }

        return redirect()->route('transmissions.index')->with('success', 'Berhasil menghapus data transmisi.');
    }
}