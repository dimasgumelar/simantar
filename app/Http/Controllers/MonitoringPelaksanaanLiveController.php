<?php

namespace App\Http\Controllers;

use App\Models\MonitoringPelaksanaanLive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class MonitoringPelaksanaanLiveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = MonitoringPelaksanaanLive::with('user')->latest();

        // Filter berdasarkan tanggal
        if ($request->has('tanggal_dari')) {
            $query->where('tanggal_pelaksanaan', '>=', $request->tanggal_dari);
        }
        if ($request->has('tanggal_sampai')) {
            $query->where('tanggal_pelaksanaan', '<=', $request->tanggal_sampai);
        }

        // Filter berdasarkan user
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter lainnya
        if ($request->has('nama_acara')) {
            $query->where('nama_acara', 'like', '%' . $request->nama_acara . '%');
        }

        if ($request->has('lokasi')) {
            $query->where('lokasi', 'like', '%' . $request->lokasi . '%');
        }

        if ($request->has('kesiapan_peralatan')) {
            $query->where('kesiapan_peralatan', $request->kesiapan_peralatan);
        }

        if ($request->has('kondisi_akhir_peralatan')) {
            $query->where('kondisi_akhir_peralatan', $request->kondisi_akhir_peralatan);
        }

        $data = $query->get();

        return Inertia::render('MonitoringPelaksanaanLive/List', [
            'data' => $data,
            'filters' => $request->all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('MonitoringPelaksanaanLive/Index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info('=== STORE METHOD CALLED ===');
        Log::info('Request data:', $request->all());

        try {
            // Validasi
            $validated = $request->validate([
                'tanggal_pelaksanaan' => 'required|date',
                'nama_acara' => 'required|string|max:255',
                'lokasi' => 'required|string|max:255',
                'kesiapan_peralatan' => 'required|in:Sangat Siap,Cukup,Kurang Siap',
                'detail_peralatan' => 'required|array|min:1',
                'kondisi_uji_coba' => 'required|in:Ya, Dilakukan dan Berjalan Baik,Ya Dilakukan tetapi terdapat kendala,Tidak Dilakukan',
                'catatan_uji_coba' => 'required_if:kondisi_uji_coba,Ya Dilakukan tetapi terdapat kendala',
                'stabilitas_sinyal' => 'required|integer|min:1|max:5',
                'kualitas_av_ke_mcr' => 'required|integer|min:1|max:5',
                'kendala_teknis' => 'nullable|string',
                'langkah_penanganan' => 'nullable|string',
                'durasi_gangguan' => 'nullable|string',
                'proses_shutdown' => 'required|in:Sesuai prosedur,Ada Kendala minor,Tidak Sesuai prosedur',
                'kondisi_akhir_peralatan' => 'required|in:Baik dan berfungsi normal,Ada Kerusakan ringan,Perlu perbaikan /servis',
                'foto' => 'nullable|image|max:1024',
            ]);

            Log::info('Validation passed:', $validated);

            // Handle upload foto
            if ($request->hasFile('foto')) {
                $path = $request->file('foto')->store('monitoring-pelaksanaan-live', 'public');
                $validated['foto'] = $path;
                Log::info('Foto uploaded to:', [$path]);
            }

            // Tambahkan user_id
            $validated['user_id'] = auth()->id();
            
            // Convert detail_peralatan to JSON if it's array
            if (is_array($validated['detail_peralatan'])) {
                $validated['detail_peralatan'] = json_encode($validated['detail_peralatan']);
            }

            Log::info('Final data to save:', $validated);

            // Simpan data
            $monitoring = MonitoringPelaksanaanLive::create($validated);
            
            Log::info('Data saved successfully with ID:', [$monitoring->id]);

            return redirect()->route('monitoring-pelaksanaan-live.my-data')
                ->with('success', 'Data pelaksanaan siaran live berhasil disimpan!');

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed:', ['errors' => $e->errors()]);
            throw $e;
        } catch (\Exception $e) {
            Log::error('Error saving data:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(MonitoringPelaksanaanLive $monitoringPelaksanaanLive)
    {
        // Tidak digunakan, redirect ke index
        return redirect()->route('monitoring-pelaksanaan-live.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MonitoringPelaksanaanLive $monitoringPelaksanaanLive)
    {
        // Pastikan user hanya bisa edit data miliknya
        if ($monitoringPelaksanaanLive->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('MonitoringPelaksanaanLive/Edit', [
            'monitoring' => $monitoringPelaksanaanLive,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MonitoringPelaksanaanLive $monitoringPelaksanaanLive)
    {
        // Pastikan user hanya bisa update data miliknya
        if ($monitoringPelaksanaanLive->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'tanggal_pelaksanaan' => 'required|date',
            'nama_acara' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'kesiapan_peralatan' => 'required|in:Sangat Siap,Cukup,Kurang Siap',
            'detail_peralatan' => 'required|array|min:1',
            'kondisi_uji_coba' => 'required|in:Ya, Dilakukan dan Berjalan Baik,Ya Dilakukan tetapi terdapat kendala,Tidak Dilakukan',
            'catatan_uji_coba' => 'required_if:kondisi_uji_coba,Ya Dilakukan tetapi terdapat kendala',
            'stabilitas_sinyal' => 'required|integer|min:1|max:5',
            'kualitas_av_ke_mcr' => 'required|integer|min:1|max:5',
            'kendala_teknis' => 'nullable|string',
            'langkah_penanganan' => 'nullable|string',
            'durasi_gangguan' => 'nullable|string',
            'proses_shutdown' => 'required|in:Sesuai prosedur,Ada Kendala minor,Tidak Sesuai prosedur',
            'kondisi_akhir_peralatan' => 'required|in:Baik dan berfungsi normal,Ada Kerusakan ringan,Perlu perbaikan /servis',
            'foto' => 'nullable|image|max:1024',
        ]);

        // Handle update foto
        if ($request->hasFile('foto')) {
            // Hapus foto lama jika ada
            if ($monitoringPelaksanaanLive->foto) {
                Storage::disk('public')->delete($monitoringPelaksanaanLive->foto);
            }
            
            $path = $request->file('foto')->store('monitoring-pelaksanaan-live', 'public');
            $validated['foto'] = $path;
        }

        // Convert detail_peralatan to JSON if it's array
        if (is_array($validated['detail_peralatan'])) {
            $validated['detail_peralatan'] = json_encode($validated['detail_peralatan']);
        }

        $monitoringPelaksanaanLive->update($validated);

        return redirect()->route('monitoring-pelaksanaan-live.my-data')
            ->with('success', 'Data berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MonitoringPelaksanaanLive $monitoringPelaksanaanLive)
    {
        // Pastikan user hanya bisa hapus data miliknya
        if ($monitoringPelaksanaanLive->user_id !== auth()->id()) {
            abort(403);
        }

        // Hapus foto jika ada
        if ($monitoringPelaksanaanLive->foto) {
            Storage::disk('public')->delete($monitoringPelaksanaanLive->foto);
        }

        $monitoringPelaksanaanLive->delete();

        return redirect()->route('monitoring-pelaksanaan-live.my-data')
            ->with('success', 'Data berhasil dihapus!');
    }

    /**
     * Data milik user yang login
     */
    public function myData()
    {
        $data = MonitoringPelaksanaanLive::where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('MonitoringPelaksanaanLive/MyData', [
            'data' => $data,
        ]);
    }

    /**
     * Export CSV
     */
    public function exportCsv(Request $request)
    {
        $query = MonitoringPelaksanaanLive::with('user');

        // Filter berdasarkan tanggal
        if ($request->has('tanggal_dari')) {
            $query->where('tanggal_pelaksanaan', '>=', $request->tanggal_dari);
        }
        if ($request->has('tanggal_sampai')) {
            $query->where('tanggal_pelaksanaan', '<=', $request->tanggal_sampai);
        }

        $data = $query->get();

        $filename = "monitoring_pelaksanaan_live_" . date('Y-m-d') . ".csv";
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function() use ($data) {
            $file = fopen('php://output', 'w');
            
            // Header CSV
            fputcsv($file, [
                'ID', 'Tanggal Pelaksanaan', 'Nama Acara', 'Lokasi', 
                'Pengisi', 'Kesiapan Peralatan', 'Detail Peralatan',
                'Kondisi Uji Coba', 'Catatan Uji Coba', 'Stabilitas Sinyal',
                'Kualitas AV ke MCR', 'Kendala Teknis', 'Langkah Penanganan',
                'Durasi Gangguan', 'Proses Shutdown', 'Kondisi Akhir Peralatan',
                'Dibuat Pada'
            ]);

            // Data rows
            foreach ($data as $row) {
                fputcsv($file, [
                    $row->id,
                    $row->tanggal_pelaksanaan,
                    $row->nama_acara,
                    $row->lokasi,
                    $row->user->name,
                    $row->kesiapan_peralatan,
                    is_array($row->detail_peralatan) ? implode(', ', $row->detail_peralatan) : '',
                    $row->kondisi_uji_coba,
                    $row->catatan_uji_coba ?? '',
                    $row->stabilitas_sinyal,
                    $row->kualitas_av_ke_mcr,
                    $row->kendala_teknis ?? '',
                    $row->langkah_penanganan ?? '',
                    $row->durasi_gangguan ?? '',
                    $row->proses_shutdown,
                    $row->kondisi_akhir_peralatan,
                    $row->created_at,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}