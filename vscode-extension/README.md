# PowerPlay AI for VS Code

Snippets and quick-access commands for the SmartWorkz PowerPlay orchestration system in Continue.dev.

## Features

### Code Snippets (8 Total)

Available in Markdown, Plaintext, TypeScript, and C#:

#### PowerPlay Command Snippets

- **`pp`** — Generic PowerPlay invocation with placeholder
- **`pp-validate`** — Invoke `/validate-requirements` with numbered list
- **`pp-schema`** — Invoke `/optimize-database-schema` with SQL placeholder
- **`pp-helm`** — Invoke `/generate-helm-charts` with deployment spec
- **`pp-batch`** — Batch orchestration of multiple patterns

#### Language-Specific Snippets

- **`pp-ng`** (Markdown/Plaintext) — Request Angular component from PowerPlay
- **`ng-component`** (TypeScript) — Angular 17+ standalone component class stub with inject(), OnPush, and typed FormGroup
- **`cs-endpoint`** (C#) — ASP.NET Core 8 controller endpoint with Dapper and ILogger<T>

## Installation

### Option 1: Use Snippets Without Building Extension

1. Copy `powerplay.code-snippets` to your workspace:
   ```bash
   cp vscode-extension/powerplay.code-snippets .vscode/
   ```

2. Open a Markdown or TypeScript file and type any snippet prefix (e.g., `pp`, `pp-validate`)

3. Press `Tab` to expand the snippet

This works immediately — no build or installation required.

### Option 2: Build and Install Extension (Future)

For v1.1+, the extension will be packaged as a `.vsix` file:

```bash
cd vscode-extension
npm install
npm run compile
npm run package
```

Then install in VS Code:

- **VS Code**: Extensions → Install from VSIX
- **Continue.dev**: Settings → Extensions → Install local VSIX

## Status Bar Integration

When PowerPlay `config.yaml` is detected in workspace root:

- Status bar shows: `$(zap) PowerPlay — [version]`
- Clicking opens command palette pre-filtered to `PowerPlay:` commands
- **Settings**:
  - `powerplay.statusBarEnabled` (default: `true`) — Toggle visibility
  - `powerplay.configPath` (default: workspace root) — Custom config location

### Current Behavior (v1.0)

Status bar is **informational only** — shows active/inactive state. No real-time metrics polling yet.

### Future (v1.1+)

- File watcher on metrics output JSON
- Live throughput indicator
- Click to open dashboard

## Usage

### In Continue.dev Chat (Markdown Mode)

Type a snippet prefix and press `Tab`:

```markdown
/pp-validate

Requirements:
1. User can log in
2. System validates credentials
3. Token returned
```

After expansion, select the placeholder text and customize for your use case.

### In Code Files (TypeScript/C#)

Type the snippet prefix in a `.ts` or `.cs` file:

```typescript
// Type 'ng-component' and press Tab
@Component({
  selector: 'app-user-profile',
  standalone: true,
  // ... rest of component
})
export class UserProfileComponent implements OnInit {
  // ... generated code
}
```

Edit the generated code to fit your specific needs.

## Keyboard Shortcuts

| Action | Shortcut |
|---|---|
| Expand snippet | `Tab` (default) or `Ctrl+Shift+Enter` |
| Jump to next placeholder | `Tab` |
| Undo snippet expansion | `Ctrl+Z` |

## Configuration

Add to `.vscode/settings.json` to customize:

```json
{
  "powerplay.statusBarEnabled": true,
  "powerplay.configPath": "/path/to/config.yaml"
}
```

## Troubleshooting

### Snippets Not Showing

1. Verify file is `.md` (Markdown) or `.ts` (TypeScript) or `.cs` (C#)
2. Check `powerplay.code-snippets` is in `.vscode/` directory
3. Reload VS Code window (`Ctrl+R`)

### Continue.dev Chat Not Recognizing Snippets

- Continue.dev chat input uses plaintext or Markdown rendering
- Snippets work in the text input area — type `pp` and press `Tab`
- Some Continue.dev versions may not support snippet expansion in chat — copy/paste the snippet text manually if needed

### Command Palette Not Showing PowerPlay Commands

- Verify `config.yaml` exists in workspace root
- Reload VS Code window
- Check `powerplay.statusBarEnabled` is `true`

## Development

### Build Extension

```bash
cd vscode-extension
npm install
npm run compile    # One-time compile
npm run watch      # Watch mode for development
```

### Test Snippets Locally

1. Press `F5` to open VS Code extension dev host
2. Open a `.md` or `.ts` file
3. Type snippet prefix and press `Tab` to test

### Update Snippets

Edit `powerplay.code-snippets` and reload the dev host (`Ctrl+R`)

## Roadmap

| Version | Features |
|---|---|
| **1.0** | 8 code snippets, status bar (informational) |
| **1.1** | Real-time metrics file watcher, live throughput |
| **1.2** | Dashboard quick-open, command palette integration |
| **2.0** | WebView dashboard, streaming metrics, alerts |

## Support

- **Snippets Issue?** Check syntax in `powerplay.code-snippets`
- **Extension Won't Load?** Verify `package.json` has valid JSON
- **Continue.dev Integration?** See [Continue.dev docs](https://continue.dev/docs)

## License

SmartWorkz — PowerPlay v3.9.0
