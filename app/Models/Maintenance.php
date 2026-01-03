<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Maintenance extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'transmission_id',
        'inventory_id',
        'user_id',
        'status',
        'description',
        'feedback',
        'inprogress_at',
        'completed_at',
        'scheduled_at',
        'schedule_response',
        'created_by',
    ];
    public function inventory()
    {
        return $this->belongsTo(Inventory::class);
    }

    public function transmission()
    {
        return $this->belongsTo(Transmission::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }    
    public function created_by_user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function status_histories()
    {
        return $this->hasMany(MaintenanceStatusHistory::class);
    }

    public function latest_status()
    {
        return $this->hasOne(MaintenanceStatusHistory::class)->latestOfMany();
    }
}