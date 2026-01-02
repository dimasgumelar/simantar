<?php

namespace App\Http\Controllers;

use App\Models\MonitoringPeralatan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MonitoringPeralatanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $monitorings = MonitoringPeralatan::orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Monitorings/Index', [
            'monitorings' => $monitorings,
        ]);
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
    public function show(MonitoringPeralatan $monitoringPeralatan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MonitoringPeralatan $monitoringPeralatan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MonitoringPeralatan $monitoringPeralatan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MonitoringPeralatan $monitoringPeralatan)
    {
        //
    }
}
