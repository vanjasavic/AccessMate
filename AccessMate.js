(function() {
    const styles = `
        #accessibility-wrapper {
            position: fixed;
            bottom: 24px;
            right: 24px;
            font-family: system-ui, -apple-system, sans-serif;
            z-index: 1000;
        }
        
        #accessibility-toggle {
            background-color: #ffffff;
            color: #1F2937;
            border: none;
            width: 56px;
            height: 56px;
            border-radius: 28px;
            cursor: pointer;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            transition: transform 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        #accessibility-toggle:hover {
            transform: scale(1.05);
        }
        
        #accessibility-toggle img {
            height: 32px;
            width: 32px;
        }
        
        #accessibility-panel {
            background-color: white;
            border-radius: 12px;
            padding: 20px;
            width: 300px;
            position: absolute;
            bottom: 70px;
            right: 0;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            transition: opacity 0.2s, transform 0.2s;
        }
        
        #accessibility-panel[hidden] {
            opacity: 0;
            transform: translateY(10px);
            pointer-events: none;
        }
        
        #accessibility-panel h4 {
            margin: 0 0 16px 0;
            color: #1F2937;
            font-size: 18px;
            font-weight: 600;
        }
        
        .control {
            margin-bottom: 20px;
        }
        
        .control label {
            display: block;
            margin-bottom: 8px;
            color: #4B5563;
            font-size: 14px;
            font-weight: 500;
        }
        
        .button-group {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        
        .preset-button {
            background-color: #F3F4F6;
            border: 1px solid #E5E7EB;
            color: #374151;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        }
        
        .preset-button:hover {
            background-color: #E5E7EB;
        }
        
        .preset-button.active {
            background-color: #4F46E5;
            border-color: #4F46E5;
            color: white;
        }
        
        #emphasize-links {
            width: 100%;
            background-color: #F3F4F6;
            border: 1px solid #E5E7EB;
            color: #374151;
            padding: 10px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        }
        
        #emphasize-links.active {
            background-color: #4F46E5;
            border-color: #4F46E5;
            color: white;
        }

        .reset-button {
            width: 100%;
            background-color: #DC2626;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        }

        .reset-button:hover {
            background-color: #B91C1C;
        }

        #accessibility-panel h4 {
            margin: 0 0 20px 0;
            color: #1F2937;
            font-size: 18px;
            font-weight: 600;
            padding-bottom: 12px;
            border-bottom: 2px solid #E5E7EB;
        }
    `;

    const html = `
        <div id="accessibility-wrapper">
            <button id="accessibility-toggle">
                <img class="logo" src="https://raw.githubusercontent.com/vanjasavic/AccessMate/main/logo.png">
            </button>
            <div id="accessibility-panel" hidden>
                <h4>Prilagodba pristupačnosti</h4>
                
                <div class="control">
                    <label>Veličina slova</label>
                    <div class="button-group">
                        <button class="preset-button" data-size="14">Malo</button>
                        <button class="preset-button active" data-size="16">Normalno</button>
                        <button class="preset-button" data-size="18">Veliko</button>
                        <button class="preset-button" data-size="20">Vrlo veliko</button>
                    </div>
                </div>

                <div class="control">
                    <label>Debljina teksta</label>
                    <div class="button-group">
                        <button class="preset-button" data-weight="300">Tanko</button>
                        <button class="preset-button active" data-weight="400">Normalno</button>
                        <button class="preset-button" data-weight="600">Podebljano</button>
                    </div>
                </div>

                <div class="control">
                    <label>Tema</label>
                    <div class="button-group">
                        <button class="preset-button active" data-theme="light">Svjetla</button>
                        <button class="preset-button" data-theme="dark">Tamna</button>
                        <button class="preset-button" data-theme="sepia">Sepija</button>
                        <button class="preset-button" data-theme="blue">Plava</button>
                        <button class="preset-button" data-theme="green">Zelena</button>
                        <button class="preset-button" data-theme="high-contrast">Visoki kontrast</button>
                    </div>
                </div>

                <div class="control">
                    <button id="emphasize-links">Naglašeni linkovi: Isključeno</button>
                </div>

                <div class="control">
                    <button id="reset-settings" class="reset-button">Vrati na zadano</button>
                </div>

            </div>
        </div>
    `;

    class AccessibilityPlugin {
        constructor() {
            this.injectStyles();
            this.injectHTML();
            this.initializeElements();
            this.loadSavedSettings();
            this.initializeEventListeners();
        }

        injectStyles() {
            const styleElement = document.createElement('style');
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);
        }

        injectHTML() {
            const wrapperElement = document.createElement('div');
            wrapperElement.innerHTML = html;
            document.body.appendChild(wrapperElement.firstElementChild);
        }

        initializeElements() {
            this.wrapper = document.getElementById('accessibility-wrapper');
            this.panel = document.getElementById('accessibility-panel');
            this.toggle = document.getElementById('accessibility-toggle');
            this.linkEmphasisButton = document.getElementById('emphasize-links');
            this.settings = {
                fontSize: '16',
                fontWeight: '400',
                theme: 'light',
                emphasizeLinks: false
            };
        }

        loadSavedSettings() {
            const savedSettings = localStorage.getItem('accessibilitySettings');
            if (savedSettings) {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
                this.applySettings();
            }
        }

        saveSettings() {
            localStorage.setItem('accessibilitySettings', JSON.stringify(this.settings));
        }

        initializeEventListeners() {
            this.toggle.addEventListener('click', () => this.togglePanel());
            
            document.querySelectorAll('.preset-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const target = e.target;
                    if (target.dataset.size) this.handleFontSize(target);
                    if (target.dataset.weight) this.handleFontWeight(target);
                    if (target.dataset.theme) this.handleTheme(target);
                });
            });

            this.linkEmphasisButton.addEventListener('click', () => this.toggleLinkEmphasis());

            document.getElementById('reset-settings').addEventListener('click', () => this.resetSettings());

        }

        updateUIState() {
            // Update active states of all buttons
            document.querySelectorAll('.preset-button').forEach(button => {
                button.classList.remove('active');
                if ((button.dataset.size === this.settings.fontSize) ||
                    (button.dataset.weight === this.settings.fontWeight) ||
                    (button.dataset.theme === this.settings.theme)) {
                    button.classList.add('active');
                }
            });
            
            this.linkEmphasisButton.classList.toggle('active', this.settings.emphasizeLinks);
            this.linkEmphasisButton.textContent = `Naglašeni linkovi: ${this.settings.emphasizeLinks ? 'Uključeno' : 'Isključeno'}`;
        }

        resetSettings() {
            this.settings = {
                fontSize: '16',
                fontWeight: '400',
                theme: 'light',
                emphasizeLinks: false
            };
            this.applySettings();
            this.saveSettings();
            this.updateUIState();
        }

        togglePanel() {
            this.panel.hidden = !this.panel.hidden;
        }

        handleFontSize(button) {
            this.updateButtonGroup(button);
            this.settings.fontSize = button.dataset.size;
            document.body.style.fontSize = `${this.settings.fontSize}px`;
            this.saveSettings();
        }

        handleFontWeight(button) {
            this.updateButtonGroup(button);
            this.settings.fontWeight = button.dataset.weight;
            document.body.style.fontWeight = this.settings.fontWeight;
            this.saveSettings();
        }

        handleTheme(button) {
            this.updateButtonGroup(button);
            this.settings.theme = button.dataset.theme;
            this.applyTheme();
            this.saveSettings();
        }

        applyTheme() {
            const themes = {
                light: { bg: 'white', text: '#1F2937' },
                dark: { bg: '#1F2937', text: 'white' },
                sepia: { bg: '#F9F5EB', text: '#433422' },
                blue: { bg: '#EFF6FF', text: '#1E40AF' },
                green: { bg: '#F0FDF4', text: '#166534' },
                'high-contrast': { bg: 'black', text: 'white' }
            };
            
            const theme = themes[this.settings.theme];
            document.body.style.backgroundColor = theme.bg;
            document.body.style.color = theme.text;
        }

        toggleLinkEmphasis() {
            this.settings.emphasizeLinks = !this.settings.emphasizeLinks;
            this.linkEmphasisButton.classList.toggle('active', this.settings.emphasizeLinks);
            this.linkEmphasisButton.textContent = `Naglašeni linkovi: ${this.settings.emphasizeLinks ? 'Uključeno' : 'Isključeno'}`;
            this.emphasizeLinks();
            this.saveSettings();
        }

        emphasizeLinks() {
            const links = document.getElementsByTagName('a');
            for (let link of links) {
                if (!this.wrapper.contains(link)) {
                    link.style.textDecoration = this.settings.emphasizeLinks ? 'underline' : '';
                    link.style.fontWeight = this.settings.emphasizeLinks ? 'bold' : '';
                }
            }
        }

        updateButtonGroup(clickedButton) {
            clickedButton.parentElement.querySelectorAll('.preset-button').forEach(button => {
                button.classList.remove('active');
            });
            clickedButton.classList.add('active');
        }

        applySettings() {
            document.body.style.fontSize = `${this.settings.fontSize}px`;
            document.body.style.fontWeight = this.settings.fontWeight;
            this.applyTheme();
            if (this.settings.emphasizeLinks) {
                this.linkEmphasisButton.classList.add('active');
                this.emphasizeLinks();
            }
        }



        
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new AccessibilityPlugin());
    } else {
        new AccessibilityPlugin();
    }
})();