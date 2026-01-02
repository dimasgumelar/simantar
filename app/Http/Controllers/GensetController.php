<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Genset;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\TransmissionService;

class GensetController extends Controller
{

    protected $transmissionService;
   
    
    public function __construct(TransmissionService $transmissionService)
    {
     
        $this->transmissionService = $transmissionService;
       ;
    }

    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function mg_create()
    {

        
        $transmissions = $this->transmissionService->getAll(null, [], [], 100, 'name', 'asc');
        if ($transmissions->isEmpty()) {
            return redirect()->route('transmissions.create')->with('warning', 'Silakan menambah transmisi sebelum menambah data alat.');
        }


        return Inertia::render('MonitoringGenset/Form', [
            'MonitoringGenset' => new Inventory(),
            // 'categories' => $categories,
             'transmissions' => $transmissions,
        ]);
    }

      public function molibbm_create()
    {
        return Inertia::render('MonitoringOliBbm/Form', [
            'MonitoringOliBbm' => new Inventory(),
            // 'categories' => $categories,
            // 'transmissions' => $transmissions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */

        public function mg_store(Request $request)
    {
        // dd($request->jam_mulai);
        $data = $request->validate([
            'id_transmisi' => 'required|exists:transmissions,id',
            'jam_mulai' => 'nullable|date_format:H:i',
            'jam_Akhir' => 'nullable|date_format:H:i',
            'durasi' => 'required|numeric',
            'id_data_genset' => 'nullable',
            'tegangan_rs' => 'nullable|string|max:255',
            'tegangan_st' => 'nullable|string|max:255',
            'tegangan_tr' => 'nullable|string|max:255',
            'tegangan_rn' => 'nullable|string|max:255',
            'tegangan_sn' => 'nullable|string|max:255',
            'tegangan_tn' => 'nullable|string|max:255',
            'tegangan_aki' => 'nullable|string|max:255',
            'beban_genset' => 'required|numeric',
            'kondisi_oli' => 'required|string|max:10',
            'konsumsi_bbm' => 'nullable|numeric',
            'kategori' => 'nullable|string|max:10',

        ]);
            $durasiMenit = $data['durasi'];
            $beban       = $data['beban_genset'];
 
            $faktorKonsumsi = 0.25; // sesuaikan dengan spesifikasi genset

            $konsumsiBBM = ($durasiMenit / 60) * $beban * $faktorKonsumsi;
            $rumusBBM = "({$durasiMenit} / 60) × {$beban} × {$faktorKonsumsi}";


            // rapikan angka
            $konsumsiBBM = round($konsumsiBBM, 2);

           // echo $rumusBBM;
        

        dd($data, $konsumsiBBM, $rumusBBM);
        // $inventory = $this->inventoryService->create($data, $request->file('photo') ?? null);
        // if (!$inventory) {
        //     return redirect()->back()->with('error', 'Gagal menambah data alat.');
        // }

        return redirect()->route('inventories.index')->with('success', 'Berhasil menambah data alat.');
    }



    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Genset $genset)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Genset $genset)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Genset $genset)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Genset $genset)
    {
        //
    }
}
