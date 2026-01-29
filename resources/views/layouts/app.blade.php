<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Oguri Chibi - Desktop Pet')</title>

    <!-- Styles -->
    <link href="{{ asset('assets/desktop-pet/css/desktop-pet.css') }}" rel="stylesheet">

    @stack('styles')
</head>
<body>
    <div id="app">
        @yield('content')
    </div>

    <!-- Scripts -->
    <script>
        // Global config dari Laravel
        window.PetConfig = {
            csrfToken: '{{ csrf_token() }}',
            apiUrl: '{{ url('/api') }}',
            assetUrl: '{{ asset('assets/desktop-pet') }}',
            settings: {
                scale: {{ $config->scale ?? 1.0 }},
                sound_enabled: {{ ($config->sound_enabled ?? true) ? 'true' : 'false' }},
                pumpkin_enabled: {{ ($config->pumpkin_enabled ?? true) ? 'true' : 'false' }},
                struggle_enabled: {{ ($config->struggle_enabled ?? true) ? 'true' : 'false' }}
            }
        };
    </script>

    @stack('scripts')
</body>
</html>
