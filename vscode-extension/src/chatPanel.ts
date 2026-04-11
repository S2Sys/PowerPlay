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

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  private _loadPrompts(): void {
    const config = vscode.workspace.getConfiguration('powerplay');
    const configPath = config.get<string>('configPath') || '';
    if (configPath && fs.existsSync(configPath)) {
      this._prompts = parsePrompts(configPath);
    }
  }

  private _handleMessage(message: any): void {
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
        <button class="icon-btn" id="clear-btn" title="Clear history">↺</button>
      </div>
    </header>
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
