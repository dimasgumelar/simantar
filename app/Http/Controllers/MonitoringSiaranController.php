<?php

namespace App\Http\Controllers;

use App\Models\MonitoringSiaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MonitoringSiaranController extends Controller
{
    /**
     * FORM INPUT
     */
    public function home()
    {
        return Inertia::render('MonitoringSiaran/Home');
    }

    /**
     * FORM INPUT
     */
    public function create()
    {
        return Inertia::render('MonitoringSiaran/Index');
    }

    /**
     * LIST + FILTER
     */
    public function index(Request $request)
    {
        $query = MonitoringSiaran::with('user');

        // Filter hasil
        if ($request->filled('hasil')) {
            $query->where('hasil', $request->hasil);
        }

        // Filter tanggal
        if ($request->filled('tanggal_dari')) {
            $query->whereDate('created_at', '>=', $request->tanggal_dari);
        }

        if ($request->filled('tanggal_sampai')) {
            $query->whereDate('created_at', '<=', $request->tanggal_sampai);
        }

        // Filter user_id (nama pengisi)
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter stasiun transmisi
        if ($request->filled('id_transmisi')) {
            $query->where('id_transmisi', $request->id_transmisi);
        }

        // Filter konten siaran
        if ($request->filled('id_konten')) {
            $query->where('id_konten', $request->id_konten);
        }

        // Filter sumber input
        if ($request->filled('sumber_input')) {
            $query->where('sumber_input', $request->sumber_input);
        }

        // Filter kategori
        if ($request->filled('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        // Filter jam mulai
        if ($request->filled('jam_mulai')) {
            $query->where('jam_mulai', $request->jam_mulai);
        }

        return Inertia::render('MonitoringSiaran/List', [
            'data' => $query->latest()->get(),
            'filters' => $request->only([
                'hasil', 
                'tanggal_dari', 
                'tanggal_sampai',
                'user_id',
                'id_transmisi',
                'id_konten',
                'sumber_input',
                'kategori',
                'jam_mulai'
            ]),
            'authUserId' => auth()->id(),
        ]);
    }

    /**
     * SIMPAN
     */
    public function store(Request $request)
    {
        MonitoringSiaran::create([
            'user_id' => auth()->id(),
            'id_transmisi' => $request->id_transmisi,
            'id_konten' => $request->id_konten,
            'sumber_input' => $request->sumber_input,
            'nama_acara' => $request->nama_acara,
            'kategori' => $request->kategori,
            'jam_mulai' => $request->jam_mulai,
            'hasil' => $request->hasil,
            'jenis_gangguan' => $request->jenis_gangguan,
            'penyebab_gangguan' => $request->penyebab_gangguan,
            'penanganan_gangguan' => $request->penanganan_gangguan,
        ]);

        return redirect()->route('monitoring-siaran.create');
    }

    /**
     * DATA SAYA
     */
    public function myData()
    {
        return Inertia::render('MonitoringSiaran/MyData', [
            'data' => MonitoringSiaran::where('user_id', auth()->id())
                ->latest()
                ->get()
        ]);
    }

    /**
     * FORM EDIT (HANYA DATA SENDIRI)
     */
    public function edit(MonitoringSiaran $monitoringSiaran)
    {
        abort_if($monitoringSiaran->user_id !== auth()->id(), 403);

        return Inertia::render('MonitoringSiaran/Edit', [
            'data' => $monitoringSiaran
        ]);
    }

    /**
     * UPDATE
     */
    public function update(Request $request, MonitoringSiaran $monitoringSiaran)
    {
        abort_if($monitoringSiaran->user_id !== auth()->id(), 403);

        $monitoringSiaran->update($request->all());

        return redirect()->route('monitoring-siaran.my-data');
    }

    /**
     * DELETE
     */
    public function destroy(MonitoringSiaran $monitoringSiaran)
    {
        abort_if($monitoringSiaran->user_id !== auth()->id(), 403);

        $monitoringSiaran->delete();

        return back();
    }

    /**
     * EXPORT CSV
     */
    public function exportCsv(): StreamedResponse
    {
        return response()->streamDownload(function () {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Tanggal', 'Pengisi', 'Acara', 'Hasil']);

            MonitoringSiaran::with('user')->latest()->each(function ($row) use ($handle) {
                fputcsv($handle, [
                    $row->created_at->format('Y-m-d'),
                    $row->user->name,
                    $row->nama_acara,
                    $row->hasil
                ]);
            });

            fclose($handle);
        }, 'monitoring_siaran.csv');
    }

    /**
     * EXPORT PDF
     */
    public function exportPdf()
    {
        $data = MonitoringSiaran::with('user')->latest()->get();

        return Pdf::loadView('pdf.monitoring-siaran', compact('data'))
            ->download('monitoring_siaran.pdf');
    }
}