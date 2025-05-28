<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $table = 'vehicles';
    protected $fillable = [
        'user_id', 'license_plate', 'type', 'brand', 'color', 'is_stolen'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    
}
