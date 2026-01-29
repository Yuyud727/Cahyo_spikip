// API Client untuk komunikasi dengan Laravel Backend
class PetAPI {
    static getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': window.PetConfig.csrfToken
        };
    }

    // Get all pets
    static async getPets() {
        try {
            const response = await fetch(`${window.PetConfig.apiUrl}/pets`, {
                method: 'GET',
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Failed to get pets:', error);
            throw error;
        }
    }

    // Create new pet
    static async createPet(type, position = null) {
        try {
            const response = await fetch(`${window.PetConfig.apiUrl}/pets`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    type: type,
                    position: position
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Failed to create pet:', error);
            throw error;
        }
    }

    // Update pet position (auto-save)
    static async updatePosition(petId, x, y) {
        try {
            const response = await fetch(`${window.PetConfig.apiUrl}/pets/${petId}/position`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify({ x, y })
            });
            return await response.json();
        } catch (error) {
            console.error('Failed to update position:', error);
            // Don't throw - position updates are non-critical
        }
    }

    // Log interaction
    static async logInteraction(petId, interactionType, data = {}) {
        try {
            const response = await fetch(`${window.PetConfig.apiUrl}/pets/${petId}/interact`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    interaction_type: interactionType,
                    data: data
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Failed to log interaction:', error);
        }
    }

    // Delete pet
    static async deletePet(petId) {
        try {
            const response = await fetch(`${window.PetConfig.apiUrl}/pets/${petId}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Failed to delete pet:', error);
            throw error;
        }
    }
}
