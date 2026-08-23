<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WebController extends Controller
{
    protected $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function dashboard(Request $request)
    {
        $user = $request->user();

        $transmissionIds = $request->input('transmissions', []);
        $to = $request->input('to') ?: now()->format('Y-m-d');
        $from = $request->input('from') ?: now()->subDays(29)->format('Y-m-d');

        $transmissions = $this->dashboardService->getAccessibleTransmissions($user);
        $charts = $this->dashboardService->getStats($user, $transmissionIds, $from, $to);

        return Inertia::render('Dashboard', [
            'transmissions' => $transmissions,
            'filters' => [
                'transmissions' => $transmissionIds,
                'from' => $from,
                'to' => $to,
            ],
            'charts' => $charts,
        ]);
    }
}
