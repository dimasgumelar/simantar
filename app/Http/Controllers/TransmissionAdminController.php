<?php

namespace App\Http\Controllers;

use App\Models\Transmission;
use App\Services\TransmissionService;
use App\Services\UserTransmissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransmissionAdminController extends Controller
{
    protected $transmissionService;
    protected $userTransmissionService;

    public function __construct(TransmissionService $transmissionService, UserTransmissionService $userTransmissionService)
    {
        $this->transmissionService = $transmissionService;
        $this->userTransmissionService = $userTransmissionService;
    }

    public function edit(Transmission $transmission)
    {
        return Inertia::render('Schedules/TransmissionAdmins/Form', [
            'transmission' => $transmission,
            'linkedUsers' => $this->userTransmissionService->getAllByTransmissionId($transmission->id, 0, 'name', 'ASC'),
            'defaultShiftCodes' => Transmission::DEFAULT_SHIFT_CODES,
        ]);
    }

    public function update(Request $request, Transmission $transmission)
    {
        $request->merge(['admin_transmisi_id' => $request->admin_transmisi_id ?: null]);

        $data = $request->validate([
            'admin_transmisi_id' => 'nullable|exists:users,id',
            'shift_codes_text' => 'nullable|string',
        ]);

        $shiftCodes = collect(preg_split('/\r\n|\r|\n/', $data['shift_codes_text'] ?? ''))
            ->map(fn ($code) => trim($code))
            ->filter()
            ->values()
            ->all();

        $this->transmissionService->updateScheduleSettings($transmission, $data['admin_transmisi_id'], $shiftCodes ?: null);

        return redirect()->route('schedules.index')->with('success', 'Berhasil mengubah pengaturan transmisi.');
    }
}
