<?php

namespace App\Http\Controllers;

use App\Models\Maintenance;
use App\Services\InventoryService;
use App\Services\TransmissionService;
use App\Services\MaintenanceService;
use App\Services\MaintenanceStatusHistoryService;
use App\Services\UserService;
use App\Services\UserTransmissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Services\ExportService;

class MaintenanceController extends Controller
{
    protected $maintenanceService;
    protected $maintenanceStatusHistoryService;
    protected $inventoryService;
    protected $transmissionService;
    protected $userService;
    protected $userTransmissionService;
    protected $exportService;

    public function __construct(MaintenanceService $maintenanceService, MaintenanceStatusHistoryService $maintenanceStatusHistoryService, InventoryService $inventoryService, TransmissionService $transmissionService, UserService $userService, UserTransmissionService $userTransmissionService, ExportService $exportService)
    {
        $this->maintenanceService = $maintenanceService;
        $this->maintenanceStatusHistoryService = $maintenanceStatusHistoryService;
        $this->inventoryService = $inventoryService;
        $this->transmissionService = $transmissionService;
        $this->userService = $userService;
        $this->userTransmissionService = $userTransmissionService;
        $this->exportService = $exportService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Ambil input filter
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        // Ambil input sorting
        $sortField = $request->input('sort', 'id');
        $sortDirection = $request->input('direction', 'desc');

        $userId = null;
        if (!Auth::user()->hasAnyRole(['admin', 'ketua tim'])) {
            $userId = Auth::user()->id;
        }

        $maintenances = $this->maintenanceService->getAll($search, $perPage, $sortField, $sortDirection, null, $userId);

        return Inertia::render('Maintenances/Index', compact('maintenances'));
    }

    public function export(Request $request)
    {
        // Ambil input filter
        $search = $request->input('search');
        $perPage = 0;

        // Ambil input sorting
        $sortField = $request->input('sort', 'id');
        $sortDirection = $request->input('direction', 'desc');

        $userId = null;
        if (!Auth::user()->hasAnyRole(['admin', 'ketua tim'])) {
            $userId = Auth::user()->id;
        }

        $maintenances = $this->maintenanceService->getAll($search, $perPage, $sortField, $sortDirection, null, $userId);

        $fileName = 'maintenances_' . now('Asia/Jakarta')->format('Ymd_His') . '.csv';
        $callback = function () use ($maintenances) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Alat', 'Transmisi', 'Pengguna', 'Status', 'Deskripsi', 'Laporan', 'Waktu Dijadwalkan', 'Waktu Dalam Proses', 'Waktu Selesai', 'Dibuat oleh', 'Tanggal Ditambahkan', 'Tanggal Diperbarui', 'Dokumen']);

            foreach ($maintenances as $maintenance) {
                $filePath = "";
                foreach ($maintenance->feedbacks as $key => $feedback) {
                    $filePath .= $feedback->description.":\n";
                    $filePath .= config('app.url')."/storage/".$feedback->file_path."\n";
                }
                $status = "";
                switch ($maintenance->status) {
                    case 0:
                        $status = "Menunggu";
                        break;
                    case 1:
                        $status = "Dalam Proses";
                        break;
                    case 2:
                        $status = "Selesai";
                        break;
                    default:
                        break;
                }
                fputcsv($handle, [
                    $maintenance->id,
                    $maintenance->inventory->name,
                    $maintenance->transmission->name,
                    $maintenance->user->name,
                    $status,
                    $maintenance->description,
                    $maintenance->feedback,
                    $maintenance->scheduled_at,
                    $maintenance->inprogress_at,
                    $maintenance->completed_at,
                    $maintenance->created_by_user->name,
                    $maintenance->created_at,
                    $maintenance->updated_at,
                    $filePath,
                ]);
            }
            fclose($handle);
        };

        return $this->exportService->export($fileName, $callback);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $transmissions = $this->transmissionService->getAll(null, null, null, 0, 'id', 'asc');
        if ($transmissions->isEmpty()) {
            return redirect()->route('transmissions.create')->with('warning', 'Silakan menambah transmisi sebelum menambah data pemeliharaan.');
        }

        $transmissionId = $request->input('transmission_id', $transmissions[0]->id);

        $inventories = $this->inventoryService->getAll($transmissionId, null, 0, 'id', 'asc');
        // if ($inventories->isEmpty()) {
        //     return redirect()->route('inventories.create')->with('warning', 'Please create an inventory before adding a maintenance record.');
        // }

        $users = $this->userTransmissionService->getAllByTransmissionId($transmissionId, 0, 'name', 'asc');
        
        $maintenance = new Maintenance();
        $maintenance->transmission_id = $transmissionId ?? $transmissions[0]->id;
        if ($inventories->isNotEmpty()) {
            $maintenance->inventory_id = $inventories[0]->id;
        }
        if ($users->isNotEmpty()) {
            $maintenance->user_id = $users[0]->user_id;
        }
        $maintenance->description = '';
        // $maintenance->scheduled_at = now('Asia/Jakarta')->format('Y-m-d\TH:i');

        return Inertia::render('Maintenances/Form', [
            'maintenance' => $maintenance,
            'transmissions' => $transmissions,
            'inventories' => $inventories,
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'transmission_id' => 'required|min:0',
            'inventory_id' => 'required|min:0',
            'user_id' => 'required|min:0',
            'description' => 'max:255',
            'scheduled_at' => 'required|date',
            // 'status' => 'required|min:0|max:2',
        ]);

        $data["created_by"] = Auth::user()->id;
        
        $maintenance = $this->maintenanceService->create($data);
        if (!$maintenance) {
            return redirect()->back()->with('error', 'Gagal menambah pemeliharaan.');
        }

        return redirect()->route('maintenances.index')->with('success', 'Berhasil menambah pemeliharaan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Maintenance $maintenance)
    {
        if (Auth::user()->hasRole('teknisi') && Auth::user()->id != $maintenance->created_by) {
            return redirect()->route('maintenances.index')->with('error', 'Data pemeliharaan tidak ditemukan.');
        }

        $maintenance->load([
            'status_histories.user',
            'transmission',
            'inventory',
            'user',
            'created_by_user',
            'feedbacks',
        ]);

        return Inertia::render('Maintenances/Show', [
            'maintenance' => $maintenance,
            'transmission' => $maintenance->transmission,
            'inventory' => $maintenance->inventory,
            'user_maintenance' => $maintenance->user,
            'created_by_user' => $maintenance->created_by_user,
            'feedbacks' => $maintenance->feedbacks,
            'status_histories' => $maintenance->status_histories,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Maintenance $maintenance, Request $request)
    {
        if (Auth::user()->hasRole('teknisi') && Auth::user()->id != $maintenance->created_by) {
            return redirect()->route('maintenances.index')->with('error', 'Data pemeliharaan tidak ditemukan.');
        }
        
        $transmissions = $this->transmissionService->getAll(null, null, null, 0, 'id', 'asc');
        if ($transmissions->isEmpty()) {
            return redirect()->route('transmissions.create')->with('warning', 'Silakan menambah transmisi sebelum menambah data pemeliharaan.');
        }

        $transmissionId = $request->input('transmission_id', $maintenance->transmission->id);
        $maintenance->transmission_id = $transmissionId;
        
        $inventories = $this->inventoryService->getAll($transmissionId, null, 0, 'id', 'asc');
        
        $users = $this->userTransmissionService->getAllByTransmissionId($transmissionId, 0, 'name', 'asc');
        if ($maintenance->transmission_id != $maintenance->transmission->id) {
            if (count($users) > 0) {
                $maintenance->user_id = $users[0]->user_id;
            } else {
                $maintenance->user_id = null;
            }
            if (count($inventories) > 0) {
                $maintenance->inventory_id = $inventories[0]->id;
            } else {
                $maintenance->inventory_id = null;
            }
        }

        return Inertia::render('Maintenances/Form', [
            'maintenance' => $maintenance,
            'transmissions' => $transmissions,
            'inventories' => $inventories,
            'users' => $users,
            'feedbacks' => $maintenance->feedbacks,
            'created_by_user' => $maintenance->created_by_user,
            'isEdit' => True,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Maintenance $maintenance)
    {
        $data = $request->validate([
            'transmission_id' => 'required|min:0',
            'inventory_id' => 'required|min:0',
            'user_id' => 'required|min:0',
            'description' => 'max:255',
            'scheduled_at' => 'required|date',
            'status' => 'required|min:0|max:2',
        ]);

        $maintenance = $this->maintenanceService->update($maintenance, $data);
        if (!$maintenance) {
            return redirect()->back()->with('error', 'Gagal mengubah data pemeliharaan.');
        }

        return redirect()->route('maintenances.index')->with('success', 'Berhasil mengubah data pemeliharaan.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Maintenance $maintenance)
    {
        $deleted = $this->maintenanceService->delete($maintenance);
        if (!$deleted) {
            return redirect()->back()->with('error', 'Gagal menghapus data pemeliharaan.');
        }
        
        return redirect()->route('maintenances.index')->with('success', 'Berhasil menghapus data pemeliharaan.');
    }
    
    /**
     * Approve the specified resource from storage.
    */
    public function approve(Request $request, Maintenance $maintenance)
    {
        if ($maintenance->latest_status->status != 2) {
            return redirect()->back()->with('error', 'Gagal menyetujui data pemeliharaan.');
        }
        
        $data = $request->validate([
            'note' => 'required|max:255',
        ]);
        
        $result = $this->maintenanceService->approve($maintenance, $data, Auth::user()->id);
        if (!$result) {
            return redirect()->back()->with('error', 'Gagal menyetujui data pemeliharaan.');
        }

        return redirect()->route('maintenances.index')->with('success', 'Berhasil menyetujui data pemeliharaan.');
    }
    
    /**
     * Reject the specified resource from storage.
    */
    public function reject(Request $request, Maintenance $maintenance)
    {
        if ($maintenance->latest_status->status != 2) {
            return redirect()->back()->with('error', 'Gagal menolak data pemeliharaan.');
        }
        
        $data = $request->validate([
            'note' => 'required|max:255',
        ]);

        $result = $this->maintenanceService->reject($maintenance, $data, Auth::user()->id);
        if (!$result) {
            return redirect()->back()->with('error', 'Gagal menolak data pemeliharaan.');
        }
    
        return redirect()->route('maintenances.index')->with('success', 'Berhasil menolak data pemeliharaan.');
    }
}