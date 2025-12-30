<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InventoryTransactions extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $fillable = [
        'user_id',
        'pic_id',
        'inventory_id',
        'photo_path',
        'status',
        'description',
        'transmission_id',
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function pic()
    {
        return $this->belongsTo(User::class, 'pic_id');
    }

    public function inventory()
    {
        return $this->belongsTo(Inventory::class);
    }
    
    public function transmission()
    {
        return $this->belongsTo(Transmission::class);
    }
}