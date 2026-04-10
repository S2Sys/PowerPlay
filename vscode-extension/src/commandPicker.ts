import * as vscode from 'vscode';
import { PowerPlayPrompt } from './configParser';

export async function showCommandPicker(
  prompts: PowerPlayPrompt[],
  onSelect: (prompt: PowerPlayPrompt) => void
): Promise<void> {
  if (prompts.length === 0) {
    vscode.window.showWarningMessage('No PowerPlay prompts found. Check config.yaml.');
    return;
  }

  // Build QuickPick items grouped by category
  const items: (vscode.QuickPickItem & { prompt?: PowerPlayPrompt })[] = [];
  const categoriesAdded = new Set<string>();

  // Sort prompts by category, then by name
  const sortedPrompts = [...prompts].sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.name.localeCompare(b.name);
  });

  let currentCategory = '';

  sortedPrompts.forEach((prompt) => {
    // Add category separator if category changed
    if (prompt.category !== currentCategory && !categoriesAdded.has(prompt.category)) {
      currentCategory = prompt.category;
      categoriesAdded.add(prompt.category);

      items.push({
        label: `$(folder) ${prompt.category}`,
        kind: vscode.QuickPickItemKind.Separator,
      });
    }

    // Add prompt item
    items.push({
      label: `$(terminal) ${prompt.command}`,
      description: prompt.description,
      detail: `Category: ${prompt.category}`,
      prompt: prompt,
    });
  });

  // Show QuickPick
  const selected = await vscode.window.showQuickPick(items, {
    matchOnDescription: true,
    matchOnDetail: true,
    placeHolder: 'Select a PowerPlay prompt...',
    title: `PowerPlay Prompts (${prompts.length} available)`,
  });

  if (selected && selected.prompt) {
    onSelect(selected.prompt);
  }
}

export async function insertOrCopyCommand(command: string): Promise<void> {
  const editor = vscode.window.activeTextEditor;

  if (editor && isSupportedFileType(editor.document.languageId)) {
    // Insert at cursor if editor is active
    await editor.edit((editBuilder) => {
      editBuilder.insert(editor.selection.active, `${command}\n`);
    });
  } else {
    // Copy to clipboard if no editor or unsupported file type
    await vscode.env.clipboard.writeText(command);
    vscode.window.showInformationMessage(`Copied \`${command}\` to clipboard`);
  }
}

function isSupportedFileType(languageId: string): boolean {
  const supported = ['markdown', 'plaintext', 'text', 'yaml', 'json'];
  return supported.includes(languageId.toLowerCase());
}
