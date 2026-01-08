<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Genset;
use App\Models\LogBbmOli;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\TransmissionService;
use App\Services\MasterGensetService;
use Illuminate\Support\Facades\Auth;
use App\Repositories\FileRepository;

class GensetController extends Controller
{

    protected $transmissionService;
    protected $mastergensetService;
    protected $fileRepo;
   
    
    public function __construct(TransmissionService $transmissionService, MasterGensetService $mastergensetService, FileRepository $fileRepo)
    {
     
       $this->transmissionService = $transmissionService;
       $this->mastergensetService = $mastergensetService;
       $this->fileRepo = $fileRepo;
    }

    

    public function index()
    {
        
    }

    /**
     * Show the form for creating a new resource.
     */
    
    public function mg_create()
    {
        $transmissions = null;
        $transmissionIds = null;
        $user = Auth::user();
        if ($user->hasRole(['operator'])) {
            $transmissions["data"] = $user->transmissions;
            $transmissionIds = $user->transmissions()->pluck('transmissions.id')->toArray();
            $mastergenset = $this->mastergensetService->getAll($transmissionIds, null, null, null, null);
        } else {
            $transmissions = $this->transmissionService->getAll(null, [], [], 100, 'name', 'asc');
            if ($transmissions->isEmpty()) {
                return redirect()->route('transmissions.create')->with('warning', 'Silakan menambah transmisi sebelum menambah data alat.');
            }
            $mastergenset = $this->mastergensetService->getAll(null, null, null, null, null);
        }
        
        return Inertia::render('MonitoringGenset/Form', [
            'MonitoringGenset' => new Inventory(),
            'mastergenset' => $mastergenset->groupBy('id_transmisi'),
             'transmissions' => $transmissions,
        ]);
    }

      public function molibbm_create()
    {

        $transmissions = null;
        $transmissionIds = null;
        $user = Auth::user();
        if ($user->hasRole(['operator'])) {
            $transmissions["data"] = $user->transmissions;
            $transmissionIds = $user->transmissions()->pluck('transmissions.id')->toArray();
            $mastergenset = $this->mastergensetService->getAll($transmissionIds, null, null, null, null);
        } else {
            $transmissions = $this->transmissionService->getAll(null, [], [], 100, 'name', 'asc');
            if ($transmissions->isEmpty()) {
                return redirect()->route('transmissions.create')->with('warning', 'Silakan menambah transmisi sebelum menambah data alat.');
            }
            $mastergenset = $this->mastergensetService->getAll(null, null, null, null, null);
        }
        return Inertia::render('MonitoringOliBbm/Form', [
            'MonitoringOliBbm' => new Inventory(),
            'mastergenset' => $mastergenset->groupBy('id_transmisi'),
             'transmissions' => $transmissions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */

        public function mg_store(Request $request)
    {
        // dd($request->jam_mulai);
        $data = $request->validate([
            //'user_id' => 'nullable|numeric',
            'tanggal' => 'nullable',
            'id_transmisi' => 'required|exists:transmissions,id',
            'jam_mulai' => 'nullable|date_format:H:i',
            'jam_akhir' => 'nullable|date_format:H:i',
            'durasi' => 'required|numeric',
            'id_data_genset' => 'required',
            'tegangan_rs' => 'nullable|string|max:255',
            'tegangan_st' => 'nullable|string|max:255',
            'tegangan_tr' => 'nullable|string|max:255',
            'tegangan_rn' => 'nullable|string|max:255',
            'tegangan_sn' => 'nullable|string|max:255',
            'tegangan_tn' => 'nullable|string|max:255',
            'tegangan_aki' => 'nullable|string|max:255',
            'beban_genset' => 'required|numeric',
            'kondisi_oli' => 'required|string|max:10',
            'link_foto' => 'nullable|string|max:10',
            'foto' => 'nullable|image|max:2048',
            'konsumsi_bbm' => 'nullable|numeric',
            'kategori' => 'required|string|max:10',

        ]);
            $photo = $request->file('foto');
            $data['link_foto'] = $this->fileRepo->store($photo, "MonitoringGenset");
            $data['user_id']=Auth::user()->id;
            $mastergenset = $this->mastergensetService->getById($data['id_data_genset']);
            //dd($mastergenset->kapasitas_daya_kva);
            $durasiMenit = $data['durasi'];
            $beban       = $data['beban_genset'];

            $kapasitasGenset = $mastergenset->kapasitas_daya_kva;

            // hitung persentase beban
            $persentaseBeban = ($beban / $kapasitasGenset) * 100;
           // $rumuspersentaseBeban = "($beban / $kapasitasGenset) x 100";

            // tentukan faktor konsumsi
            if ($persentaseBeban <=10) {
                $faktorKonsumsi = 0.33;
            } elseif ($persentaseBeban <= 20) {
                $faktorKonsumsi = 0.30;
            } elseif ($persentaseBeban <= 30) {
                $faktorKonsumsi = 0.28;
            } elseif ($persentaseBeban <= 40) {
                $faktorKonsumsi = 0.27;
            } elseif ($persentaseBeban <= 50) {
                $faktorKonsumsi = 0.26;
            } elseif ($persentaseBeban <= 60) {
                $faktorKonsumsi = 0.25;
            } elseif ($persentaseBeban <= 75) {
                $faktorKonsumsi = 0.25;
            } else {
                $faktorKonsumsi = 0.27;
            }


            $konsumsiBBM = ($durasiMenit / 60) * $beban * $faktorKonsumsi;
         // $rumusBBM = "({$durasiMenit} / 60) × {$beban} × {$faktorKonsumsi}";


            // rapikan angka
            $konsumsiBBM = round($konsumsiBBM, 2);
            $data['konsumsi_bbm'] = $konsumsiBBM;
           // dd($data);

           // echo $rumusBBM;
            Genset::create($data);
        

       // dd($data, $konsumsiBBM, $rumusBBM);
        // $inventory = $this->inventoryService->create($data, $request->file('photo') ?? null);
        // if (!$inventory) {
        //     return redirect()->back()->with('error', 'Gagal menambah data alat.');
        // }

        return redirect()->route('mg.create')->with('success', 'Berhasil Menambah Data Monitoring Genset');
    }
    
    
        public function molibbm_store(Request $request)
    {
        // dd($request->jam_mulai);
        $data = $request->validate([
            'kategori' => 'nullable|string|max:10',
           // 'user_id' => 'nullable|numeric',
            'id_transmisi' => 'required|exists:transmissions,id',
            'id_data_genset' => 'required',
            'tanggal' => 'nullable',
            'total_solar_oli' => 'required|numeric',
            'keterangan' => 'nullable|string|max:255',

        ]);
        $data['user_id']=Auth::user()->id;
            
           
        

       //dd($data);
        LogBbmOli::create($data);
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
