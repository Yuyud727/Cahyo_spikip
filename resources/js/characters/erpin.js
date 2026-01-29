// Erpin Character - Calm/Social type
class Erpin extends BasePet {
    constructor(x, y) {
        super(x, y, 'erpin');
        this.walkSpeed = 1.8;
        this.runSpeed = 4.0;

        // Sprite paths
        this.sprites = {
            cheerful: 'Erpin-Cherrful.png',
            cry: 'Erpin-Cry.png',
            happy: 'Erpin-Happy.png',
            sleeping: 'Erpin-Sleeping.png'
        };

        // Sound files
        this.sounds = {
            punch: ['Erpin-Punch-1.mp3', 'Erpin-Punch-2.mp3'],
            walk: 'Erpin-humu.mp3'
        };
    }

    getCurrentSpritePath() {
        return `${window.PetConfig.assetUrl}/images/${this.type}/${this.sprites.cheerful}`;
    }

    getColor() {
        return '#4ECDC4';
    }

    getEmoji() {
        return '🐰';
    }

    onMouseDown(e) {
        super.onMouseDown(e);
        this.updateSprite(this.sprites.cry);
        // Play random punch sound
        const punchSound = this.sounds.punch[Math.floor(Math.random() * this.sounds.punch.length)];
        this.playSound(punchSound);
    }

    setupStates() {
        // IDLE State
        this.stateMachine.registerState('IDLE',
            () => {
                this.vx = 0;
                this.updateSprite(this.sprites.cheerful);
            },
            () => {
                this.vx *= 0.95;

                if (this.stateMachine.stateTimer > 120) {
                    const rand = Math.random();
                    if (rand < 0.3) {
                        this.stateMachine.changeState('WALK_LEFT');
                    } else if (rand < 0.6) {
                        this.stateMachine.changeState('WALK_RIGHT');
                    } else if (rand < 0.7) {
                        this.stateMachine.changeState('SLEEPING');
                    }
                }
            }
        );

        // WALK_LEFT State
        this.stateMachine.registerState('WALK_LEFT',
            () => {
                this.facingRight = false;
                this.updateSprite(this.sprites.cheerful);
                if (Math.random() < 0.5) {
                    this.playSound(this.sounds.walk);
                }
            },
            () => {
                this.vx = -this.walkSpeed;

                if (this.stateMachine.stateTimer > 200 || this.x <= 0) {
                    this.stateMachine.changeState('IDLE');
                }
            }
        );

        // WALK_RIGHT State
        this.stateMachine.registerState('WALK_RIGHT',
            () => {
                this.facingRight = true;
                this.updateSprite(this.sprites.cheerful);
                if (Math.random() < 0.5) {
                    this.playSound(this.sounds.walk);
                }
            },
            () => {
                this.vx = this.walkSpeed;

                if (this.stateMachine.stateTimer > 200 || this.x >= window.innerWidth - this.width) {
                    this.stateMachine.changeState('IDLE');
                }
            }
        );

        // SLEEPING State
        this.stateMachine.registerState('SLEEPING',
            () => {
                this.vx = 0;
                this.updateSprite(this.sprites.sleeping);
            },
            () => {
                this.vx = 0;

                if (this.stateMachine.stateTimer > 300) {
                    this.stateMachine.changeState('IDLE');
                }
            },
            () => {
                // Wake up - restore sprite
                this.updateSprite(this.sprites.cheerful);
            }
        );

        // Set initial state
        this.stateMachine.changeState('IDLE');
    }

    updateBehavior() {
        // Erpin lebih kalem, jarang loncat
        if (this.stateMachine.isInState('WALK_LEFT') || this.stateMachine.isInState('WALK_RIGHT')) {
            if (Math.random() < 0.003 && this.onGround) {
                this.vy = -12; // Lompatan lebih rendah
            }
        }
    }
}
