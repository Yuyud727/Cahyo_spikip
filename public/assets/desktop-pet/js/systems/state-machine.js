// State Machine untuk AI Behavior
class StateMachine {
    constructor() {
        this.currentState = 'IDLE';
        this.stateTimer = 0;
        this.states = {};
    }

    // Register state dengan behavior
    registerState(name, enterCallback, updateCallback, exitCallback) {
        this.states[name] = {
            enter: enterCallback || (() => {}),
            update: updateCallback || (() => {}),
            exit: exitCallback || (() => {})
        };
    }

    // Change state
    changeState(newState) {
        if (this.currentState === newState) return;

        // Exit current state
        if (this.states[this.currentState]) {
            this.states[this.currentState].exit();
        }

        // Enter new state
        this.currentState = newState;
        if (this.states[newState]) {
            this.states[newState].enter();
        }

        this.stateTimer = 0;
    }

    // Update current state
    update(deltaTime) {
        this.stateTimer++;

        if (this.states[this.currentState]) {
            this.states[this.currentState].update(deltaTime);
        }
    }

    // Get current state
    getState() {
        return this.currentState;
    }

    // Check if in state
    isInState(stateName) {
        return this.currentState === stateName;
    }
}
