import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { parsePrompts, getConfigPath, PowerPlayPrompt } from './configParser';
import { PowerPlaySidebarProvider } from './sidebarProvider';
import { showCommandPicker, insertOrCopyCommand } from './commandPicker';
import { PowerPlaySettingsPanel } from './settingsPanel';

let statusBarItem: vscode.StatusBarItem;
let sidebarProvider: PowerPlaySidebarProvider;
let powerplayVersion = '3.9.0';

export function activate(context: vscode.ExtensionContext) {
  console.log('PowerPlay extension activated');

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'powerplay.showStatus';
  statusBarItem.tooltip = 'PowerPlay AI for Continue.dev';

  // Register sidebar provider
  sidebarProvider = new PowerPlaySidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(PowerPlaySidebarProvider.viewType, sidebarProvider)
  );

  // Update status bar
  updateStatusBar();

  // Register commands
  const showStatusCmd = vscode.commands.registerCommand('powerplay.showStatus', () => {
    vscode.window.showInformationMessage(`PowerPlay v${powerplayVersion} — Active and ready`);
  });

  const openDashboardCmd = vscode.commands.registerCommand('powerplay.openDashboard', () => {
    vscode.window.showInformationMessage('PowerPlay Dashboard: Real-time metrics coming in v1.1');
  });

  const pickCommandCmd = vscode.commands.registerCommand('powerplay.pickCommand', async () => {
    const configPath = getConfigPathUtil();
    if (!configPath || !fs.existsSync(configPath)) {
      vscode.window.showErrorMessage('PowerPlay: config.yaml not found');
      return;
    }

    try {
      const prompts = parsePrompts(configPath);
      await showCommandPicker(prompts, async (prompt) => {
        await insertOrCopyCommand(prompt.command);
      });
    } catch (error) {
      vscode.window.showErrorMessage(`PowerPlay: Failed to load prompts: ${error}`);
    }
  });

  const reloadConfigCmd = vscode.commands.registerCommand('powerplay.reloadConfig', () => {
    vscode.window.showInformationMessage('PowerPlay config reloaded');
  });

  const copyCommandCmd = vscode.commands.registerCommand('powerplay.copyCommand', async () => {
    const selected = await vscode.window.showInputBox({
      placeHolder: 'Enter command (e.g., /review)',
      prompt: 'Copy command to clipboard',
    });

    if (selected) {
      await insertOrCopyCommand(selected);
    }
  });

  const settingsCmd = vscode.commands.registerCommand('powerplay.openSettings', () => {
    PowerPlaySettingsPanel.createOrShow(context.extensionUri);
  });

  // Watch for config changes
  const configWatcher = vscode.workspace.createFileSystemWatcher('**/config.yaml');
  configWatcher.onDidCreate(() => updateStatusBar());
  configWatcher.onDidChange(() => updateStatusBar());
  configWatcher.onDidDelete(() => updateStatusBar());

  // Subscribe to config changes
  context.subscriptions.push(
    statusBarItem,
    showStatusCmd,
    openDashboardCmd,
    pickCommandCmd,
    reloadConfigCmd,
    copyCommandCmd,
    settingsCmd,
    configWatcher,
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('powerplay')) {
        updateStatusBar();
      }
    })
  );

  statusBarItem.show();
}

function updateStatusBar(): void {
  const config = vscode.workspace.getConfiguration('powerplay');
  const statusBarEnabled = config.get<boolean>('statusBarEnabled', true);

  if (!statusBarEnabled) {
    statusBarItem.hide();
    return;
  }

  // Check if config.yaml exists
  const configPath = getConfigPathUtil();
  const configExists = configPath ? fs.existsSync(configPath) : false;

  if (configExists) {
    statusBarItem.text = `$(zap) PowerPlay v${powerplayVersion}`;
    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    statusBarItem.tooltip = `PowerPlay v${powerplayVersion} — Config detected\nClick to show status`;
    statusBarItem.show();
  } else {
    statusBarItem.text = `$(zap) PowerPlay`;
    statusBarItem.backgroundColor = undefined;
    statusBarItem.tooltip = 'PowerPlay — config.yaml not found. Place in workspace root.';
    statusBarItem.show();
  }
}

function getConfigPathUtil(): string | undefined {
  const config = vscode.workspace.getConfiguration('powerplay');
  const customPath = config.get<string>('configPath');

  if (customPath) {
    return customPath;
  }

  // Look for config.yaml in workspace root
  if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
    const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    return path.join(rootPath, 'config.yaml');
  }

  return undefined;
}

export function deactivate() {
  console.log('PowerPlay extension deactivated');
}
