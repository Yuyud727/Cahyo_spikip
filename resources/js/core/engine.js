// Main Pet Engine - Mengatur semua game loop
class PetEngine {
    constructor() {
        this.pets = [];
        this.running = false;
        this.lastTime = 0;
        this.deltaTime = 0;
        this.physicsEnabled = true;

        // Mouse tracking
        this.mouseX = 0;
        this.mouseY = 0;
        this.currentDragTarget = null;
    }

    init() {
        console.log('🎮 Pet Engine initialized');

        // Setup mouse events
        this.setupMouseEvents();

        // Start game loop
        this.start();
    }

    setupMouseEvents() {
        const container = document.getElementById('pet-container');

        // Mouse move
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            // Drag current target
            if (this.currentDragTarget) {
                this.currentDragTarget.drag(this.mouseX, this.mouseY);
            }
        });

        // Mouse up (stop dragging)
        document.addEventListener('mouseup', () => {
            if (this.currentDragTarget) {
                this.currentDragTarget.stopDrag();
                this.currentDragTarget = null;
            }
        });
    }

    start() {
        this.running = true;
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }

    stop() {
        this.running = false;
    }

    gameLoop(timestamp) {
        if (!this.running) return;

        // Calculate delta time
        this.deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // Update all pets
        if (this.physicsEnabled) {
            this.pets.forEach(pet => {
                pet.update(this.deltaTime);
            });
        }

        // Continue loop
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    addPet(pet) {
        this.pets.push(pet);

        // Set drag callback
        pet.element.addEventListener('mousedown', (e) => {
            this.currentDragTarget = pet;
        });

        console.log(`Added ${pet.type} pet. Total pets: ${this.pets.length}`);
    }

    removePet(pet) {
        const index = this.pets.indexOf(pet);
        if (index > -1) {
            this.pets.splice(index, 1);
            pet.destroy();
            console.log(`Removed pet. Total pets: ${this.pets.length}`);
        }
    }

    togglePhysics(enabled) {
        this.physicsEnabled = enabled;
        console.log(`Physics ${enabled ? 'enabled' : 'disabled'}`);
    }

    getPets() {
        return this.pets;
    }

    getPetById(id) {
        return this.pets.find(pet => pet.id === id);
    }
}
