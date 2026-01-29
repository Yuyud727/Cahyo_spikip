// Pumpkin Toy - Interactive object
class PumpkinToy extends Entity {
    constructor(x, y) {
        super(x, y, 60, 60);

        this.isSoup = false;
        this.sprites = {
            normal: 'pumkin.png',
            soup: 'pumkin-soup.png'
        };

        this.element = this.createElement();
    }

    createElement() {
        const div = document.createElement('div');
        div.className = 'toy pumpkin';
        div.style.position = 'absolute';
        div.style.width = this.width + 'px';
        div.style.height = this.height + 'px';
        div.style.cursor = 'grab';
        div.style.userSelect = 'none';

        div.innerHTML = `
            <img class="toy-sprite" src="${this.getCurrentSpritePath()}" style="
                width: 100%;
                height: 100%;
                object-fit: contain;
                pointer-events: none;
            ">
        `;

        // Event listeners
        div.addEventListener('mousedown', (e) => this.onMouseDown(e));
        div.addEventListener('contextmenu', (e) => this.onRightClick(e));

        document.getElementById('pet-container').appendChild(div);
        return div;
    }

    getCurrentSpritePath() {
        const spriteName = this.isSoup ? this.sprites.soup : this.sprites.normal;
        return `${window.PetConfig.assetUrl}/images/speaki/${spriteName}`;
    }

    onMouseDown(e) {
        this.startDrag(e.clientX, e.clientY);
        this.element.style.cursor = 'grabbing';
    }

    onRightClick(e) {
        e.preventDefault();
        this.toggleSoup();
    }

    toggleSoup() {
        this.isSoup = !this.isSoup;
        const img = this.element.querySelector('.toy-sprite');
        if (img) {
            img.src = this.getCurrentSpritePath();
        }
    }

    render() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.render();
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
}
