<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transmission extends Model
{
    use SoftDeletes;

    const DEFAULT_SHIFT_CODES = ['1', '2', '3', 'L'];

    // Roles that operationally manage schedule content (view/edit any transmission's jadwal).
    const SCHEDULE_MANAGER_ROLES = ['admin', 'ketua tim'];

    // Roles that may view every transmission's schedule read-only (sdm needs it to find any
    // transmission to assign its admin transmisi, but still can't edit unless also its admin transmisi).
    const SCHEDULE_LIST_ALL_ROLES = ['admin', 'ketua tim', 'sdm'];

    const DEFAULT_SHIFT_LEGEND = [
        '1' => 'Shift 1',
        '2' => 'Shift 2',
        '3' => 'Shift 3',
        'L' => 'Libur',
    ];

    protected $fillable = [
        'name',
        'address',
        'latitude',
        'longitude',
        'is_active',
        'is_power_out',
        'photo_path',
        'description',
        'transmission_type',
        'koordinator_id',
        'admin_transmisi_id',
        'shift_codes',
    ];

    protected $casts = [
        'shift_codes' => 'array',
    ];

    public function getShiftCodes(): array
    {
        return !empty($this->shift_codes) ? $this->shift_codes : self::DEFAULT_SHIFT_CODES;
    }

    public function getShiftLegend(): ?array
    {
        return empty($this->shift_codes) ? self::DEFAULT_SHIFT_LEGEND : null;
    }

    public function koordinator()
    {
        return $this->belongsTo(User::class, 'koordinator_id');
    }

    public function adminTransmisi()
    {
        return $this->belongsTo(User::class, 'admin_transmisi_id');
    }

    public function logbooks()
    {
        return $this->hasMany(Logbook::class);
    }

    public function dutySchedules()
    {
        return $this->hasMany(DutySchedule::class);
    }

    public function scheduleCanBeEditedBy(User $user): bool
    {
        return $user->hasAnyRole(self::SCHEDULE_MANAGER_ROLES) || $this->admin_transmisi_id === $user->id;
    }

    public function scheduleCanBeViewedBy(User $user): bool
    {
        if ($this->scheduleCanBeEditedBy($user)) {
            return true;
        }

        if ($user->hasAnyRole(self::SCHEDULE_LIST_ALL_ROLES)) {
            return true;
        }

        return $user->transmissions()->where('transmissions.id', $this->id)->exists();
    }
}
