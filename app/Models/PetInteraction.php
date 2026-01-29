<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PetInteraction extends Model
{
    use HasFactory;

    protected $fillable = [
        'pet_id',
        'interaction_type',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
    ];

    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }

    // Log interaction
    public static function log($petId, $type, $data = [])
    {
        return static::create([
            'pet_id' => $petId,
            'interaction_type' => $type,
            'data' => $data,
        ]);
    }
}
