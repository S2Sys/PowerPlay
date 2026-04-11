// PowerPlay Chat Panel — Client-side logic
// Handles autocomplete, message rendering, and communication with extension host

const vscode = acquireVsCodeApi();

// State
let prompts = [];
let history = [];
let autocompleteItems = [];
let selectedIdx = -1;
let isAutocompleteVisible = false;

// DOM elements
const inputEl = document.getElementById('input');
const sendBtn = document.getElementById('send-btn');
const messagesEl = document.getElementById('messages');
const autocompleteEl = document.getElementById('autocomplete');
const clearBtn = document.getElementById('clear-btn');
const promptCountEl = document.getElementById('prompt-count');
const settingsBtn = document.getElementById('settings-btn');
const settingsPanelEl = document.getElementById('settings-panel');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const configPathInput = document.getElementById('config-path');
const defaultModelSelect = document.getElementById('default-model');
const apiKeyInput = document.getElementById('api-key');
const temperatureSlider = document.getElementById('temperature');
const tempValueEl = document.getElementById('temp-value');
const testConnectionBtn = document.getElementById('test-connection-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const openConfigBtn = document.getElementById('open-config-btn');

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadSettings();
  vscode.postMessage({ type: 'ready' });
});

// Message handler from extension
window.addEventListener('message', event => {
  const message = event.data;
  switch (message.type) {
    case 'prompts':
      prompts = message.data || [];
      promptCountEl.textContent = prompts.length;
      break;
    case 'history':
      history = message.data || [];
      renderHistory();
      break;
  }
});

// Setup event listeners
function setupEventListeners() {
  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', handleKeydown);
  inputEl.addEventListener('input', handleInput);
  clearBtn.addEventListener('click', handleClear);

  settingsBtn.addEventListener('click', openSettings);
  closeSettingsBtn.addEventListener('click', closeSettings);
  saveSettingsBtn.addEventListener('click', saveSettings);
  testConnectionBtn.addEventListener('click', testConnection);
  openConfigBtn.addEventListener('click', openConfig);
  temperatureSlider.addEventListener('input', updateTempValue);
}

function openSettings() {
  settingsPanelEl.classList.remove('hidden');
  inputEl.blur();
}

function closeSettings() {
  settingsPanelEl.classList.add('hidden');
}

function updateTempValue(e) {
  tempValueEl.textContent = e.target.value;
}

function loadSettings() {
  vscode.postMessage({ type: 'loadSettings' });
}

function saveSettings() {
  const settings = {
    configPath: configPathInput.value,
    defaultModel: defaultModelSelect.value,
    apiKey: apiKeyInput.value,
    temperature: parseFloat(temperatureSlider.value),
  };
  vscode.postMessage({ type: 'saveSettings', settings });
  closeSettings();
}

function testConnection() {
  if (!apiKeyInput.value) {
    alert('Please enter an API key first');
    return;
  }
  testConnectionBtn.textContent = 'Testing...';
  testConnectionBtn.disabled = true;
  vscode.postMessage({ type: 'testConnection', apiKey: apiKeyInput.value });
}

function openConfig() {
  vscode.postMessage({ type: 'openConfigFile', path: configPathInput.value });
}

// Handle send button / Enter key
function handleSend() {
  const text = inputEl.value.trim();
  if (!text) return;

  vscode.postMessage({ type: 'sendMessage', text });
  inputEl.value = '';
  autocompleteEl.classList.add('hidden');
  isAutocompleteVisible = false;
  autoResizeTextarea();
}

function handleKeydown(e) {
  if (isAutocompleteVisible) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIdx = Math.min(selectedIdx + 1, autocompleteItems.length - 1);
      highlightSelected();
      return;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIdx = Math.max(selectedIdx - 1, -1);
      highlightSelected();
      return;
    } else if (e.key === 'Enter' && selectedIdx >= 0) {
      e.preventDefault();
      selectAutocomplete(selectedIdx);
      return;
    } else if (e.key === 'Escape') {
      e.preventDefault();
      autocompleteEl.classList.add('hidden');
      isAutocompleteVisible = false;
      selectedIdx = -1;
      return;
    }
  }

  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
}

function handleInput(e) {
  autoResizeTextarea();
  const text = inputEl.value;

  if (text.startsWith('/')) {
    const query = text.slice(1).toLowerCase();
    filterAutocomplete(query);
    showAutocomplete();
  } else {
    hideAutocomplete();
  }
}

function handleClear() {
  vscode.postMessage({ type: 'clearHistory' });
}

// Autocomplete logic
function filterAutocomplete(query) {
  autocompleteItems = prompts.filter(p => {
    const cmd = p.command.toLowerCase();
    const desc = p.description.toLowerCase();
    return cmd.includes(query) || desc.includes(query);
  });

  selectedIdx = -1;
  renderAutocomplete();
}

function renderAutocomplete() {
  autocompleteEl.innerHTML = '';

  autocompleteItems.slice(0, 12).forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'ac-item';
    div.dataset.idx = idx;
    div.dataset.cmd = item.command;

    const query = inputEl.value.slice(1).toLowerCase();

    // Create command text with highlights
    const cmdStrong = document.createElement('strong');
    cmdStrong.appendChild(createHighlightedText(item.command, query));

    // Create description text
    const descText = document.createTextNode(' — ' + item.description);

    div.appendChild(cmdStrong);
    div.appendChild(descText);

    div.addEventListener('click', () => selectAutocomplete(idx));

    autocompleteEl.appendChild(div);
  });

  highlightSelected();
}

function createHighlightedText(text, query) {
  const fragment = document.createDocumentFragment();
  if (!query) {
    fragment.appendChild(document.createTextNode(text));
    return fragment;
  }

  const parts = text.split(new RegExp('(' + query + ')', 'i'));
  parts.forEach(part => {
    if (part.toLowerCase() === query.toLowerCase()) {
      const mark = document.createElement('mark');
      mark.textContent = part;
      fragment.appendChild(mark);
    } else {
      fragment.appendChild(document.createTextNode(part));
    }
  });
  return fragment;
}

function highlightSelected() {
  document.querySelectorAll('.ac-item').forEach((el, idx) => {
    if (idx === selectedIdx) {
      el.classList.add('selected');
      el.scrollIntoView({ block: 'nearest' });
    } else {
      el.classList.remove('selected');
    }
  });
}

function selectAutocomplete(idx) {
  if (idx >= 0 && idx < autocompleteItems.length) {
    const item = autocompleteItems[idx];
    inputEl.value = item.command;
    hideAutocomplete();
    autoResizeTextarea();
    inputEl.focus();
  }
}

function showAutocomplete() {
  if (autocompleteItems.length > 0) {
    autocompleteEl.classList.remove('hidden');
    isAutocompleteVisible = true;
  }
}

function hideAutocomplete() {
  autocompleteEl.classList.add('hidden');
  isAutocompleteVisible = false;
  selectedIdx = -1;
}

// History rendering
function renderHistory() {
  messagesEl.innerHTML = '';
  history.forEach(msg => {
    const div = document.createElement('div');
    div.className = 'message ' + msg.role;

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    renderMarkdownContent(bubble, msg.text);

    div.appendChild(bubble);
    messagesEl.appendChild(div);
  });

  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function renderMarkdownContent(container, text) {
  // Parse markdown and safely render
  const lines = text.split('\n');
  let inCodeBlock = false;
  let codeBlockIndex = -1;

  lines.forEach((line, idx) => {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (inCodeBlock) {
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.setAttribute('data-block', 'code-' + idx);
        pre.appendChild(code);
        container.appendChild(pre);
        codeBlockIndex = idx;
      }
      return;
    }

    if (inCodeBlock) {
      const codeEls = container.querySelectorAll('code');
      if (codeEls.length > 0) {
        const lastCode = codeEls[codeEls.length - 1];
        if (lastCode.textContent) {
          lastCode.textContent += '\n' + line;
        } else {
          lastCode.textContent = line;
        }
      }
    } else {
      // Parse inline markdown in non-code lines
      const fragment = parseInlineMarkdown(line);
      container.appendChild(fragment);
      if (idx < lines.length - 1) {
        container.appendChild(document.createElement('br'));
      }
    }
  });
}

function parseInlineMarkdown(line) {
  const fragment = document.createDocumentFragment();

  // Bold: **text**
  const boldRegex = /\*\*([^\*]+)\*\*/g;
  let match;
  let lastPos = 0;

  const boldMatches = [];
  while ((match = boldRegex.exec(line)) !== null) {
    boldMatches.push({ start: match.index, end: match.index + match[0].length, text: match[1], type: 'bold' });
  }

  // Inline code: `text`
  const codeRegex = /`([^`]+)`/g;
  const codeMatches = [];
  while ((match = codeRegex.exec(line)) !== null) {
    codeMatches.push({ start: match.index, end: match.index + match[0].length, text: match[1], type: 'code' });
  }

  // Sort matches and render
  const allMatches = boldMatches.concat(codeMatches).sort((a, b) => a.start - b.start);

  let pos = 0;
  allMatches.forEach(m => {
    if (pos < m.start) {
      fragment.appendChild(document.createTextNode(line.substring(pos, m.start)));
    }

    if (m.type === 'bold') {
      const strong = document.createElement('strong');
      strong.textContent = m.text;
      fragment.appendChild(strong);
    } else if (m.type === 'code') {
      const code = document.createElement('code');
      code.textContent = m.text;
      fragment.appendChild(code);
    }

    pos = m.end;
  });

  if (pos < line.length) {
    fragment.appendChild(document.createTextNode(line.substring(pos)));
  }

  return fragment;
}

// Auto-resize textarea
function autoResizeTextarea() {
  inputEl.style.height = 'auto';
  inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
}
