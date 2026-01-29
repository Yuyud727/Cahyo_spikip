<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Pet extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'name',
        'level',
        'happiness',
        'position',
        'stats',
        'is_active',
    ];

    protected $casts = [
        'position' => 'array',
        'stats' => 'array',
        'is_active' => 'boolean',
    ];

    // Default values
    protected $attributes = [
        'level' => 1,
        'happiness' => 100,
        'is_active' => true,
    ];

    /**
     * Accessor untuk position dengan default value
     */
    protected function position(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => json_decode($value, true) ?? ['x' => 100, 'y' => 100],
            set: fn ($value) => json_encode($value)
        );
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function interactions()
    {
        return $this->hasMany(PetInteraction::class);
    }

    /**
     * Update position
     */
    public function updatePosition($x, $y)
    {
        $this->update([
            'position' => ['x' => $x, 'y' => $y]
        ]);
    }

    /**
     * Increase happiness
     */
    public function increaseHappiness($amount = 10)
    {
        $this->happiness = min(100, $this->happiness + $amount);
        $this->save();
    }

    /**
     * Decrease happiness
     */
    public function decreaseHappiness($amount = 5)
    {
        $this->happiness = max(0, $this->happiness - $amount);
        $this->save();
    }

    /**
     * Scope for active pets
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for specific type
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }
}
