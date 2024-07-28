(function() {
    // CSS Styles
    const styles = `
        #accessibility-wrapper {
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-family: Arial, sans-serif;
            z-index: 1000;
        }
        #accessibility-toggle {
            background-color: #fff;
            color: white;
            border: none;
            padding: 10px 10px;
            cursor: pointer;
            border-radius: 80px;
            border: 1.5px solid black;
        }
        #accessibility-panel {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 15px;
            width: 250px;
            position: absolute;
            bottom: 50px;
            right: 0;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        #accessibility-panel h3 {
            margin-top: 0;
            margin-bottom: 15px;
        }
        .logo {
            height:40px
        }
        .control {
            margin-bottom: 15px;
        }
        .control label {
            display: block;
            margin-bottom: 5px;
        }
        .control input[type="range"],
        .control select {
            width: 100%;
        }
        #emphasize-links {
            background-color: #6c757d;
            color: white;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 3px;
        }
        #emphasize-links.active {
            background-color: #28a745;
        }
    `;

    // HTML Structure
    const html = `
        <div id="accessibility-wrapper">
            <button id="accessibility-toggle"><img class="logo" src="https://raw.githubusercontent.com/vanjasavic/AccessMate/main/logo.png"></button>
            <div id="accessibility-panel" hidden>
                <h4>Prilagodba pristupačnosti</h4>
                <div class="control">
                    <label for="font-size">Veličina slova:</label>
                    <input type="range" id="font-size" min="12" max="24" step="1" value="16">
                </div>
                <div class="control">
                    <label for="font-weight">Debljina slova:</label>
                    <input type="range" id="font-weight" min="300" max="900" step="100" value="400">
                </div>
                <div class="control">
                    <label for="letter-spacing">Slovni razmak:</label>
                    <input type="range" id="letter-spacing" min="0" max="5" step="0.5" value="0">
                </div>
                <div class="control">
                    <label for="line-height">Prored teksta:</label>
                    <input type="range" id="line-height" min="1" max="2" step="0.1" value="1.5">
                </div>
                <div class="control">
                    <label for="background-color">Boja pozadine:</label>
                    <select id="background-color">
                        <option value="white">Bijela</option>
                        <option value="black">Crna</option>
                        <option value="yellow">Žuta</option>
                        <option value="blue">Plava</option>
                    </select>
                </div>
                <div class="control">
                <label for="background-color">Naglašeni linkovi:</label>
                    <button id="emphasize-links">Isključeno</button>
                </div>
            </div>
        </div>
    `;

    // Inject CSS
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // Inject HTML
    const wrapperElement = document.createElement('div');
    wrapperElement.innerHTML = html;
    document.body.appendChild(wrapperElement.firstElementChild);

    // Plugin functionality
    class AccessibilityPlugin {
        constructor() {
            this.wrapper = document.getElementById('accessibility-wrapper');
            this.panel = document.getElementById('accessibility-panel');
            this.toggle = document.getElementById('accessibility-toggle');
            this.linkEmphasisEnabled = false;
            this.initializeControls();
        }

        initializeControls() {
            this.toggle.addEventListener('click', () => this.togglePanel());
            this.addControl('font-size', this.changeFontSize);
            this.addControl('font-weight', this.changeFontWeight);
            this.addControl('letter-spacing', this.changeLetterSpacing);
            this.addControl('line-height', this.changeLineHeight);
            this.addControl('background-color', this.changeBackgroundColor);
            this.addButtonControl('emphasize-links', this.toggleLinkEmphasis);
        }

        addControl(id, callback) {
            const control = document.getElementById(id);
            if (control) {
                control.addEventListener('change', (e) => callback.call(this, e.target.value));
            }
        }

        addButtonControl(id, callback) {
            const control = document.getElementById(id);
            if (control) {
                control.addEventListener('click', () => callback.call(this));
            }
        }

        togglePanel() {
            this.panel.hidden = !this.panel.hidden;
        }

        changeFontSize(value) {
            document.body.style.fontSize = `${value}px`;
            this.resetPluginStyles();
        }

        changeFontWeight(value) {
            document.body.style.fontWeight = value;
            this.resetPluginStyles();
        }

        changeLetterSpacing(value) {
            document.body.style.letterSpacing = `${value}px`;
            this.resetPluginStyles();
        }

        changeLineHeight(value) {
            document.body.style.lineHeight = value;
            this.resetPluginStyles();
        }

        changeBackgroundColor(value) {
            document.body.style.backgroundColor = value;
            document.body.style.color = value === 'black' ? 'white' : 'black';
            this.resetPluginStyles();
        }

        toggleLinkEmphasis() {
            this.linkEmphasisEnabled = !this.linkEmphasisEnabled;
            this.emphasizeLinks(this.linkEmphasisEnabled);
            this.updateLinkEmphasisButton();
        }

        emphasizeLinks(emphasize) {
            const links = document.getElementsByTagName('a');
            for (let link of links) {
                if (!this.wrapper.contains(link)) {
                    if (emphasize) {
                        link.style.fontWeight = 'bold';
                        link.style.textDecoration = 'underline';
                    } else {
                        link.style.fontWeight = '';
                        link.style.textDecoration = '';
                    }
                }
            }
        }

        updateLinkEmphasisButton() {
            const button = document.getElementById('emphasize-links');
            if (button) {
                button.textContent = this.linkEmphasisEnabled ? 'Uključeno' : 'Isključeno';
                button.classList.toggle('active', this.linkEmphasisEnabled);
            }
        }

        resetPluginStyles() {
            this.wrapper.style.cssText = `
                font-size: 16px !important;
                font-weight: normal !important;
                letter-spacing: normal !important;
                line-height: normal !important;
                background-color: transparent !important;
                color: inherit !important;
            `;
        }
    }

    // Initialize the plugin
    document.addEventListener('DOMContentLoaded', () => {
        new AccessibilityPlugin();
    });
})();