@extends('layouts.app')

@section('title', 'Desktop Pet - Play')

@section('content')
<div id="pet-container" style="position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <!-- Pets akan di-spawn di sini -->
</div>

<!-- Controls Panel -->
<div id="controls-panel" style="position: fixed; top: 20px; right: 20px; background: rgba(255,255,255,0.95); padding: 20px; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); z-index: 1000; max-width: 200px;">
    <h3 style="margin: 0 0 15px 0; font-size: 18px; text-align: center;">🎮 Controls</h3>

    <!-- Pet Spawning -->
    <div style="margin-bottom: 10px;">
        <p style="margin: 0 0 5px 0; font-size: 12px; font-weight: bold; color: #666;">Spawn Pets</p>
        <button onclick="spawnPet('speaki')" style="display: block; width: 100%; padding: 10px; margin: 5px 0; background: #FF6B6B; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;">
            🐱 Add Speaki
        </button>
        <button onclick="spawnPet('erpin')" style="display: block; width: 100%; padding: 10px; margin: 5px 0; background: #4ECDC4; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;">
            🐰 Add Erpin
        </button>
    </div>

    <hr style="margin: 10px 0; border: none; border-top: 1px solid #ddd;">

    <!-- Toys -->
    <div style="margin-bottom: 10px;">
        <p style="margin: 0 0 5px 0; font-size: 12px; font-weight: bold; color: #666;">Toys</p>
        <button onclick="spawnPumpkin()" style="display: block; width: 100%; padding: 10px; margin: 5px 0; background: #FFA500; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;">
            🎃 Add Pumpkin
        </button>
    </div>

    <hr style="margin: 10px 0; border: none; border-top: 1px solid #ddd;">

    <!-- Settings -->
    <div style="margin-bottom: 10px;">
        <p style="margin: 0 0 5px 0; font-size: 12px; font-weight: bold; color: #666;">Settings</p>
        <button onclick="togglePhysics()" style="display: block; width: 100%; padding: 10px; margin: 5px 0; background: #95E1D3; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;">
            ⚡ Toggle Physics
        </button>
    </div>

    <hr style="margin: 10px 0; border: none; border-top: 1px solid #ddd;">

    <!-- Clear Actions -->
    <div style="margin-bottom: 10px;">
        <p style="margin: 0 0 5px 0; font-size: 12px; font-weight: bold; color: #666;">Clear</p>
        <button onclick="clearAllPets()" style="display: block; width: 100%; padding: 10px; margin: 5px 0; background: #F38181; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;">
            🗑️ Clear Pets
        </button>
        <button onclick="clearAllToys()" style="display: block; width: 100%; padding: 10px; margin: 5px 0; background: #AA96DA; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;">
            🧹 Clear Toys
        </button>
    </div>

    <hr style="margin: 10px 0; border: none; border-top: 1px solid #ddd;">

    <!-- Navigation -->
    <a href="{{ route('desktop-pet.setup') }}" style="display: block; width: 100%; padding: 10px; margin: 5px 0; background: #6C5CE7; color: white; border: none; border-radius: 8px; text-align: center; text-decoration: none; font-weight: bold; font-size: 14px;">
        ⚙️ Setup
    </a>

    <!-- Stats -->
    <div id="stats-panel" style="margin-top: 15px; padding: 10px; background: rgba(0,0,0,0.05); border-radius: 8px; font-size: 11px;">
        <p style="margin: 2px 0;"><strong>Pets:</strong> <span id="pet-count">0</span></p>
        <p style="margin: 2px 0;"><strong>Toys:</strong> <span id="toy-count">0</span></p>
        <p style="margin: 2px 0;"><strong>Physics:</strong> <span id="physics-status">ON</span></p>
    </div>
</div>
@endsection

@push('scripts')
<!-- IMPORTANT: Load scripts in correct order -->
<!-- 1. Core Dependencies -->
<script src="{{ asset('assets/desktop-pet/js/systems/state-machine.js') }}"></script>
<script src="{{ asset('assets/desktop-pet/js/core/entity.js') }}"></script>
<script src="{{ asset('assets/desktop-pet/js/utils/api-client.js') }}"></script>

<!-- 2. Characters (depends on Entity & StateMachine) -->
<script src="{{ asset('assets/desktop-pet/js/characters/base-pet.js') }}"></script>
<script src="{{ asset('assets/desktop-pet/js/characters/speaki.js') }}"></script>
<script src="{{ asset('assets/desktop-pet/js/characters/erpin.js') }}"></script>
<script src="{{ asset('assets/desktop-pet/js/characters/pumpkin-toy.js') }}"></script>

<!-- 3. Engine (depends on everything) -->
<script src="{{ asset('assets/desktop-pet/js/core/engine.js') }}"></script>

<script>
    let engine;
    let physicsEnabled = true;

    // Initialize engine saat halaman load
    window.addEventListener('load', async function() {
        console.log('🎮 Initializing Desktop Pet...');

        engine = new PetEngine();
        window.engine = engine; // Make global for pumpkin interaction
        engine.init();

        // Load pets dari database
        await loadPetsFromDatabase();

        // Update stats
        updateStats();

        console.log('✅ Desktop Pet Ready!');
    });

    // Load pets dari API
    async function loadPetsFromDatabase() {
        try {
            console.log('📡 Loading pets from database...');
            const pets = await PetAPI.getPets();

            console.log(`Found ${pets.length} pets in database`);

            pets.forEach(petData => {
                const pet = createPetInstance(
                    petData.type,
                    petData.position?.x || 100,
                    petData.position?.y || 100
                );
                pet.id = petData.id;
                engine.addPet(pet);
            });

            updateStats();
        } catch (error) {
            console.error('Failed to load pets:', error);
            showNotification('Failed to load pets from database', 'error');
        }
    }

    // Spawn pet baru
    async function spawnPet(type) {
        try {
            console.log(`🐾 Spawning new ${type}...`);

            const response = await PetAPI.createPet(type, {
                x: Math.random() * (window.innerWidth - 200) + 100,
                y: 100
            });

            const pet = createPetInstance(
                type,
                response.pet.position.x,
                response.pet.position.y
            );
            pet.id = response.pet.id;
            engine.addPet(pet);

            updateStats();
            showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} spawned!`, 'success');

            console.log(`✅ ${type} spawned successfully`);
        } catch (error) {
            console.error('Failed to spawn pet:', error);
            showNotification(`Failed to spawn ${type}`, 'error');
        }
    }

    // Spawn pumpkin toy
    function spawnPumpkin() {
        // Check if pumpkin enabled in settings
        if (!window.PetConfig.settings.pumpkin_enabled) {
            showNotification('Pumpkin toy is disabled in settings!', 'warning');
            return;
        }

        console.log('🎃 Spawning pumpkin toy...');

        try {
            // Random position
            const x = Math.random() * (window.innerWidth - 200) + 100;
            const y = 100;

            const pumpkin = new PumpkinToy(x, y);
            engine.addToy(pumpkin);

            updateStats();
            showNotification('Pumpkin spawned! Click 3 times to break it.', 'success');

            console.log('✅ Pumpkin spawned!');
        } catch (error) {
            console.error('Failed to spawn pumpkin:', error);
            showNotification('Failed to spawn pumpkin', 'error');
        }
    }

    // Helper untuk create instance
    function createPetInstance(type, x, y) {
        if (type === 'speaki') {
            return new Speaki(x, y);
        } else if (type === 'erpin') {
            return new Erpin(x, y);
        } else {
            console.error(`Unknown pet type: ${type}`);
            return null;
        }
    }

    // Toggle physics
    function togglePhysics() {
        physicsEnabled = !physicsEnabled;
        engine.togglePhysics(physicsEnabled);

        updateStats();
        showNotification(`Physics ${physicsEnabled ? 'enabled' : 'disabled'}`, 'info');
    }

    // Clear all pets
    function clearAllPets() {
        if (!confirm('Remove all pets? This will delete them from database.')) {
            return;
        }

        // Delete from database first
        engine.getPets().forEach(async (pet) => {
            if (pet.id) {
                try {
                    await PetAPI.deletePet(pet.id);
                } catch (error) {
                    console.warn('Failed to delete pet from database:', error);
                }
            }
        });

        // Remove from engine
        engine.removeAllPets();

        updateStats();
        showNotification('All pets removed', 'success');
        console.log('🗑️ All pets removed');
    }

    // Clear all toys
    function clearAllToys() {
        if (!confirm('Remove all toys?')) {
            return;
        }

        engine.removeAllToys();

        updateStats();
        showNotification('All toys removed', 'success');
        console.log('🧹 All toys removed');
    }

    // Update stats panel
    function updateStats() {
        const petCount = engine ? engine.getPets().length : 0;
        const toyCount = engine ? engine.getToys().length : 0;

        document.getElementById('pet-count').textContent = petCount;
        document.getElementById('toy-count').textContent = toyCount;
        document.getElementById('physics-status').textContent = physicsEnabled ? 'ON' : 'OFF';
    }

    // Show notification
    function showNotification(message, type = 'info') {
        // Check if notification element exists
        let notification = document.getElementById('notification');

        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: bold;
                font-size: 14px;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
            `;
            document.body.appendChild(notification);
        }

        // Set color based on type
        const colors = {
            success: '#4ECDC4',
            error: '#FF6B6B',
            warning: '#FFA500',
            info: '#6C5CE7'
        };

        notification.style.background = colors[type] || colors.info;
        notification.style.color = 'white';
        notification.textContent = message;

        // Show
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        // Hide after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
        }, 3000);
    }

    // Handle errors globally
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
        showNotification('An error occurred. Check console.', 'error');
    });

    // Update stats every 5 seconds
    setInterval(() => {
        if (engine) {
            updateStats();
        }
    }, 5000);

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+S: Spawn Speaki
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            spawnPet('speaki');
        }

        // Ctrl+E: Spawn Erpin
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            spawnPet('erpin');
        }

        // Ctrl+P: Spawn Pumpkin
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            spawnPumpkin();
        }

        // Ctrl+D: Toggle Physics
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            togglePhysics();
        }

        // Ctrl+X: Clear Pets
        if (e.ctrlKey && e.key === 'x') {
            e.preventDefault();
            clearAllPets();
        }
    });

    // Log keyboard shortcuts on load
    console.log(`
    🎮 Keyboard Shortcuts:
    - Ctrl+S: Spawn Speaki
    - Ctrl+E: Spawn Erpin
    - Ctrl+P: Spawn Pumpkin
    - Ctrl+D: Toggle Physics
    - Ctrl+X: Clear All Pets
    `);
</script>

<style>
    /* Control panel responsive */
    @media (max-width: 768px) {
        #controls-panel {
            top: auto;
            bottom: 20px;
            right: 20px;
            max-width: 160px;
            padding: 15px;
        }

        #controls-panel h3 {
            font-size: 16px;
        }

        #controls-panel button,
        #controls-panel a {
            padding: 8px;
            font-size: 12px;
        }

        #stats-panel {
            font-size: 10px;
        }
    }

    /* Button hover effects */
    #controls-panel button:hover,
    #controls-panel a:hover {
        opacity: 0.9;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        transition: all 0.2s;
    }

    #controls-panel button:active,
    #controls-panel a:active {
        transform: translateY(0);
    }

    /* Smooth scrollbar */
    #controls-panel::-webkit-scrollbar {
        width: 6px;
    }

    #controls-panel::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.1);
        border-radius: 3px;
    }

    #controls-panel::-webkit-scrollbar-thumb {
        background: rgba(0,0,0,0.3);
        border-radius: 3px;
    }

    #controls-panel::-webkit-scrollbar-thumb:hover {
        background: rgba(0,0,0,0.5);
    }
</style>
@endpush
