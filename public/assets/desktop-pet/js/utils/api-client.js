// API Client untuk komunikasi dengan Laravel Backend
class PetAPI {
    static getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || window.PetConfig.csrfToken
        };
    }

    // Get all pets
    static async getPets() {
        try {
            const response = await fetch(`${window.PetConfig.apiUrl}/pets`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch pets');
            }
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
                    position: position || { x: 100, y: 100 }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                return data;
            } else {
                throw new Error(data.message || 'Failed to create pet');
            }
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

            if (!response.ok) {
                console.warn(`Position update failed: ${response.status}`);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.warn('Failed to update position:', error);
            return null;
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

            if (!response.ok) {
                console.warn(`Interaction log failed: ${response.status}`);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.warn('Failed to log interaction:', error);
            return null;
        }
    }

    // Delete pet
    static async deletePet(petId) {
        try {
            const response = await fetch(`${window.PetConfig.apiUrl}/pets/${petId}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                return data;
            } else {
                throw new Error(data.message || 'Failed to delete pet');
            }
        } catch (error) {
            console.error('Failed to delete pet:', error);
            throw error;
        }
    }
}
