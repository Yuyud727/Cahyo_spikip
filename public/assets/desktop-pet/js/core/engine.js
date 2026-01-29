// Main Pet Engine - Mengatur semua game loop
class PetEngine {
    constructor() {
        this.pets = [];
        this.toys = [];
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

    try {
        // Calculate delta time
        this.deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // Update all entities
        if (this.physicsEnabled) {
            // Update pets
            this.pets.forEach(pet => {
                pet.update(this.deltaTime);
            });

            // Update toys
            this.toys.forEach(toy => {
                toy.update(this.deltaTime);

                // Check collision dengan pets
                this.pets.forEach(pet => {
                    if (toy.checkCollisionWithPet && toy.checkCollisionWithPet(pet)) {
                        // Pet berinteraksi dengan toy
                        // TODO: Bisa tambahkan animasi pet tertarik ke toy
                    }
                });
            });
        }
    } catch (error) {
        console.error('Game loop error:', error);
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

    addToy(toy) {
        this.toys.push(toy);

        // Set drag callback
        toy.element.addEventListener('mousedown', (e) => {
            this.currentDragTarget = toy;
        });

        console.log(`Added toy. Total toys: ${this.toys.length}`);
    }

    removePet(pet) {
        const index = this.pets.indexOf(pet);
        if (index > -1) {
            this.pets.splice(index, 1);
            pet.destroy();
            console.log(`Removed pet. Total pets: ${this.pets.length}`);
        }
    }

    removeToy(toy) {
        const index = this.toys.indexOf(toy);
        if (index > -1) {
            this.toys.splice(index, 1);
            toy.destroy();
            console.log(`Removed toy. Total toys: ${this.toys.length}`);
        }
    }

    removeAllPets() {
        this.pets.forEach(pet => pet.destroy());
        this.pets = [];
        console.log('All pets removed');
    }

    removeAllToys() {
        this.toys.forEach(toy => toy.destroy());
        this.toys = [];
        console.log('All toys removed');
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

    getToys() {
        return this.toys;
    }
}
