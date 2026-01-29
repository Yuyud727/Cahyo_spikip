// Base Pet Class - Parent untuk semua character
class BasePet extends Entity {
    constructor(x, y, type = 'default') {
        super(x, y, 80, 80);

        this.type = type;
        this.id = null; // Will be set dari database
        this.facingRight = Math.random() > 0.5;

        // State machine
        this.stateMachine = new StateMachine();
        this.setupStates();

        // Movement speeds
        this.walkSpeed = 2.0;
        this.runSpeed = 5.0;

        // Create DOM element
        this.element = this.createElement();

        // Auto-save position timer
        this.savePositionTimer = 0;
        this.savePositionInterval = 300; // Save setiap 5 detik
    }

    createElement() {
        const div = document.createElement('div');
        div.className = 'pet';
        div.style.position = 'absolute';
        div.style.width = this.width + 'px';
        div.style.height = this.height + 'px';
        div.style.cursor = 'grab';
        div.style.userSelect = 'none';

        div.innerHTML = `
            <div class="pet-body" style="
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                transition: transform 0.1s;
            ">
                <img
                    src="${window.PetConfig.assetUrl}/images/${this.type}/${this.getCurrentSprite()}"
                    alt="${this.type}"
                    style="
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        pointer-events: none;
                        user-select: none;
                    "
                >
            </div>

            <div class="state-indicator" style="
                position: absolute;
                top: -20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 10px;
                white-space: nowrap;
                pointer-events: none;
            ">
                ${this.stateMachine.getState()}
            </div>
        `;


        // Event listeners
        div.addEventListener('mousedown', (e) => this.onMouseDown(e));

        document.getElementById('pet-container').appendChild(div);
        return div;
    }

    setupStates() {
        // Override di child class
    }

    getColor() {
        return '#999'; // Override di child class
    }

    getEmoji() {
        return '🐾'; // Override di child class
    }

    onMouseDown(e) {
        this.startDrag(e.clientX, e.clientY);
        this.element.style.cursor = 'grabbing';
    }

    update(deltaTime) {
        super.update(deltaTime);

        // Update state machine
        if (!this.isDragging) {
            this.stateMachine.update(deltaTime);
            this.updateBehavior();
        }

        // Auto-save position
        this.savePositionTimer++;
        if (this.id && this.savePositionTimer >= this.savePositionInterval) {
            this.savePosition();
            this.savePositionTimer = 0;
        }

        this.render();
    }

    updateBehavior() {
        // Override di child class
    }

    render() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';

        // Flip sprite
        const inner = this.element.firstElementChild;
        if (this.facingRight) {
            inner.style.transform = 'scaleX(-1)';
        } else {
            inner.style.transform = 'scaleX(1)';
        }

        // Update state indicator
        const stateIndicator = this.element.querySelector('.state-indicator');
        if (stateIndicator) {
            stateIndicator.textContent = this.stateMachine.getState();
        }
    }

    async savePosition() {
        if (this.id) {
            await PetAPI.updatePosition(this.id, this.x, this.y);
        }
    }

    stopDrag() {
        super.stopDrag();
        this.element.style.cursor = 'grab';
    }

    destroy() {
        if (this.element) {
            this.element.remove();
        }
    }
    playSound(filename) {
    if (!window.PetConfig.settings.sound_enabled) return;

    const audio = new Audio(
        `${window.PetConfig.assetUrl}/sounds/${this.type}/${filename}`
    );
    audio.volume = 0.5;
    audio.play().catch(e => console.warn('Audio play failed:', e));
}
}
