<?php

namespace App\Http\Controllers;

use App\Models\MonitoringLive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MonitoringLiveController extends Controller
{
    /**
     * FORM INPUT
     */
    public function home()
    {
        return Inertia::render('MonitoringLive/Home');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = MonitoringLive::with('user')->latest();

        // Filter berdasarkan tanggal
        if ($request->has('tanggal_dari')) {
            $query->where('tanggal_persiapan', '>=', $request->tanggal_dari);
        }
        if ($request->has('tanggal_sampai')) {
            $query->where('tanggal_persiapan', '<=', $request->tanggal_sampai);
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

        if ($request->has('kondisi_pc')) {
            $query->where('kondisi_pc', $request->kondisi_pc);
        }

        if ($request->has('stl_internet')) {
            $query->where('stl_internet', $request->stl_internet);
        }

        if ($request->has('asal_sumber_listrik')) {
            $query->where('asal_sumber_listrik', $request->asal_sumber_listrik);
        }

        if ($request->has('uji_komunikasi')) {
            $query->where('uji_komunikasi', $request->uji_komunikasi);
        }

        if ($request->has('hasil_uji_tx')) {
            $query->where('hasil_uji_tx', $request->hasil_uji_tx);
        }

        $data = $query->get();

        return Inertia::render('MonitoringLive/List', [
            'data' => $data,
            'filters' => $request->all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('MonitoringLive/Index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validasi
        $validated = $request->validate([
            'tanggal_persiapan' => 'required|date',
            'nama_acara' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'detail_peralatan' => 'required|array|min:1',
            'kondisi_pc' => 'required|in:Normal,Terdapat Kendala',
            'kendala_pc' => 'required_if:kondisi_pc,Terdapat Kendala',
            'stl_internet' => 'required|in:Normal,Terdapat Kendala',
            'kendala_internet' => 'required_if:stl_internet,Terdapat Kendala',
            'kondisi_input_sdi' => 'required|in:Normal,Terdapat Kendala',
            'kendala_sdi' => 'required_if:kondisi_input_sdi,Terdapat Kendala',
            'jumlah_tegangan_listrik' => 'required|integer',
            'koneksi_srt' => 'required|in:Normal,Terdapat Kendala',
            'kendala_srt' => 'required_if:koneksi_srt,Terdapat Kendala',
            'koneksi_rtmp' => 'required|in:Normal,Terdapat Kendala',
            'kendala_rtmp' => 'required_if:koneksi_rtmp,Terdapat Kendala',
            'sinyal_audio_video' => 'required|in:Normal,Terdapat Kendala',
            'kendala_sinyal_av' => 'required_if:sinyal_audio_video,Terdapat Kendala',
            'asal_sumber_listrik' => 'required|in:PLN,Genset',
            'uji_komunikasi' => 'required|in:Sangat Lancar,Cukup Lancar,Kurang Lancar',
            'uji_sinyal_av_ke_studio' => 'required|in:Ya,Tidak',
            'hasil_uji_tx' => 'required|in:Sinyal Stabil dan jernih,Ada noise ringan,Sinyal tidak stabil',
            'monitoring_kualitas_link' => 'required|in:Ya,Tidak',
            'backup_sistem_tx' => 'required|in:Ya,Tidak',
            'catatan_kendala' => 'nullable|string',
            'foto' => 'nullable|image|max:1024', // max 1MB
        ]);

        // Handle upload foto
        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('monitoring-live', 'public');
            $validated['foto'] = $path;
        }

        // Tambahkan user_id
        $validated['user_id'] = auth()->id();

        // Simpan data
        MonitoringLive::create($validated);

        return redirect()->route('monitoring-live.my-data')
            ->with('success', 'Data persiapan siaran live berhasil disimpan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(MonitoringLive $monitoringLive)
    {
        // Tidak digunakan, redirect ke index
        return redirect()->route('monitoring-live.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MonitoringLive $monitoringLive)
    {
        // Pastikan user hanya bisa edit data miliknya
        if ($monitoringLive->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('MonitoringLive/Edit', [
            'monitoring' => $monitoringLive,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MonitoringLive $monitoringLive)
    {
        // Pastikan user hanya bisa update data miliknya
        if ($monitoringLive->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'tanggal_persiapan' => 'required|date',
            'nama_acara' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'detail_peralatan' => 'required|array|min:1',
            'kondisi_pc' => 'required|in:Normal,Terdapat Kendala',
            'kendala_pc' => 'required_if:kondisi_pc,Terdapat Kendala',
            'stl_internet' => 'required|in:Normal,Terdapat Kendala',
            'kendala_internet' => 'required_if:stl_internet,Terdapat Kendala',
            'kondisi_input_sdi' => 'required|in:Normal,Terdapat Kendala',
            'kendala_sdi' => 'required_if:kondisi_input_sdi,Terdapat Kendala',
            'jumlah_tegangan_listrik' => 'required|integer',
            'koneksi_srt' => 'required|in:Normal,Terdapat Kendala',
            'kendala_srt' => 'required_if:koneksi_srt,Terdapat Kendala',
            'koneksi_rtmp' => 'required|in:Normal,Terdapat Kendala',
            'kendala_rtmp' => 'required_if:koneksi_rtmp,Terdapat Kendala',
            'sinyal_audio_video' => 'required|in:Normal,Terdapat Kendala',
            'kendala_sinyal_av' => 'required_if:sinyal_audio_video,Terdapat Kendala',
            'asal_sumber_listrik' => 'required|in:PLN,Genset',
            'uji_komunikasi' => 'required|in:Sangat Lancar,Cukup Lancar,Kurang Lancar',
            'uji_sinyal_av_ke_studio' => 'required|in:Ya,Tidak',
            'hasil_uji_tx' => 'required|in:Sinyal Stabil dan jernih,Ada noise ringan,Sinyal tidak stabil',
            'monitoring_kualitas_link' => 'required|in:Ya,Tidak',
            'backup_sistem_tx' => 'required|in:Ya,Tidak',
            'catatan_kendala' => 'nullable|string',
            'foto' => 'nullable|image|max:1024',
        ]);

        // Handle update foto
        if ($request->hasFile('foto')) {
            // Hapus foto lama jika ada
            if ($monitoringLive->foto) {
                Storage::disk('public')->delete($monitoringLive->foto);
            }
            
            $path = $request->file('foto')->store('monitoring-live', 'public');
            $validated['foto'] = $path;
        }

        $monitoringLive->update($validated);

        return redirect()->route('monitoring-live.my-data')
            ->with('success', 'Data berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MonitoringLive $monitoringLive)
    {
        // Pastikan user hanya bisa hapus data miliknya
        if ($monitoringLive->user_id !== auth()->id()) {
            abort(403);
        }

        // Hapus foto jika ada
        if ($monitoringLive->foto) {
            Storage::disk('public')->delete($monitoringLive->foto);
        }

        $monitoringLive->delete();

        return redirect()->route('monitoring-live.my-data')
            ->with('success', 'Data berhasil dihapus!');
    }

    /**
     * Data milik user yang login
     */
    public function myData()
    {
        $data = MonitoringLive::where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('MonitoringLive/MyData', [
            'data' => $data,
        ]);
    }

    /**
     * Export CSV
     */
    public function exportCsv(Request $request)
    {
        $query = MonitoringLive::with('user');

        // Filter berdasarkan tanggal
        if ($request->has('tanggal_dari')) {
            $query->where('tanggal_persiapan', '>=', $request->tanggal_dari);
        }
        if ($request->has('tanggal_sampai')) {
            $query->where('tanggal_persiapan', '<=', $request->tanggal_sampai);
        }

        // Filter lainnya
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $data = $query->get();

        $filename = "monitoring_live_persiapan_" . date('Y-m-d') . ".csv";
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
                'ID', 'Tanggal Persiapan', 'Nama Acara', 'Lokasi', 
                'Pengisi', 'Detail Peralatan', 'Kondisi PC', 'Kendala PC',
                'STL Internet', 'Kendala Internet', 'Kondisi Input SDI',
                'Kendala SDI', 'Tegangan Listrik (V)', 'Status Tegangan',
                'Koneksi SRT', 'Kendala SRT', 'Koneksi RTMP', 'Kendala RTMP',
                'Sinyal AV', 'Kendala AV', 'Sumber Listrik', 'Uji Komunikasi',
                'Uji Sinyal AV ke Studio', 'Hasil Uji TX', 'Monitoring Kualitas Link',
                'Backup Sistem TX', 'Catatan Kendala', 'Dibuat Pada'
            ]);

            // Data rows
            foreach ($data as $row) {
                fputcsv($file, [
                    $row->id,
                    $row->tanggal_persiapan,
                    $row->nama_acara,
                    $row->lokasi,
                    $row->user->name,
                    is_array($row->detail_peralatan) ? implode(', ', $row->detail_peralatan) : '',
                    $row->kondisi_pc,
                    $row->kendala_pc ?? '',
                    $row->stl_internet,
                    $row->kendala_internet ?? '',
                    $row->kondisi_input_sdi,
                    $row->kendala_sdi ?? '',
                    $row->jumlah_tegangan_listrik,
                    ($row->jumlah_tegangan_listrik >= 198 && $row->jumlah_tegangan_listrik <= 242) ? 'Normal' : 'Tidak Normal',
                    $row->koneksi_srt,
                    $row->kendala_srt ?? '',
                    $row->koneksi_rtmp,
                    $row->kendala_rtmp ?? '',
                    $row->sinyal_audio_video,
                    $row->kendala_sinyal_av ?? '',
                    $row->asal_sumber_listrik,
                    $row->uji_komunikasi,
                    $row->uji_sinyal_av_ke_studio,
                    $row->hasil_uji_tx,
                    $row->monitoring_kualitas_link,
                    $row->backup_sistem_tx,
                    $row->catatan_kendala ?? '',
                    $row->created_at,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}