<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\MaintenanceService;

class WebController extends Controller
{
    protected $maintenanceService;

    public function __construct(MaintenanceService $maintenanceService)
    {
        $this->maintenanceService = $maintenanceService;
    }
    public function dashboard()
    {
        $user = Auth::user();
        $userId = null;
        $createdBy = null;
        if ($user->hasRole(['teknisi'])) {
            $createdBy = $user->id;
        }
        $maintenancesInfo = $this->maintenanceService->info($userId, $createdBy);
        
        if ($user->hasAnyRole(['teknisi', 'operator'])) {
            $createdBy = null;
            $userId = $user->id;
        }
        
        $tasksInfo = $this->maintenanceService->info($userId, $createdBy);
        
        return Inertia::render('Dashboard', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles,
            ],
            "maintenance" => $maintenancesInfo,
            "task" => $tasksInfo,
        ]);
    }
}