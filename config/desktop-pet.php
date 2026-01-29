<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Desktop Pet Configuration
    |--------------------------------------------------------------------------
    */

    'default_settings' => [
        'scale' => 1.0,
        'sound_enabled' => true,
        'pumpkin_enabled' => true,
        'struggle_enabled' => true,
    ],

    'physics' => [
        'gravity' => 0.8,
        'friction' => 0.95,
        'bounce' => 0.6,
    ],

    'pet_types' => [
        'speaki' => [
            'walk_speed' => 2.0,
            'run_speed' => 5.0,
            'jump_force' => 15.0,
        ],
        'erpin' => [
            'walk_speed' => 1.5,
            'run_speed' => 4.0,
            'jump_force' => 12.0,
        ],
    ],

    'limits' => [
        'max_pets_per_user' => 10,
        'max_speaki' => 5,
        'max_erpin' => 5,
    ],
];
