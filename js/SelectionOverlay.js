class SelectionOverlay{

    static activeOverlay = null;

    createOverlay(cell) {
        this.removeOverlay();

        this.overlay = document.createElement('div');
        this.overlay.classList.add('overlay');

        // Values including blank (0) are added to the overlay
        for (let value = 1; value <= 10; value++) {
            const valueButton = document.createElement('button');
            valueButton.textContent = value === 10 ? 'Blank' : value;
            valueButton.addEventListener('click', () => cell.handleValueSelection(value));
            this.overlay.appendChild(valueButton);
        }

        return this.overlay;
    }

    removeOverlay() {
        if (this.overlay) {
            document.body.removeChild(this.overlay);
            this.overlay = null;
        }
    }
}