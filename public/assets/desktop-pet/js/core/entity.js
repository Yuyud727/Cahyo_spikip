// Base Entity Class - Foundation untuk semua object yang punya physics
class Entity {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // Velocity
        this.vx = 0;
        this.vy = 0;

        // Physics properties
        this.gravity = 0.8;
        this.friction = 0.95;
        this.bounce = 0.6;

        // Dragging
        this.isDragging = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;

        // Ground detection
        this.onGround = false;
    }

    update(deltaTime) {
        if (this.isDragging) {
            return; // Skip physics saat di-drag
        }

        // Apply gravity
        this.vy += this.gravity;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Ground collision
        const ground = window.innerHeight - this.height;
        if (this.y >= ground) {
            this.y = ground;
            this.onGround = true;

            // Bounce
            if (Math.abs(this.vy) > 2) {
                this.vy = -this.vy * this.bounce;
            } else {
                this.vy = 0;
            }

            // Friction
            this.vx *= this.friction;
        } else {
            this.onGround = false;
        }

        // Wall collision
        if (this.x <= 0) {
            this.x = 0;
            this.vx = -this.vx * this.bounce;
        } else if (this.x + this.width >= window.innerWidth) {
            this.x = window.innerWidth - this.width;
            this.vx = -this.vx * this.bounce;
        }
    }

    startDrag(mouseX, mouseY) {
        this.isDragging = true;
        this.dragOffsetX = mouseX - this.x;
        this.dragOffsetY = mouseY - this.y;
        this.vx = 0;
        this.vy = 0;
    }

    drag(mouseX, mouseY) {
        if (!this.isDragging) return;
        this.x = mouseX - this.dragOffsetX;
        this.y = mouseY - this.dragOffsetY;
    }

    stopDrag() {
        this.isDragging = false;
    }

    render() {
        // Override this in child classes
    }

    destroy() {
        // Override this in child classes
    }
}
