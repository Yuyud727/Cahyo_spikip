<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PetConfig extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'scale',
        'sound_enabled',
        'pumpkin_enabled',
        'struggle_enabled',
        'settings',
    ];

    protected $casts = [
        'scale' => 'float',
        'sound_enabled' => 'boolean',
        'pumpkin_enabled' => 'boolean',
        'struggle_enabled' => 'boolean',
        'settings' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Get or create config for user
    public static function getOrCreateForUser($userId = null)
    {
        return static::firstOrCreate(
            ['user_id' => $userId],
            [
                'scale' => 1.0,
                'sound_enabled' => true,
                'pumpkin_enabled' => true,
                'struggle_enabled' => true,
            ]
        );
    }
}
