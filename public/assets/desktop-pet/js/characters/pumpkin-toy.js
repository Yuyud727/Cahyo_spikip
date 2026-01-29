// Pumpkin Toy - Interactive toy untuk pets
class PumpkinToy extends Entity {
    constructor(x, y) {
        super(x, y, 60, 60);

        this.type = 'pumpkin';
        this.state = 'whole'; // whole, broken, soup

        // Physics properties
        this.bounce = 0.7;
        this.friction = 0.98;
        this.mass = 2.0;

        // Interaction
        this.clickCount = 0;
        this.maxClicks = 3; // 3 kali klik untuk pecah
        this.isSoup = false;

        // Animation
        this.rotationAngle = 0;
        this.rotationSpeed = 0;
        this.wiggleTimer = 0;

        // Sprites
        this.sprites = {
            whole: 'pumkin.png',
            soup: 'pumkin-soup.png'
        };

        this.currentSprite = 'whole';

        // Create DOM element
        this.element = this.createElement();

        // Timer untuk auto-delete
        this.lifeTimer = 0;
        this.maxLifeTime = 1800; // 30 detik (60fps * 30)
    }

    createElement() {
        const div = document.createElement('div');
        div.className = 'pumpkin-toy';
        div.style.position = 'absolute';
        div.style.width = this.width + 'px';
        div.style.height = this.height + 'px';
        div.style.cursor = 'pointer';
        div.style.userSelect = 'none';
        div.style.zIndex = '50';
        div.style.transition = 'transform 0.1s';

        div.innerHTML = `
            <div class="pumpkin-body" style="
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
            ">
                <img
                    src="${this.getCurrentSpritePath()}"
                    alt="pumpkin"
                    style="
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        pointer-events: none;
                        user-select: none;
                    "
                >

                <!-- Click indicator -->
                <div class="click-indicator" style="
                    position: absolute;
                    top: -25px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(255, 140, 0, 0.9);
                    color: white;
                    padding: 3px 10px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: bold;
                    white-space: nowrap;
                    pointer-events: none;
                    display: none;
                ">
                    ${this.clickCount}/${this.maxClicks} hits
                </div>
            </div>
        `;

        // Event listeners
        div.addEventListener('mousedown', (e) => this.onMouseDown(e));
        div.addEventListener('click', (e) => this.onClick(e));

        document.getElementById('pet-container').appendChild(div);
        return div;
    }

    getCurrentSpritePath() {
        const spriteName = this.sprites[this.currentSprite];
        return `${window.PetConfig.assetUrl}/images/speaki/${spriteName}`;
    }

    updateSprite(spriteName) {
        if (!this.sprites[spriteName]) {
            console.warn(`Sprite '${spriteName}' not found for pumpkin`);
            return;
        }

        this.currentSprite = spriteName;
        const img = this.element.querySelector('img');
        if (img) {
            img.src = this.getCurrentSpritePath();
        }
    }

    onMouseDown(e) {
        if (this.isSoup) return; // Soup tidak bisa di-drag

        e.preventDefault();
        e.stopPropagation(); // Prevent engine dari catch event ini

        this.startDrag(e.clientX, e.clientY);
        this.element.style.cursor = 'grabbing';
        this.element.style.zIndex = '1000';

        // Play sound
        this.playSound('drag');
    }

    onClick(e) {
        if (this.isDragging || this.isSoup) return;

        e.stopPropagation();

        this.clickCount++;
        this.updateClickIndicator();

        // Wiggle animation
        this.wiggle();

        // Play hit sound
        this.playSound('hit');

        // Check if should break
        if (this.clickCount >= this.maxClicks) {
            this.breakIntoPieces();
        }
    }

    wiggle() {
        this.wiggleTimer = 10; // 10 frames
        this.rotationSpeed = (Math.random() - 0.5) * 20;
    }

    breakIntoPieces() {
        console.log('🎃 Pumpkin breaking into pieces!');

        // Visual effect - shake
        this.element.style.animation = 'shake 0.3s';

        setTimeout(() => {
            // Change to soup
            this.transformToSoup();
        }, 300);

        // Play break sound
        this.playSound('break');
    }

    transformToSoup() {
        this.isSoup = true;
        this.state = 'soup';
        this.currentSprite = 'soup';
        this.updateSprite('soup');

        // Reset physics
        this.vx = 0;
        this.vy = 0;
        this.isDragging = false;

        // Change cursor
        this.element.style.cursor = 'default';
        this.element.style.animation = 'none';

        // Hide click indicator
        const indicator = this.element.querySelector('.click-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }

        console.log('🍜 Transformed to soup!');

        // Auto-remove after 5 seconds
        setTimeout(() => {
            this.fadeOut();
        }, 5000);
    }

    fadeOut() {
        this.element.style.transition = 'opacity 1s';
        this.element.style.opacity = '0';

        setTimeout(() => {
            this.destroy();
        }, 1000);
    }

    updateClickIndicator() {
        const indicator = this.element.querySelector('.click-indicator');
        if (indicator && !this.isSoup) {
            indicator.textContent = `${this.clickCount}/${this.maxClicks} hits`;
            indicator.style.display = 'block';

            // Auto-hide after 1 second
            setTimeout(() => {
                if (indicator) {
                    indicator.style.display = 'none';
                }
            }, 1000);
        }
    }

    update(deltaTime) {
        super.update(deltaTime);

        // Update wiggle
        if (this.wiggleTimer > 0) {
            this.wiggleTimer--;
            this.rotationAngle += this.rotationSpeed;
            this.rotationSpeed *= 0.9; // Decay
        } else {
            this.rotationAngle *= 0.95; // Return to normal
        }

        // Life timer (auto-delete jika tidak dipakai)
        if (!this.isSoup) {
            this.lifeTimer++;
            if (this.lifeTimer >= this.maxLifeTime) {
                console.log('🎃 Pumpkin expired (not used)');
                this.fadeOut();
            }
        }

        this.render();
    }

    render() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';

        // Rotation
        const body = this.element.firstElementChild;
        if (body) {
            body.style.transform = `rotate(${this.rotationAngle}deg)`;
        }
    }

    stopDrag() {
        super.stopDrag();
        this.element.style.cursor = 'pointer';
        this.element.style.zIndex = '50';

        // Bounce effect saat di-drop
        if (Math.abs(this.vy) > 5) {
            this.playSound('bounce');
        }
    }

    playSound(action) {
        if (!window.PetConfig.settings.sound_enabled) return;

        const sounds = {
            drag: 'walk-1.mp3',
            hit: 'angry-half.mp3',
            break: 'angry-full.mp3',
            bounce: 'jump.mp3'
        };

        const soundFile = sounds[action];
        if (!soundFile) return;

        try {
            const audio = new Audio(
                `${window.PetConfig.assetUrl}/sounds/speaki/${soundFile}`
            );
            audio.volume = 0.4;
            audio.play().catch(e => console.warn('Audio play failed:', e));
        } catch (error) {
            console.warn('Sound error:', error);
        }
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.remove();
        }
    }

    // Check collision dengan pet (untuk interaksi)
    checkCollisionWithPet(pet) {
        const dx = this.x - pet.x;
        const dy = this.y - pet.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < (this.width / 2 + pet.width / 2);
    }
}

// Add shake animation ke CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0) rotate(0deg); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px) rotate(-5deg); }
        20%, 40%, 60%, 80% { transform: translateX(5px) rotate(5deg); }
    }
`;
document.head.appendChild(style);
