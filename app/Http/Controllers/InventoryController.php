<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Services\CategoryService;
use App\Services\ExportService;
use App\Services\InventoryService;
use App\Services\TransmissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class InventoryController extends Controller
{
    protected $inventoryService;
    protected $categoryService;
    protected $transmissionService;
    protected $exportService;
    
    public function __construct(InventoryService $inventoryService, CategoryService $categoryService, TransmissionService $transmissionService, ExportService $exportService)
    {
        $this->inventoryService = $inventoryService;
        $this->categoryService = $categoryService;
        $this->transmissionService = $transmissionService;
        $this->exportService = $exportService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $transmissionIds = null;
        $user = Auth::user();
        if ($user->hasRole(['operator'])) {
            $transmissionIds = $user->transmissions()->pluck('transmissions.id')->toArray();
        }

        // Ambil input filter
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        // Ambil input sorting
        $sortField = $request->input('sort', 'id');
        $sortDirection = $request->input('direction', 'asc');

        $inventories = $this->inventoryService->getAll($transmissionIds, $search, $perPage, $sortField, $sortDirection);

        return Inertia::render('Inventories/Index', compact('inventories'));
    }

    public function export(Request $request)
    {
        // Ambil input filter
        $search = $request->input('search');
        $perPage = 0;

        // Ambil input sorting
        $sortField = $request->input('sort', 'id');
        $sortDirection = $request->input('direction', 'asc');

        $inventories = $this->inventoryService->getAll(null, $search, $perPage, $sortField, $sortDirection);

        $fileName = 'inventories_' . now('Asia/Jakarta')->format('Ymd_His') . '.csv';
        $callback = function () use ($inventories) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Kode Alat', 'Nama', 'Merk', 'Transmisi', 'Deskripsi', 'Tanggal Diterima', 'Kondisi', 'Foto', 'Tanggal Ditambahkan', 'Tanggal Diperbarui']);

            foreach ($inventories as $inventory) {
                $condition = "";
                switch ($inventory->condition) {
                    case 1:
                        $condition = "Baik";
                        break;
                    case 2:
                        $condition = "Cukup";
                        break;
                    case 3:
                        $condition = "Buruk";
                        break;
                    default:
                        break;
                }
                fputcsv($handle, [
                    $inventory->id,
                    $inventory->inventory_code,
                    $inventory->name,
                    $inventory->brand,
                    $inventory->transmission->name,
                    $inventory->description,
                    $inventory->received_at,
                    $condition,
                    config('app.url')."/storage/".$inventory->photo_path,
                    $inventory->created_at,
                    $inventory->updated_at,
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
        // Ambil semua kategori untuk dropdown
        // $categories = $this->categoryService->getAll(null, 100, 'name', 'asc');
        // if ($categories->isEmpty()) {
        //     return redirect()->route('categories.create')->with('warning', 'Please create a category before adding an inventory.');
        // }

        $transmissions = $this->transmissionService->getAll(null, [], [], 100, 'name', 'asc');
        if ($transmissions->isEmpty()) {
            return redirect()->route('transmissions.create')->with('warning', 'Silakan menambah transmisi sebelum menambah data alat.');
        }

        return Inertia::render('Inventories/Form', [
            'inventory' => new Inventory(),
            // 'categories' => $categories,
            'transmissions' => $transmissions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            // 'category_id' => 'required|exists:categories,id',
            'transmission_id' => 'required|exists:transmissions,id',
            'photo' => 'nullable|image|max:2048',
            'received_at' => 'nullable|date',
            'condition' => 'required|numeric|min:1|max:3',
        ]);

        $inventory = $this->inventoryService->create($data, $request->file('photo') ?? null);
        if (!$inventory) {
            return redirect()->back()->with('error', 'Gagal menambah data alat.');
        }

        return redirect()->route('inventories.index')->with('success', 'Berhasil menambah data alat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Inventory $inventory)
    {
        return Inertia::render('Inventories/Show', [
            'inventory' => $inventory,
            'transmission' => $inventory->transmission,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Inventory $inventory)
    {
        return Inertia::render('Inventories/Form', [
            'inventory' => $inventory,
            'isEdit' => true,
            'categories' => $this->categoryService->getAll(null, 100, 'name', 'asc'),
            'transmissions' => $this->transmissionService->getAll(null, [], [], 100, 'name', 'asc'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Inventory $inventory)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            // 'category_id' => 'required|exists:categories,id',
            'transmission_id' => 'required|exists:transmissions,id',
            'photo' => 'nullable|image|max:2048',
            'photo_path' => 'nullable|string',
            'received_at' => 'nullable|date',
            'condition' => 'required|numeric|min:1|max:3',
        ]);

        $inventoryUpdated = $this->inventoryService->update($inventory, $data, $request->file('photo') ?? null);
        if (!$inventoryUpdated) {
            return redirect()->back()->with('error', 'Gagal mengubah data alat.');
        }

        return redirect()->route('inventories.index')->with('success', 'Berhasil mengubah data alat.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Inventory $inventory)
    {
        $deleted = $this->inventoryService->delete($inventory);
        if (!$deleted) {
            return redirect()->back()->with('error', 'Gagal menghapus data alat.');
        }

        return redirect()->route('inventories.index')->with('success', 'Berhasil menghapus data alat.');
    }
}