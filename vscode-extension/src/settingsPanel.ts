import * as vscode from 'vscode';

export class PowerPlaySettingsPanel {
  public static currentPanel: PowerPlaySettingsPanel | undefined;
  private readonly panel: vscode.WebviewPanel;
  private readonly extensionUri: vscode.Uri;
  private disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (PowerPlaySettingsPanel.currentPanel) {
      PowerPlaySettingsPanel.currentPanel.panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'powerplaySettings',
      '⚙️ PowerPlay Settings',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, 'media'),
        ],
      }
    );

    PowerPlaySettingsPanel.currentPanel = new PowerPlaySettingsPanel(panel, extensionUri);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this.panel = panel;
    this.extensionUri = extensionUri;

    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    this.panel.webview.onDidReceiveMessage(
      (message) => this.handleMessage(message),
      null,
      this.disposables
    );

    this.panel.webview.html = this.getWebviewContent(this.panel.webview);
  }

  private async handleMessage(message: any) {
    const config = vscode.workspace.getConfiguration('powerplay');

    switch (message.command) {
      case 'getSetting':
        const value = config.get(message.setting);
        this.panel.webview.postMessage({
          type: 'settingValue',
          setting: message.setting,
          value,
        });
        break;

      case 'updateSetting':
        await config.update(message.setting, message.value, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(
          `✅ PowerPlay: ${message.label} updated`
        );
        break;

      case 'openSettings':
        await vscode.commands.executeCommand('workbench.action.openSettings', '@ext:SmartWorkz.powerplay-ai');
        break;

      case 'openConfigFile':
        const configPath = config.get<string>('configPath') || 'config.yaml';
        const uri = vscode.Uri.file(configPath);
        await vscode.window.showTextDocument(uri);
        break;
    }
  }

  private getWebviewContent(webview: vscode.Webview): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PowerPlay Settings</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          :root {
            --color-bg: #0a0e27;
            --color-surface: #13192c;
            --color-surface-alt: #1a2447;
            --color-accent: #00d9ff;
            --color-accent-dark: #00a8cc;
            --color-text: #e0e6ff;
            --color-text-muted: #8892b0;
            --color-success: #00d962;
            --color-warning: #ffa500;
            --color-error: #ff6b6b;
            --radius: 12px;
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          body {
            background: linear-gradient(135deg, var(--color-bg) 0%, #0f1429 100%);
            color: var(--color-text);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            overflow-y: auto;
            background-attachment: fixed;
          }

          /* Scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: var(--color-accent);
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: var(--color-accent-dark);
          }

          .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 24px;
          }

          /* Header */
          .header {
            margin-bottom: 40px;
            border-bottom: 2px solid var(--color-surface-alt);
            padding-bottom: 24px;
          }

          .header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            background: linear-gradient(135deg, var(--color-accent) 0%, #00a8cc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.5px;
          }

          .header p {
            color: var(--color-text-muted);
            font-size: 13px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }

          /* Section */
          .section {
            margin-bottom: 32px;
            padding: 24px;
            background: var(--color-surface);
            border-radius: var(--radius);
            border: 1px solid var(--color-surface-alt);
            transition: var(--transition);
          }

          .section:hover {
            border-color: var(--color-accent);
            background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-alt) 100%);
          }

          .section-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 20px;
            color: var(--color-accent);
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .section-title::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 4px;
            background: var(--color-accent);
            border-radius: 50%;
          }

          /* Form Groups */
          .form-group {
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
          }

          .form-group:last-child {
            margin-bottom: 0;
          }

          .form-label {
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--color-text);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .form-help {
            font-size: 12px;
            color: var(--color-text-muted);
            margin-top: 4px;
            font-style: italic;
          }

          /* Input & Select */
          input[type="text"],
          input[type="url"],
          input[type="password"],
          input[type="number"],
          select,
          textarea {
            background: var(--color-bg);
            color: var(--color-text);
            border: 1px solid var(--color-surface-alt);
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 13px;
            font-family: 'Fira Code', monospace;
            transition: var(--transition);
          }

          input[type="text"]:focus,
          input[type="url"]:focus,
          input[type="password"]:focus,
          input[type="number"]:focus,
          select:focus,
          textarea:focus {
            outline: none;
            border-color: var(--color-accent);
            background: var(--color-surface-alt);
            box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
          }

          /* Toggle Switch */
          .toggle-switch {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-top: 8px;
          }

          .switch {
            position: relative;
            width: 48px;
            height: 28px;
            background: var(--color-surface-alt);
            border-radius: 14px;
            cursor: pointer;
            transition: var(--transition);
            border: 1px solid var(--color-surface-alt);
          }

          .switch input {
            display: none;
          }

          .switch input:checked + .slider {
            background: var(--color-success);
            border-color: var(--color-success);
          }

          .switch input:checked + .slider::after {
            transform: translateX(20px);
          }

          .slider {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--color-surface-alt);
            border-radius: 14px;
            transition: var(--transition);
            border: 1px solid var(--color-surface-alt);
          }

          .slider::after {
            content: '';
            position: absolute;
            top: 3px;
            left: 3px;
            width: 22px;
            height: 22px;
            background: white;
            border-radius: 50%;
            transition: var(--transition);
          }

          /* Buttons */
          .button-group {
            display: flex;
            gap: 12px;
            margin-top: 16px;
            flex-wrap: wrap;
          }

          button {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .btn-primary {
            background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%);
            color: #000;
          }

          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 217, 255, 0.3);
          }

          .btn-secondary {
            background: var(--color-surface-alt);
            color: var(--color-text);
            border: 1px solid var(--color-accent);
          }

          .btn-secondary:hover {
            background: var(--color-accent);
            color: #000;
          }

          .btn-danger {
            background: var(--color-error);
            color: white;
          }

          .btn-danger:hover {
            opacity: 0.9;
            box-shadow: 0 8px 24px rgba(255, 107, 107, 0.3);
          }

          /* Status Badge */
          .status {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .status.connected {
            background: rgba(0, 217, 50, 0.2);
            color: var(--color-success);
            border: 1px solid var(--color-success);
          }

          .status.disconnected {
            background: rgba(255, 107, 107, 0.2);
            color: var(--color-error);
            border: 1px solid var(--color-error);
          }

          .status::before {
            content: '';
            display: inline-block;
            width: 6px;
            height: 6px;
            background: currentColor;
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }

          /* Model Selection Grid */
          .model-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
            margin-top: 12px;
          }

          .model-card {
            padding: 16px;
            background: var(--color-bg);
            border: 2px solid var(--color-surface-alt);
            border-radius: 8px;
            cursor: pointer;
            transition: var(--transition);
            text-align: center;
          }

          .model-card:hover {
            border-color: var(--color-accent);
            background: var(--color-surface-alt);
          }

          .model-card input[type="radio"] {
            display: none;
          }

          .model-card input[type="radio"]:checked + label {
            color: var(--color-accent);
          }

          .model-card input[type="radio"]:checked {
            border-color: var(--color-accent);
          }

          .model-name {
            font-weight: 600;
            margin-bottom: 4px;
          }

          .model-type {
            font-size: 11px;
            color: var(--color-text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          /* Info Box */
          .info-box {
            padding: 16px;
            background: rgba(0, 217, 255, 0.05);
            border-left: 4px solid var(--color-accent);
            border-radius: 0 8px 8px 0;
            margin-bottom: 16px;
            font-size: 13px;
          }

          .info-box strong {
            color: var(--color-accent);
          }

          /* Settings Groups */
          .settings-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }

          @media (max-width: 768px) {
            .settings-group {
              grid-template-columns: 1fr;
            }
          }

          /* Footer */
          .footer {
            margin-top: 40px;
            padding-top: 24px;
            border-top: 1px solid var(--color-surface-alt);
            text-align: center;
            font-size: 12px;
            color: var(--color-text-muted);
          }

          .footer a {
            color: var(--color-accent);
            text-decoration: none;
            transition: var(--transition);
          }

          .footer a:hover {
            text-decoration: underline;
          }

          /* Loading */
          .loading {
            display: inline-block;
            width: 4px;
            height: 4px;
            background: var(--color-accent);
            border-radius: 50%;
            animation: blink 1.4s infinite;
          }

          .loading::after {
            content: '';
            display: inline-block;
            width: 4px;
            height: 4px;
            background: var(--color-accent);
            border-radius: 50%;
            margin-left: 4px;
            animation: blink 1.4s infinite 0.2s;
          }

          .loading::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 4px;
            background: var(--color-accent);
            border-radius: 50%;
            margin-right: 4px;
            animation: blink 1.4s infinite 0.4s;
          }

          @keyframes blink {
            0%, 60%, 100% { opacity: 0.3; }
            30% { opacity: 1; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>⚡ PowerPlay Settings</h1>
            <p>Configure your AI orchestration environment</p>
          </div>

          <!-- Models Section -->
          <div class="section">
            <div class="section-title">🤖 Default Models</div>
            <div class="info-box">
              <strong>Pro Tip:</strong> Set your preferred models for different tasks. PowerPlay will route requests to the best model for the job.
            </div>

            <div class="settings-group">
              <div class="form-group">
                <label class="form-label">🧠 Reasoning Model</label>
                <div class="model-grid">
                  <div class="model-card">
                    <input type="radio" id="model-opus" name="reasoning" value="claude-opus-4-6" />
                    <label for="model-opus">
                      <div class="model-name">Claude Opus</div>
                      <div class="model-type">Best for Complex Tasks</div>
                    </label>
                  </div>
                  <div class="model-card">
                    <input type="radio" id="model-sonnet" name="reasoning" value="claude-sonnet-4-6" />
                    <label for="model-sonnet">
                      <div class="model-name">Claude Sonnet</div>
                      <div class="model-type">Fast & Capable</div>
                    </label>
                  </div>
                  <div class="model-card">
                    <input type="radio" id="model-haiku" name="reasoning" value="claude-haiku-4-5" />
                    <label for="model-haiku">
                      <div class="model-name">Claude Haiku</div>
                      <div class="model-type">Quick & Efficient</div>
                    </label>
                  </div>
                </div>
                <div class="form-help">Selected for /review, /architecture, /security-agent</div>
              </div>

              <div class="form-group">
                <label class="form-label">⚡ Fast Model</label>
                <div class="model-grid">
                  <div class="model-card">
                    <input type="radio" id="fast-sonnet" name="fast" value="claude-sonnet-4-6" />
                    <label for="fast-sonnet">
                      <div class="model-name">Claude Sonnet</div>
                      <div class="model-type">Default</div>
                    </label>
                  </div>
                  <div class="model-card">
                    <input type="radio" id="fast-haiku" name="fast" value="claude-haiku-4-5" />
                    <label for="fast-haiku">
                      <div class="model-name">Claude Haiku</div>
                      <div class="model-type">Fastest</div>
                    </label>
                  </div>
                </div>
                <div class="form-help">Used for /quick-fix, /inline-review, fast decisions</div>
              </div>
            </div>
          </div>

          <!-- API Configuration Section -->
          <div class="section">
            <div class="section-title">🔑 API Configuration</div>

            <div class="form-group">
              <label class="form-label">API Provider</label>
              <select id="apiProvider">
                <option value="anthropic">Anthropic (Claude API)</option>
                <option value="openrouter">OpenRouter</option>
                <option value="local">Local (Ollama)</option>
              </select>
              <div class="form-help">Choose your default API provider for model requests</div>
            </div>

            <div class="form-group">
              <label class="form-label">API Key</label>
              <input type="password" id="apiKey" placeholder="sk-ant-..." />
              <div class="form-help">Your Anthropic API key. Never shared or stored publicly.</div>
              <div class="button-group">
                <button class="btn-secondary" onclick="testApiKey()">🔗 Test Connection</button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Base URL (for OpenRouter/Local)</label>
              <input type="url" id="baseUrl" placeholder="https://api.openrouter.ai/api/v1" />
              <div class="form-help">Leave empty for Anthropic API. Required for OpenRouter or local Ollama.</div>
            </div>
          </div>

          <!-- PowerPlay Config Section -->
          <div class="section">
            <div class="section-title">📋 PowerPlay Configuration</div>

            <div class="form-group">
              <label class="form-label">Config File Path</label>
              <input type="text" id="configPath" placeholder="s:/Code101/PowerPlay/config.yaml" />
              <div class="form-help">Path to your PowerPlay config.yaml with all prompts and rules</div>
              <div class="button-group">
                <button class="btn-secondary" onclick="openConfigFile()">📂 Open File</button>
                <button class="btn-secondary" onclick="reloadConfig()">🔄 Reload</button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Status</label>
              <div class="toggle-switch">
                <div class="status connected">
                  <span>✓ Connected</span>
                </div>
                <span id="promptCount">Loading...</span>
              </div>
            </div>
          </div>

          <!-- Agent Configuration Section -->
          <div class="section">
            <div class="section-title">🎯 Agent Configuration</div>

            <div class="settings-group">
              <div class="form-group">
                <label class="form-label">Max Iterations per Agent</label>
                <input type="number" id="maxIterations" value="5" min="1" max="20" />
                <div class="form-help">Maximum steps an agent can take before stopping</div>
              </div>

              <div class="form-group">
                <label class="form-label">Timeout (seconds)</label>
                <input type="number" id="timeout" value="300" min="30" max="3600" />
                <div class="form-help">Maximum time for agent execution</div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Enable Parallel Execution</label>
              <div class="toggle-switch">
                <label class="switch">
                  <input type="checkbox" id="parallelExecution" checked />
                  <span class="slider"></span>
                </label>
                <span>Run independent agents concurrently (v3.9.0+)</span>
              </div>
              <div class="form-help">Automatically parallelizes independent tasks for faster execution</div>
            </div>

            <div class="form-group">
              <label class="form-label">Enable Caching</label>
              <div class="toggle-switch">
                <label class="switch">
                  <input type="checkbox" id="caching" checked />
                  <span class="slider"></span>
                </label>
                <span>Cache agent responses for identical inputs</span>
              </div>
              <div class="form-help">Reuse results from previous executions (faster, cheaper)</div>
            </div>
          </div>

          <!-- Advanced Settings Section -->
          <div class="section">
            <div class="section-title">⚙️ Advanced Settings</div>

            <div class="form-group">
              <label class="form-label">Temperature</label>
              <input type="number" id="temperature" value="0.7" min="0" max="2" step="0.1" />
              <div class="form-help">
                0 = Deterministic | 0.7 = Balanced (recommended) | 2 = Creative
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Max Tokens</label>
              <input type="number" id="maxTokens" value="4096" min="256" max="8192" step="256" />
              <div class="form-help">Maximum tokens per response. Higher = longer responses</div>
            </div>

            <div class="form-group">
              <label class="form-label">Debug Mode</label>
              <div class="toggle-switch">
                <label class="switch">
                  <input type="checkbox" id="debugMode" />
                  <span class="slider"></span>
                </label>
                <span>Show detailed logs and intermediate steps</span>
              </div>
              <div class="form-help">Useful for troubleshooting and understanding agent decisions</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="section">
            <div class="button-group">
              <button class="btn-primary" onclick="saveAllSettings()">💾 Save All Settings</button>
              <button class="btn-secondary" onclick="resetDefaults()">↺ Reset to Defaults</button>
              <button class="btn-secondary" onclick="exportSettings()">⬇️ Export Settings</button>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>⚡ PowerPlay v3.9.0 | <a href="#">Documentation</a> | <a href="#">Support</a></p>
            <p>Settings are saved to VS Code's global configuration</p>
          </div>
        </div>

        <script>
          const vscode = acquireVsCodeApi();

          // Load current settings
          function loadSettings() {
            // These would be fetched from VS Code config
            document.getElementById('configPath').value = 's:/Code101/PowerPlay/config.yaml';
            document.getElementById('temperature').value = '0.7';
            document.getElementById('maxTokens').value = '4096';
            document.getElementById('maxIterations').value = '5';
            document.getElementById('timeout').value = '300';
          }

          function saveAllSettings() {
            vscode.postMessage({
              command: 'updateSetting',
              setting: 'configPath',
              value: document.getElementById('configPath').value,
              label: 'Config Path'
            });

            vscode.postMessage({
              command: 'updateSetting',
              setting: 'temperature',
              value: parseFloat(document.getElementById('temperature').value),
              label: 'Temperature'
            });

            vscode.postMessage({
              command: 'updateSetting',
              setting: 'maxTokens',
              value: parseInt(document.getElementById('maxTokens').value),
              label: 'Max Tokens'
            });
          }

          function testApiKey() {
            const apiKey = document.getElementById('apiKey').value;
            if (!apiKey) {
              alert('Please enter an API key');
              return;
            }
            vscode.postMessage({
              command: 'testApiKey',
              apiKey: apiKey
            });
          }

          function openConfigFile() {
            vscode.postMessage({
              command: 'openConfigFile'
            });
          }

          function reloadConfig() {
            vscode.postMessage({
              command: 'reloadConfig'
            });
          }

          function resetDefaults() {
            if (confirm('Reset all settings to defaults?')) {
              vscode.postMessage({
                command: 'resetDefaults'
              });
            }
          }

          function exportSettings() {
            vscode.postMessage({
              command: 'exportSettings'
            });
          }

          // Initialize
          loadSettings();
        </script>
      </body>
      </html>
    `;
  }

  public dispose() {
    PowerPlaySettingsPanel.currentPanel = undefined;
    this.panel.dispose();

    while (this.disposables.length) {
      const disposable = this.disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}
