import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { parsePrompts, PowerPlayPrompt } from './configParser';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: number;
}

export class PowerPlayChatPanel {
  public static currentPanel: PowerPlayChatPanel | undefined;
  public static readonly viewType = 'powerplayChatPanel';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  private _prompts: PowerPlayPrompt[] = [];
  private _history: ChatMessage[] = [];

  public static createOrShow(extensionUri: vscode.Uri): void {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn! + 1
      : vscode.ViewColumn.Beside;

    if (PowerPlayChatPanel.currentPanel) {
      PowerPlayChatPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      PowerPlayChatPanel.viewType,
      '⚡ PowerPlay Chat',
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')],
      }
    );

    PowerPlayChatPanel.currentPanel = new PowerPlayChatPanel(panel, extensionUri);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    this._loadPrompts();
    this._panel.webview.html = this._getHtmlContent();

    this._panel.webview.onDidReceiveMessage(
      msg => this._handleMessage(msg),
      null,
      this._disposables
    );

    // Reload prompts when panel becomes visible (in case config was just set)
    this._panel.onDidChangeViewState(
      e => {
        if (e.webviewPanel.visible) {
          this._loadPrompts();
          this._panel.webview.postMessage({ type: 'prompts', data: this._prompts });
        }
      },
      null,
      this._disposables
    );

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public refresh(): void {
    this._loadPrompts();
    if (this._panel) {
      this._panel.webview.postMessage({ type: 'prompts', data: this._prompts });
    }
  }

  private _loadPrompts(): void {
    const config = vscode.workspace.getConfiguration('powerplay');
    const configPath = config.get<string>('configPath') || '';
    if (configPath && fs.existsSync(configPath)) {
      this._prompts = parsePrompts(configPath);
    } else {
      this._prompts = [];
    }
  }

  private async _handleMessage(message: any): Promise<void> {
    const config = vscode.workspace.getConfiguration('powerplay');
    switch (message.type) {
      case 'ready':
        this._panel.webview.postMessage({ type: 'prompts', data: this._prompts });
        this._panel.webview.postMessage({ type: 'history', data: this._history });
        break;
      case 'sendMessage':
        this._onUserMessage(message.text);
        break;
      case 'clearHistory':
        this._history = [];
        this._panel.webview.postMessage({ type: 'history', data: [] });
        break;
      case 'loadSettings':
        this._panel.webview.postMessage({
          type: 'settings',
          data: {
            configPath: config.get('configPath'),
            defaultModel: config.get('defaultModel'),
            temperature: config.get('temperature'),
          },
        });
        break;
      case 'saveSettings':
        await config.update('configPath', message.settings.configPath, vscode.ConfigurationTarget.Global);
        await config.update('defaultModel', message.settings.defaultModel, vscode.ConfigurationTarget.Global);
        await config.update('temperature', message.settings.temperature, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage('✅ PowerPlay settings saved');
        this._loadPrompts();
        this._panel.webview.postMessage({ type: 'prompts', data: this._prompts });
        break;
      case 'testConnection':
        await this._testApiConnection(message.apiKey);
        break;
      case 'openConfigFile':
        if (message.path) {
          await vscode.window.showTextDocument(vscode.Uri.file(message.path));
        }
        break;
    }
  }

  private async _testApiConnection(apiKey: string): Promise<void> {
    try {
      const startTime = Date.now();
      const response = await fetch('https://api.anthropic.com/v1/models', {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
      });
      const latency = Date.now() - startTime;

      if (response.ok) {
        vscode.window.showInformationMessage(`✅ API connection successful (${latency}ms)`);
        this._panel.webview.postMessage({ type: 'testResult', success: true, latency });
      } else {
        vscode.window.showErrorMessage(`❌ API connection failed (HTTP ${response.status})`);
        this._panel.webview.postMessage({ type: 'testResult', success: false });
      }
    } catch (error) {
      vscode.window.showErrorMessage(`❌ Connection error: ${error}`);
      this._panel.webview.postMessage({ type: 'testResult', success: false });
    }
  }

  private _onUserMessage(text: string): void {
    // Echo back the slash command hint — real AI integration can be added later
    this._history.push({ role: 'user', text, timestamp: Date.now() });
    const match = this._prompts.find(p => text.trim().startsWith(p.command));
    const reply = match
      ? `**${match.command}** — ${match.description}\n\nPaste this into Continue.dev chat:\n\`\`\`\n${match.command}\n\`\`\``
      : `No PowerPlay command matched. Try typing \`/\` to see all ${this._prompts.length} commands.`;
    this._history.push({ role: 'assistant', text: reply, timestamp: Date.now() });
    this._panel.webview.postMessage({ type: 'history', data: this._history });
  }

  private _getNonce(): string {
    let text = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
  }

  private _getHtmlContent(): string {
    const webview = this._panel.webview;
    const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'chat.css'));
    const jsUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'chat.js'));
    const nonce = this._getNonce();
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${cssUri}">
  <title>PowerPlay Chat</title>
</head>
<body>
  <div id="root">
    <header id="chat-header">
      <div class="header-left">
        <span class="logo-icon">⚡</span>
        <span class="logo-text">PowerPlay</span>
        <span class="badge" id="prompt-count">...</span>
      </div>
      <div class="header-right">
        <button class="icon-btn" id="settings-btn" title="Open settings">⚙</button>
        <button class="icon-btn" id="clear-btn" title="Clear history">↺</button>
      </div>
    </header>
    <div id="settings-panel" class="hidden">
      <div class="settings-content">
        <div class="settings-header">
          <h3>⚙️ Settings</h3>
          <button id="close-settings-btn" class="close-btn">✕</button>
        </div>
        <div class="settings-form">
          <label>Config Path:</label>
          <input type="text" id="config-path" placeholder="s:/Code101/PowerPlay/config.yaml" />
          <button id="open-config-btn" class="btn-primary">📂 Browse</button>

          <label>Default Model:</label>
          <select id="default-model">
            <option value="claude-opus-4-6">Claude Opus 4.6</option>
            <option value="claude-sonnet-4-6">Claude Sonnet 4.6</option>
            <option value="claude-haiku-4-5">Claude Haiku 4.5</option>
          </select>

          <label>API Key:</label>
          <input type="password" id="api-key" placeholder="sk-ant-..." />

          <label>Temperature (0-2):</label>
          <input type="range" id="temperature" min="0" max="2" step="0.1" value="0.7" />
          <span id="temp-value">0.7</span>

          <button id="test-connection-btn" class="btn-secondary">🔗 Test Connection</button>
          <button id="save-settings-btn" class="btn-primary">💾 Save Settings</button>
        </div>
      </div>
    </div>
    <div id="messages"></div>
    <div id="autocomplete" class="hidden"></div>
    <div id="input-area">
      <textarea id="input" placeholder="Type / for commands…" rows="1"></textarea>
      <button id="send-btn">↑</button>
    </div>
  </div>
  <script nonce="${nonce}" src="${jsUri}"><\/script>
</body>
</html>`;
  }

  public dispose(): void {
    PowerPlayChatPanel.currentPanel = undefined;
    this._panel.dispose();
    this._disposables.forEach(d => d.dispose());
    this._disposables = [];
  }
}
