<?php

namespace App\Http\Controllers;

use App\Models\Maintenance;
use App\Services\InventoryService;
use App\Services\TransmissionService;
use App\Services\MaintenanceService;
use App\Services\UserService;
use App\Services\UserTransmissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Services\ExportService;

class MaintenancePeralatanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = null;
        if (!Auth::user()->hasAnyRole(['admin', 'ketua tim'])) {
            $userId = Auth::user()->id;
        }

        //$maintenances = $this->maintenanceService->getAll($search, $perPage, $sortField, $sortDirection, null, $userId);
        $notif = "haloo";

        return Inertia::render('TransmissionMaintenances/Index', compact('notif'));
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
