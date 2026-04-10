import * as fs from 'fs';
import * as path from 'path';

export interface PowerPlayPrompt {
  name: string;
  description: string;
  command: string;
  category: string;
  prompt: string;
}

export function parsePrompts(configPath: string): PowerPlayPrompt[] {
  if (!fs.existsSync(configPath)) {
    return [];
  }

  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    return extractPrompts(content);
  } catch (error) {
    console.error(`Failed to parse config.yaml: ${error}`);
    return [];
  }
}

function extractPrompts(content: string): PowerPlayPrompt[] {
  const prompts: PowerPlayPrompt[] = [];

  const promptRegex = /  - name:\s*(\w+)\s*\n\s*description:\s*"([^"]+)"\s*\n\s*invokable:\s*true\s*\n\s*prompt:\s*\|\s*\n([\s\S]*?)(?=\n  - name:|$)/g;

  let match;
  const categoryMap = buildCategoryMap(content);

  while ((match = promptRegex.exec(content)) !== null) {
    const name = match[1];
    const description = match[2];
    const promptBody = match[3];
    const category = findCategory(content, match.index, categoryMap);

    prompts.push({
      name,
      description,
      command: `/${name}`,
      category,
      prompt: promptBody.trim(),
    });
  }

  return prompts.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.name.localeCompare(b.name);
  });
}

function buildCategoryMap(content: string): Map<number, string> {
  const categoryMap = new Map<number, string>();
  const headerRegex = /\n\s+#\s*──\s*(.+?)\s*──/g;
  let match;

  while ((match = headerRegex.exec(content)) !== null) {
    const headerText = match[1].trim();
    const position = match.index;
    const parts = headerText.split(/\s+/);
    let category = parts.slice(1).join(' ');

    category = category.replace(/^v\d+\.\d+\.\d+\s+/, '');
    category = category.replace(/Prompts?$/, '').trim();
    category = category || 'Miscellaneous';

    categoryMap.set(position, category);
  }

  return categoryMap;
}

function findCategory(content: string, position: number, categoryMap: Map<number, string>): string {
  let nearestCategory = 'Other';
  let nearestPosition = -1;

  for (const [pos, category] of categoryMap.entries()) {
    if (pos < position && pos > nearestPosition) {
      nearestPosition = pos;
      nearestCategory = category;
    }
  }

  return nearestCategory;
}

export function getConfigPath(configPathSetting: string, workspaceFolders: readonly any[] | undefined): string | undefined {
  if (configPathSetting && configPathSetting.trim().length > 0) {
    return configPathSetting;
  }

  if (workspaceFolders && workspaceFolders.length > 0) {
    const rootPath = workspaceFolders[0].uri.fsPath;
    return path.join(rootPath, 'config.yaml');
  }

  return undefined;
}
