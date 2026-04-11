#!/usr/bin/env node

/**
 * PowerPlay v2.0.0 — OpenRouter API Key Setup (Node.js)
 * Cross-platform script (Windows, macOS, Linux)
 * Automatically sets OPENROUTER_API_KEY environment variable
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header() {
  log('', 'cyan');
  log('╔═══════════════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║              PowerPlay — OpenRouter API Key Setup                         ║', 'cyan');
  log('║                                                                           ║', 'cyan');
  log('║  This script will:                                                        ║', 'cyan');
  log('║  1. Open OpenRouter website to get your API key                           ║', 'cyan');
  log('║  2. Let you paste your API key here                                       ║', 'cyan');
  log('║  3. Set it permanently in your environment                                ║', 'cyan');
  log('║  4. Verify it\'s set correctly                                             ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════════════════════════╝', 'cyan');
  log('', 'cyan');
}

function openBrowser(url) {
  try {
    if (os.platform() === 'win32') {
      execFileSync('cmd', ['/c', 'start', url]);
    } else if (os.platform() === 'darwin') {
      execFileSync('open', [url]);
    } else {
      execFileSync('xdg-open', [url]);
    }
  } catch (e) {
    log('Could not open browser automatically.', 'yellow');
  }
}

function question(q) {
  return new Promise(resolve => {
    rl.question(q, answer => {
      resolve(answer);
    });
  });
}

function setEnvironmentVariable(key, value) {
  const platform = os.platform();

  if (platform === 'win32') {
    // Windows: use setx command
    try {
      execFileSync('setx', [key, value]);
      return true;
    } catch (e) {
      return false;
    }
  } else {
    // macOS/Linux: edit shell profile
    const homeDir = os.homedir();
    const shellProfile = process.env.SHELL?.includes('zsh') ? '.zshrc' : '.bash_profile';
    const profilePath = path.join(homeDir, shellProfile);

    try {
      // Check if file exists
      let content = '';
      if (fs.existsSync(profilePath)) {
        content = fs.readFileSync(profilePath, 'utf8');
      }

      // Add export line if not already there
      const exportLine = `export ${key}="${value}"`;
      if (!content.includes(key)) {
        content += `\n${exportLine}\n`;
        fs.writeFileSync(profilePath, content);
      }

      // Set in current process
      process.env[key] = value;

      log(`✅ Added to ${profilePath}`, 'green');
      log(`You can also set it now with: export ${key}="${value}"`, 'gray');

      return true;
    } catch (e) {
      log(`❌ Error writing to ${profilePath}`, 'red');
      return false;
    }
  }
}

async function main() {
  header();

  // Check if already set
  if (process.env.OPENROUTER_API_KEY) {
    log('✅ OPENROUTER_API_KEY is already set!', 'green');
    log('', 'green');
    const firstChars = process.env.OPENROUTER_API_KEY.substring(0, 20);
    log(`Current value (first 20 chars): ${firstChars}...`, 'gray');
    log('', 'gray');

    const change = await question('Do you want to change it? (Y/N): ');
    if (change.toLowerCase() !== 'y') {
      log('', 'green');
      log('OK, keeping current API key.', 'green');
      log('', 'green');
      rl.close();
      process.exit(0);
    }
  }

  // Step 1: Open browser
  log('', 'yellow');
  log('STEP 1: Getting your OpenRouter API key', 'yellow');
  log('─────────────────────────────────────────', 'yellow');
  log('', 'yellow');
  log('Opening https://openrouter.ai/keys in your browser...', 'cyan');
  log('', 'cyan');
  log('If browser doesn\'t open:', 'gray');
  log('  1. Go to: https://openrouter.ai/keys', 'gray');
  log('  2. Sign up (if needed - free, no credit card!)', 'gray');
  log('  3. Copy your API key (starts with sk-or-v1-)', 'gray');
  log('', 'gray');

  openBrowser('https://openrouter.ai/keys');

  await new Promise(resolve => setTimeout(resolve, 3000));

  log('⏳ Waiting for you to get your API key from OpenRouter...', 'cyan');
  log('', 'cyan');

  // Step 2: Get API key
  log('STEP 2: Paste your API key', 'yellow');
  log('─────────────────────────────────────────', 'yellow');
  log('', 'yellow');
  log('Your API key should:', 'gray');
  log('  • Start with: sk-or-v1-', 'gray');
  log('  • Be about 50+ characters long', 'gray');
  log('  • Look like: sk-or-v1-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', 'gray');
  log('', 'gray');

  const apiKey = await question('Paste your OpenRouter API key here: ');

  // Validate
  if (!apiKey || apiKey.trim() === '') {
    log('', 'red');
    log('❌ ERROR: API key is empty!', 'red');
    log('', 'red');
    rl.close();
    process.exit(1);
  }

  if (!apiKey.startsWith('sk-or-v1-')) {
    log('', 'yellow');
    log('⚠️  WARNING: API key doesn\'t start with \'sk-or-v1-\'', 'yellow');
    log('', 'yellow');
    log('It might be invalid. OpenRouter keys should start with sk-or-v1-', 'yellow');
    log('Double-check you copied it correctly from https://openrouter.ai/keys', 'yellow');
    log('', 'yellow');

    const cont = await question('Continue anyway? (Y/N): ');
    if (cont.toLowerCase() !== 'y') {
      log('', 'gray');
      log('Cancelled. Please try again.', 'gray');
      log('', 'gray');
      rl.close();
      process.exit(1);
    }
  }

  // Step 3: Set environment variable
  log('', 'yellow');
  log('STEP 3: Setting environment variable', 'yellow');
  log('─────────────────────────────────────────', 'yellow');
  log('', 'yellow');
  log('Setting OPENROUTER_API_KEY permanently...', 'cyan');
  log('', 'cyan');

  const success = setEnvironmentVariable('OPENROUTER_API_KEY', apiKey);

  if (!success) {
    log('❌ ERROR: Failed to set environment variable!', 'red');
    log('', 'red');
    log('This might happen if:', 'gray');
    log('  • You don\'t have write permissions', 'gray');
    log('  • Windows restricted the operation', 'gray');
    log('', 'gray');
    log('Try running as administrator/sudo:', 'yellow');
    log(`  ${os.platform() === 'win32' ? 'setx OPENROUTER_API_KEY ' : 'export OPENROUTER_API_KEY='}${apiKey}`, 'yellow');
    log('', 'yellow');
    rl.close();
    process.exit(1);
  }

  log('✅ Environment variable set successfully!', 'green');

  // Step 4: Verify
  log('', 'yellow');
  log('STEP 4: Verifying...', 'yellow');
  log('─────────────────────────────────────────', 'yellow');
  log('', 'yellow');
  log('Checking if environment variable is accessible...', 'cyan');
  log('', 'cyan');

  if (process.env.OPENROUTER_API_KEY) {
    log('✅ OPENROUTER_API_KEY is set in current session', 'green');
    log('', 'green');
    const firstChars = process.env.OPENROUTER_API_KEY.substring(0, 20);
    log(`First 20 characters: ${firstChars}...`, 'gray');
  }

  // Step 5: Next steps
  log('', 'yellow');
  log('STEP 5: Next Steps', 'yellow');
  log('─────────────────────────────────────────', 'yellow');
  log('', 'yellow');
  log('1. Close VS Code completely', 'cyan');
  log('2. Wait 3 seconds', 'cyan');
  log('3. Reopen VS Code', 'cyan');
  log('4. Open Continue chat (Ctrl+Shift+Space)', 'cyan');
  log('5. Select a cloud model from dropdown', 'cyan');
  log('6. Type: "hello"', 'cyan');
  log('7. Should get response ✅', 'cyan');
  log('', 'cyan');
  log('Your API key is now saved permanently. You don\'t need to set it again!', 'green');
  log('', 'green');
  log('═════════════════════════════════════════════════════════════════════════════', 'cyan');
  log('', 'cyan');

  await question('Press Enter to exit');
  rl.close();
}

main().catch(err => {
  console.error(err);
  rl.close();
  process.exit(1);
});
