<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\Maintenance;
use App\Services\FeedbackService;
use App\Services\InventoryService;
use App\Services\TransmissionService;
use App\Services\MaintenanceService;
use App\Services\UserService;
use App\Services\UserTransmissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Services\ExportService;

class FeedbackController extends Controller
{
    protected $maintenanceService;
    protected $inventoryService;
    protected $transmissionService;
    protected $userService;
    protected $userTransmissionService;
    protected $feedbackService;
    protected $exportService;

    public function __construct(MaintenanceService $maintenanceService, InventoryService $inventoryService, TransmissionService $transmissionService, UserService $userService, UserTransmissionService $userTransmissionService, FeedbackService $feedbackService, ExportService $exportService)
    {
        $this->maintenanceService = $maintenanceService;
        $this->inventoryService = $inventoryService;
        $this->transmissionService = $transmissionService;
        $this->userService = $userService;
        $this->userTransmissionService = $userTransmissionService;
        $this->feedbackService = $feedbackService;
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

        $maintenances = $this->maintenanceService->getAll($search, $perPage, $sortField, $sortDirection, $userId);

        return Inertia::render('Tasks/Index', compact('maintenances'));
    }

    public function export(Request $request)
    {
        // Ambil input filter
        $search = $request->input('search');
        $perPage = 10;

        // Ambil input sorting
        $sortField = $request->input('sort', 'id');
        $sortDirection = $request->input('direction', 'desc');

        $userId = null;
        if (!Auth::user()->hasAnyRole(['admin', 'ketua tim'])) {
            $userId = Auth::user()->id;
        }

        $maintenances = $this->maintenanceService->getAll($search, $perPage, $sortField, $sortDirection, $userId);

        $fileName = 'tasks_' . now('Asia/Jakarta')->format('Ymd_His') . '.csv';
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
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Maintenance $maintenance, Request $request)
    {
        $data = $request->validate([
            'file' => 'required|file|mimes:jpg,png,mp4,mov|max:20480',
            'description' => 'nullable|string|max:1000',
        ]);

        if ($maintenance->feedbacks()->count() >= 5) {
            return back()->with('error', 'Kamu hanya dapat mengunggah 5 dokumen.');
        }

        $data['maintenance_id'] = $maintenance->id;
        $feedback = $this->feedbackService->create($data, $request->file('file'));

        // 🔑 kalau request Inertia/axios, kembalikan JSON
        if ($request->wantsJson()) {
            return response()->json($feedback);
        }

        return redirect()
            ->route('tasks.view', $maintenance->id)
            ->with('success', 'Berhasil mengunggah laporan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Maintenance $maintenance)
    {
        if (Auth::user()->hasRole('operator') && Auth::user()->id != $maintenance->user_id) {
            return redirect()->route('tasks.index')->with('error', 'Data pemeliharaan tidak ditemukan.');
        }

        $maintenance->load([
            'status_histories.user',
            'transmission',
            'inventory',
            'user',
            'created_by_user',
            'feedbacks',
        ]);

        return Inertia::render('Tasks/Form', [
            'maintenance' => $maintenance,
            'transmission' => $maintenance->transmission,
            'created_by_user' => $maintenance->created_by_user,
            'inventory' => $maintenance->inventory,
            'feedbacks' => $maintenance->feedbacks,
            'status_histories' => $maintenance->status_histories,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Feedback $feedback)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Feedback $feedback)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Feedback $feedback)
    {
        $deleted = $this->feedbackService->delete($feedback);
        if (!$deleted) {
            return redirect()->back()->with('error', 'Gagal menghapus laporan.');
        }

        return redirect()->back()->with('success', 'Berhasil menghapus laporan.');
    }

    /**
     * Start the task.
     */
    public function start(Maintenance $maintenance)
    {
        if ($maintenance->latest_status->status != 0) {
            return redirect()->back()->with('error', 'Gagal memulai tugas.');
        }
        
        $data = $this->maintenanceService->start($maintenance, Auth::user()->id);
        if (!$data) {
            return redirect()->back()->with('error', 'Gagal memulai tugas.');
        }
        return redirect()->route('tasks.index')->with('success', 'Berhasil memulai tugas.');
    }

    public function upload(Request $request)
    {
        $data = $request->validate([
            'maintenance_id' => 'required|exists:maintenances,id',
            'file' => 'required|file|mimes:jpg,png,mp4,mov|max:20480', // 20MB
            'description' => 'required|string|max:1000',
        ]);

        $feedbacks = $this->feedbackService->getAll($data['maintenance_id'], null, 0, "id", "asc");
        if (count($feedbacks) >= 5) {
            return response()->json([
                'message' => 'Kamu hanya dapat mengunggah 5 dokumen laporan.',
            ], 400);
        }

        $response = $this->feedbackService->create($data, $request->file('file') ?? null);

        return response()->json([
            'file_path' => $response->file_path,
            'file_type' => $request->file('file')->getMimeType(),
        ]);
    }

    public function complete(Maintenance $maintenance, Request $request)
    {
        $data = $request->validate([
            'feedback' => 'required|string',
        ]);
        
        if (count($maintenance->feedbacks) < 1) {
            return redirect()->back()->with('error', 'Unggah dokumen tugas terlebih dahulu.');
        }

        if ($maintenance->latest_status->status != 1 && $maintenance->latest_status->status != 3) {
            return redirect()->back()->with('error', 'Gagal menyelesaikan tugas.');
        }
        
        $result = $this->maintenanceService->complete($maintenance, $data, Auth::user()->id);
        if (!$result) {
            return redirect()->back()->with('error', 'Gagal menyelesaikan tugas.');
        }
        return redirect()->route('tasks.index')->with('success', 'Berhasil menyelesaikan tugas.');
    }
}