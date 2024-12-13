(function() {
    const ACCESSIBILITY_ICON = `<img 
        class="logo" 
        src="https://raw.githubusercontent.com/vanjasavic/AccessMate/main/logo.png" 
        alt="Accessibility Controls" 
        onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxwYXRoIGQ9Ik0xMiA4djgiLz48cGF0aCBkPSJNOCAxMmg4Ii8+PC9zdmc+'" 
        crossorigin="anonymous" 
        referrerpolicy="no-referrer" 
        loading="lazy"
    >`;

    class AccessibilityPlugin {
        constructor() {
            this.settings = {
                fontSize: '16',
                fontWeight: '400',
                theme: 'light',
                emphasizeLinks: false
            };

            this.ALLOWED_SIZES = ['14', '16', '18', '20'];
            this.ALLOWED_WEIGHTS = ['300', '400', '600'];
            this.ALLOWED_THEMES = ['light', 'dark', 'sepia', 'blue', 'green', 'high-contrast'];

            this.handleKeyPress = this.handleKeyPress.bind(this);
            this.handleClickOutside = this.handleClickOutside.bind(this);

            this.init();
        }

        async init() {
            try {
                if (window.top !== window.self) {
                    throw new Error('This plugin cannot run in an iframe');
                }

                this.injectStyles();
                this.createDOM();
                this.initializeElements();
                await this.loadSavedSettings();
                this.initializeEventListeners();
            } catch (error) {
                console.error('Failed to initialize accessibility plugin:', error);
            }
        }

        injectStyles() {
            const styleElement = document.createElement('style');
            const styleId = 'accessibility-styles-' + Math.random().toString(36).substr(2, 9);
            styleElement.id = styleId;
            
            styleElement.textContent = `
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
                
                #accessibility-toggle img.logo {
                    height: 32px;
                    width: 32px;
                    object-fit: contain;
                }
                
                #accessibility-toggle img.logo[src^="data:image"] {
                    filter: invert(25%);
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
                    margin: 0 0 20px 0;
                    color: #1F2937;
                    font-size: 18px;
                    font-weight: 600;
                    padding-bottom: 12px;
                    border-bottom: 2px solid #E5E7EB;
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
            `;
            
            document.head.appendChild(styleElement);
        }

        createDOM() {
            this.wrapper = document.createElement('div');
            this.wrapper.id = 'accessibility-wrapper';

            this.toggle = document.createElement('button');
            this.toggle.id = 'accessibility-toggle';
            this.toggle.setAttribute('aria-label', 'Toggle accessibility settings');
            
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'accessibility-icon';
            iconWrapper.innerHTML = ACCESSIBILITY_ICON;
            this.toggle.appendChild(iconWrapper);

            this.panel = document.createElement('div');
            this.panel.id = 'accessibility-panel';
            this.panel.setAttribute('role', 'dialog');
            this.panel.setAttribute('aria-label', 'Accessibility settings');
            this.panel.hidden = true;

            const header = document.createElement('h4');
            header.textContent = 'Prilagodba pristupačnosti';
            this.panel.appendChild(header);

            this.panel.appendChild(this.createControl(
                'Veličina slova',
                [
                    { text: 'Malo', data: { size: '14' } },
                    { text: 'Normalno', data: { size: '16' }, active: true },
                    { text: 'Veliko', data: { size: '18' } },
                    { text: 'Vrlo veliko', data: { size: '20' } }
                ]
            ));

            this.panel.appendChild(this.createControl(
                'Debljina teksta',
                [
                    { text: 'Tanko', data: { weight: '300' } },
                    { text: 'Normalno', data: { weight: '400' }, active: true },
                    { text: 'Podebljano', data: { weight: '600' } }
                ]
            ));

            this.panel.appendChild(this.createControl(
                'Tema',
                [
                    { text: 'Svjetla', data: { theme: 'light' }, active: true },
                    { text: 'Tamna', data: { theme: 'dark' } },
                    { text: 'Sepija', data: { theme: 'sepia' } },
                    { text: 'Plava', data: { theme: 'blue' } },
                    { text: 'Zelena', data: { theme: 'green' } },
                    { text: 'Visoki kontrast', data: { theme: 'high-contrast' } }
                ]
            ));

            const linkControl = document.createElement('div');
            linkControl.className = 'control';
            this.linkEmphasisButton = document.createElement('button');
            this.linkEmphasisButton.id = 'emphasize-links';
            this.linkEmphasisButton.textContent = 'Naglašeni linkovi: Isključeno';
            linkControl.appendChild(this.linkEmphasisButton);
            this.panel.appendChild(linkControl);

            const resetControl = document.createElement('div');
            resetControl.className = 'control';
            const resetButton = document.createElement('button');
            resetButton.id = 'reset-settings';
            resetButton.className = 'reset-button';
            resetButton.textContent = 'Vrati na zadano';
            resetControl.appendChild(resetButton);
            this.panel.appendChild(resetControl);

            this.wrapper.appendChild(this.toggle);
            this.wrapper.appendChild(this.panel);
            document.body.appendChild(this.wrapper);
        }

        createControl(labelText, buttons) {
            const control = document.createElement('div');
            control.className = 'control';
            
            const label = document.createElement('label');
            label.textContent = labelText;
            control.appendChild(label);
            
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'button-group';
            
            buttons.forEach(buttonConfig => {
                const button = document.createElement('button');
                button.className = 'preset-button' + (buttonConfig.active ? ' active' : '');
                button.textContent = buttonConfig.text;
                Object.entries(buttonConfig.data).forEach(([key, value]) => {
                    button.dataset[key] = value;
                });
                buttonGroup.appendChild(button);
            });
            
            control.appendChild(buttonGroup);
            return control;
        }

        initializeElements() {
            this.wrapper = document.getElementById('accessibility-wrapper');
            this.panel = document.getElementById('accessibility-panel');
            this.toggle = document.getElementById('accessibility-toggle');
            this.linkEmphasisButton = document.getElementById('emphasize-links');
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
            
            document.addEventListener('keydown', this.handleKeyPress);
            document.addEventListener('click', this.handleClickOutside);
        }

        handleKeyPress(e) {
            if (e.key === 'Escape' && !this.panel.hidden) {
                this.togglePanel();
            }
        }

        handleClickOutside(e) {
            if (!this.panel.hidden && !this.wrapper.contains(e.target)) {
                this.togglePanel();
            }
        }

        togglePanel() {
            this.panel.hidden = !this.panel.hidden;
            this.toggle.setAttribute('aria-expanded', !this.panel.hidden);
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
            this.updateUIState();
        }

        updateUIState() {
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

        async loadSavedSettings() {
            try {
                const savedSettings = localStorage.getItem('accessibilitySettings');
                if (savedSettings) {
                    const parsed = JSON.parse(savedSettings);
                    const validated = this.validateSettings(parsed);
                    this.settings = { ...this.settings, ...validated };
                    this.applySettings();
                }
            } catch (error) {
                console.warn('Failed to load accessibility settings:', error);
                this.resetSettings();
            }
        }

        validateSettings(settings) {
            return {
                fontSize: this.ALLOWED_SIZES.includes(settings.fontSize) ? settings.fontSize : '16',
                fontWeight: this.ALLOWED_WEIGHTS.includes(settings.fontWeight) ? settings.fontWeight : '400',
                theme: this.ALLOWED_THEMES.includes(settings.theme) ? settings.theme : 'light',
                emphasizeLinks: typeof settings.emphasizeLinks === 'boolean' ? settings.emphasizeLinks : false
            };
        }

        saveSettings() {
            try {
                localStorage.setItem('accessibilitySettings', JSON.stringify(this.settings));
            } catch (error) {
                console.warn('Failed to save accessibility settings:', error);
            }
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

        destroy() {
            document.removeEventListener('keydown', this.handleKeyPress);
            document.removeEventListener('click', this.handleClickOutside);
            this.wrapper.remove();
            const styleElement = document.getElementById('accessibility-styles');
            if (styleElement) {
                styleElement.remove();
            }
        }
    }

    // Initialize the plugin
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new AccessibilityPlugin());
    } else {
        new AccessibilityPlugin();
    }
})();