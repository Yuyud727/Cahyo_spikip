@extends('layouts.app')

@section('title', 'Desktop Pet - Setup')

@section('content')
<div style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
        <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: bold;">⚙️ Desktop Pet Settings</h1>

        <form action="{{ route('desktop-pet.setup.save') }}" method="POST">
            @csrf

            <!-- Pet Count -->
            <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; font-size: 18px;">Pet Count</h3>

                <label style="display: block; margin-bottom: 10px;">
                    Speaki Count:
                    <input type="number" name="count_speaki" min="0" max="5"
                           value="{{ old('count_speaki', 1) }}"
                           style="width: 60px; padding: 5px; margin-left: 10px;">
                </label>

                <label style="display: block; margin-bottom: 10px;">
                    Erpin Count:
                    <input type="number" name="count_erpin" min="0" max="5"
                           value="{{ old('count_erpin', 1) }}"
                           style="width: 60px; padding: 5px; margin-left: 10px;">
                </label>
            </div>

            <!-- Settings -->
            <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; font-size: 18px;">Settings</h3>

                <label style="display: block; margin-bottom: 10px;">
                    Scale:
                    <input type="number" name="scale" min="0.5" max="2" step="0.1"
                           value="{{ old('scale', $config->scale ?? 1.0) }}"
                           style="width: 80px; padding: 5px; margin-left: 10px;">
                </label>

                <label style="display: block; margin-bottom: 10px;">
                    <input type="checkbox" name="sound_enabled" value="1"
                           {{ old('sound_enabled', $config->sound_enabled ?? true) ? 'checked' : '' }}>
                    Enable Sound
                </label>

                <label style="display: block; margin-bottom: 10px;">
                    <input type="checkbox" name="pumpkin_enabled" value="1"
                           {{ old('pumpkin_enabled', $config->pumpkin_enabled ?? true) ? 'checked' : '' }}>
                    Enable Pumpkin Toy
                </label>

                <label style="display: block; margin-bottom: 10px;">
                    <input type="checkbox" name="struggle_enabled" value="1"
                           {{ old('struggle_enabled', $config->struggle_enabled ?? true) ? 'checked' : '' }}>
                    Enable Struggle Animation
                </label>
            </div>

            <!-- Submit -->
            <div style="display: flex; gap: 10px;">
                <button type="submit" style="flex: 1; padding: 12px; background: #4ECDC4; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">
                    💾 Save & Apply
                </button>

                <a href="{{ route('desktop-pet.index') }}" style="flex: 1; padding: 12px; background: #95E1D3; color: white; border: none; border-radius: 8px; text-align: center; text-decoration: none; font-weight: bold; font-size: 16px; display: block;">
                    ← Back
                </a>
            </div>
        </form>
    </div>
</div>
@endsection
