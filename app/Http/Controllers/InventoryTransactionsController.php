<?php

namespace App\Http\Controllers;

use App\Models\InventoryTransactions;
use App\Services\InventoryService;
use App\Services\ExportService;
use App\Services\InventoryTransactionsService;
use App\Services\TransmissionService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryTransactionsController extends Controller
{
    protected $inventoryTransactionsService;
    protected $categoryService;
    protected $transmissionService;
    protected $exportService;
    protected $userService;
    protected $inventoryService;
    
    public function __construct(InventoryTransactionsService $inventoryTransactionsService, ExportService $exportService, TransmissionService $transmissionService, UserService $userService, InventoryService $inventoryService)
    {
        $this->inventoryTransactionsService = $inventoryTransactionsService;
        $this->exportService = $exportService;
        $this->transmissionService = $transmissionService;
        $this->userService = $userService;
        $this->inventoryService = $inventoryService;
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
        $sortDirection = $request->input('direction', 'asc');

        $inventoryTransactions = $this->inventoryTransactionsService->getAll($search, $perPage, $sortField, $sortDirection);

        return Inertia::render('InventoryTransactions/Index', compact('inventoryTransactions'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $transmissions = $this->transmissionService->getAll(null, [], [], 100, 'name', 'asc');
        $users = $this->userService->getAll( $request->borrower, null, 20, "id", "asc");
        $pics = $this->userService->getAll( $request->receiver, null, 20, "id", "asc");
        $inventories = $this->inventoryService->getAll(null, $request->inventory, 20, "id", "asc");
        
        return Inertia::render('InventoryTransactions/Form', [
            'statuses' => config('constants.inventory_transactions_status'),
            'transmissions' => $transmissions,
            'users' => $users,
            'pics' => $pics,
            'inventories' => $inventories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|numeric|min:0|max:1',
            'status' => 'required|numeric|min:1|max:6',
            'inventory_id' => 'required|exists:inventories,id',
            'user_id' => 'required|exists:users,id',
            'pic_id' => 'required|exists:users,id',
            'description' => 'nullable|string|max:1000',
            'photo' => 'nullable|image|max:2048',
        ]);
        
        if ($data["status"] == 2 || $data["status"] == 6) {
            $data_2 = $request->validate([
                'transmission_id' => 'required|exists:transmissions,id',
            ]);

            $data["transmission_id"] = $data_2["transmission_id"];
        }

        $inventoryTransaction = $this->inventoryTransactionsService->create($data, $request->file('photo') ?? null);
        if (!$inventoryTransaction) {
            return redirect()->back()->with('error', 'Gagal menambah data transaksi alat.');
        }

        return redirect()->route('inventoryTransactions.index')->with('success', 'Berhasil menambah data transaksi alat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(InventoryTransactions $inventoryTransactions)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InventoryTransactions $inventoryTransactions)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InventoryTransactions $inventoryTransactions)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InventoryTransactions $inventoryTransactions)
    {
        //
    }
}