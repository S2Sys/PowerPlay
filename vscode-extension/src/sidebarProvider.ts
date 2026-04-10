import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { parsePrompts, getConfigPath, PowerPlayPrompt } from './configParser';

export class PowerPlaySidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'powerplay.sidebar';

  private view?: vscode.WebviewView;
  private prompts: PowerPlayPrompt[] = [];

  constructor(private extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.extensionUri, 'media'),
        vscode.Uri.joinPath(this.extensionUri, 'out'),
      ],
    };

    webviewView.webview.html = this.getHtmlContent(webviewView.webview);

    // Load prompts from config
    this.refreshPrompts();

    // Listen for messages from webview
    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.type) {
        case 'requestPrompts':
          this.sendPromptsToWebview();
          break;

        case 'insertCommand':
          this.handleInsertCommand(message.command);
          break;

        case 'reloadConfig':
          this.refreshPrompts();
          break;
      }
    });

    // Watch for config.yaml changes
    const configPath = this.getConfigPath();
    if (configPath) {
      const watcher = vscode.workspace.createFileSystemWatcher(
        new vscode.RelativePattern(vscode.workspace.workspaceFolders?.[0] ?? vscode.Uri.file('/'), '**/config.yaml')
      );

      watcher.onDidChange(() => {
        this.refreshPrompts();
      });

      // Store watcher in subscriptions (would be done by extension.ts)
    }
  }

  private refreshPrompts(): void {
    const configPath = this.getConfigPath();
    if (!configPath) {
      return;
    }

    try {
      this.prompts = parsePrompts(configPath);
      this.sendPromptsToWebview();
    } catch (error) {
      console.error('Failed to load prompts:', error);
    }
  }

  private sendPromptsToWebview(): void {
    if (!this.view) {
      return;
    }

    this.view.webview.postMessage({
      type: 'promptsLoaded',
      prompts: this.prompts,
    });
  }

  private handleInsertCommand(command: string): void {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      // If editor is active, insert the command at cursor
      editor.edit((editBuilder) => {
        editBuilder.insert(editor.selection.active, `${command}\n`);
      });
    } else {
      // Otherwise, copy to clipboard
      vscode.env.clipboard.writeText(command).then(() => {
        vscode.window.showInformationMessage(`Copied \`${command}\` to clipboard`);
      });
    }
  }

  private getConfigPath(): string | undefined {
    const configPathSetting = vscode.workspace.getConfiguration('powerplay').get<string>('configPath');
    return getConfigPath(configPathSetting || '', vscode.workspace.workspaceFolders);
  }

  private getHtmlContent(webview: vscode.Webview): string {
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', 'sidebar.css'));
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', 'sidebar.js'));

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PowerPlay Prompts</title>
  <link rel="stylesheet" href="${styleUri}">
</head>
<body>
  <div class="header">
    <span class="logo">⚡ PowerPlay</span>
    <span class="version">v3.9.0</span>
  </div>

  <div class="search-container">
    <input
      type="text"
      id="search"
      class="search-input"
      placeholder="Search commands..."
      aria-label="Search prompts"
    />
  </div>

  <div class="categories-container">
    <div id="categories" class="categories">
      <!-- Populated by sidebar.js -->
    </div>
    <div id="no-results" class="no-results" style="display: none;">
      <p>No prompts found matching your search.</p>
    </div>
  </div>

  <div class="footer">
    <button id="reload" class="reload-btn" title="Reload config.yaml">
      ↺ Reload Config
    </button>
  </div>

  <script src="${scriptUri}"></script>
</body>
</html>`;
  }
}
