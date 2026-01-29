// Speaki Character - Active/Playful type
class Speaki extends BasePet {
    constructor(x, y) {
        super(x, y, 'speaki');
        this.walkSpeed = 2.5;
        this.runSpeed = 5.5;

        // Sprite paths
        this.sprites = {
            cheerful: 'Speaki-Cherrful.png',
            cry: 'Speaki-Cry.png',
            happy: 'Speaki-Happu.png'
        };

        // Sound files
        this.sounds = {
            walk: ['walk-1.mp3', 'walk-2.mp3', 'walk-3.mp3'],
            jump: 'jump.mp3',
            drag: 'cry-drag.mp3',
            angry: ['angry-full.mp3', 'angry-half.mp3'],
            tantrum: 'Speaki-Euu.mp3'
        };
    }

    getCurrentSpritePath() {
        return `${window.PetConfig.assetUrl}/images/${this.type}/${this.sprites.cheerful}`;
    }

    getColor() {
        return '#FF6B6B';
    }

    getEmoji() {
        return '🐱';
    }

    onMouseDown(e) {
        super.onMouseDown(e);
        this.updateSprite(this.sprites.cry);
        this.playSound(this.sounds.drag);
    }

    setupStates() {
        // IDLE State
        this.stateMachine.registerState('IDLE',
            () => {
                this.vx = 0;
                this.updateSprite(this.sprites.cheerful);
            },
            () => {
                this.vx *= 0.9;

                if (this.stateMachine.stateTimer > 100) {
                    const rand = Math.random();
                    if (rand < 0.4) {
                        this.stateMachine.changeState('WALK_LEFT');
                    } else if (rand < 0.8) {
                        this.stateMachine.changeState('WALK_RIGHT');
                    } else {
                        this.stateMachine.changeState('JUMP');
                    }
                }
            }
        );

        // WALK_LEFT State
        this.stateMachine.registerState('WALK_LEFT',
            () => {
                this.facingRight = false;
                this.updateSprite(this.sprites.cheerful);
                // Play random walk sound
                const walkSound = this.sounds.walk[Math.floor(Math.random() * this.sounds.walk.length)];
                this.playSound(walkSound);
            },
            () => {
                this.vx = -this.walkSpeed;

                if (this.stateMachine.stateTimer > 150 || this.x <= 0) {
                    this.stateMachine.changeState('IDLE');
                }
            }
        );

        // WALK_RIGHT State
        this.stateMachine.registerState('WALK_RIGHT',
            () => {
                this.facingRight = true;
                this.updateSprite(this.sprites.cheerful);
                // Play random walk sound
                const walkSound = this.sounds.walk[Math.floor(Math.random() * this.sounds.walk.length)];
                this.playSound(walkSound);
            },
            () => {
                this.vx = this.walkSpeed;

                if (this.stateMachine.stateTimer > 150 || this.x >= window.innerWidth - this.width) {
                    this.stateMachine.changeState('IDLE');
                }
            }
        );

        // JUMP State
        this.stateMachine.registerState('JUMP',
            () => {
                this.updateSprite(this.sprites.happy);
                this.playSound(this.sounds.jump);
                if (this.onGround) {
                    this.vy = -15;
                    this.vx = (Math.random() - 0.5) * 10;
                }
            },
            () => {
                if (this.onGround && this.stateMachine.stateTimer > 10) {
                    this.stateMachine.changeState('IDLE');
                }
            }
        );

        // Set initial state
        this.stateMachine.changeState('IDLE');
    }

    updateBehavior() {
        // Random jump chance saat walking
        if (this.stateMachine.isInState('WALK_LEFT') || this.stateMachine.isInState('WALK_RIGHT')) {
            if (Math.random() < 0.01 && this.onGround) {
                this.stateMachine.changeState('JUMP');
            }
        }
    }
}
