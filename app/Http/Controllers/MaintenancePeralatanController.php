<?php

namespace App\Http\Controllers;

use App\Models\Maintenance;
use App\Services\InventoryService;
use App\Services\TransmissionService;
use App\Services\MaintenanceService;
use App\Services\UserService;
use App\Services\UserTransmissionService;
use App\Repositories\UserTransmissionRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Services\ExportService;

class MaintenancePeralatanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $userTransmissionService;

    public function __construct(userTransmissionService $userTransmissionService)
    {
        $this->userTransmissionService = $userTransmissionService;
    }

    public function index(Request $request)
    {
        $userId = Auth::user()->id;
        $userName = Auth::user()->name;
        //dd($this->userTransmissionService->getById(12));
        // $userTransmissions = $this->userTransmissionService->getById(12);
        $sortField = $request->sort;
        $sortDirection = $request->direction;
        $userTransmissions = $this->userTransmissionService->getAllByUserId($userId, 10, $sortField, $sortDirection);
        //dd($userTransmissions);
        //$userTransmissions = "Oro-oro Ombo";
        return Inertia::render('TransmissionMaintenances/Index', compact('userName', 'userTransmissions'));
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(MaintenancePeralatan $maintenancePeralatan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MaintenancePeralatan $maintenancePeralatan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MaintenancePeralatan $maintenancePeralatan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MaintenancePeralatan $maintenancePeralatan)
    {
        //
    }
}
