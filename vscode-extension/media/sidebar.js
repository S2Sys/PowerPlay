// Client-side sidebar logic
// Communicates with extension host via postMessage API

const vscode = acquireVsCodeApi();

let allPrompts = [];
let filteredPrompts = [];

// Listen for messages from extension host
window.addEventListener('message', (event) => {
  const message = event.data;

  switch (message.type) {
    case 'promptsLoaded':
      allPrompts = message.prompts || [];
      filteredPrompts = [...allPrompts];
      renderCategories();
      break;

    case 'configReloaded':
      allPrompts = message.prompts || [];
      filteredPrompts = [...allPrompts];
      renderCategories();
      showNotification(`Reloaded ${allPrompts.length} prompts`);
      break;

    case 'error':
      console.error('Extension error:', message.error);
      break;
  }
});

// Search input handler
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();

  if (!query) {
    filteredPrompts = [...allPrompts];
  } else {
    filteredPrompts = allPrompts.filter((prompt) => {
      return (
        prompt.name.toLowerCase().includes(query) ||
        prompt.description.toLowerCase().includes(query) ||
        prompt.command.toLowerCase().includes(query) ||
        prompt.category.toLowerCase().includes(query)
      );
    });
  }

  renderCategories();
});

// Reload config button
const reloadBtn = document.getElementById('reload');
reloadBtn.addEventListener('click', () => {
  vscode.postMessage({ type: 'reloadConfig' });
});

// Render categories and prompts
function renderCategories() {
  const container = document.getElementById('categories');
  const noResults = document.getElementById('no-results');

  if (filteredPrompts.length === 0) {
    container.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';

  // Group prompts by category
  const grouped = {};
  filteredPrompts.forEach((prompt) => {
    if (!grouped[prompt.category]) {
      grouped[prompt.category] = [];
    }
    grouped[prompt.category].push(prompt);
  });

  // Sort categories
  const sortedCategories = Object.keys(grouped).sort();

  // Build DOM using safe methods
  container.innerHTML = '';

  sortedCategories.forEach((category) => {
    const prompts = grouped[category];

    const details = document.createElement('details');
    details.className = 'category';

    const summary = document.createElement('summary');
    summary.className = 'category-summary';
    summary.textContent = `${category} (${prompts.length})`;

    const ul = document.createElement('ul');
    ul.className = 'category-list';

    prompts.forEach((prompt) => {
      const li = document.createElement('li');
      li.className = 'prompt-item';
      li.setAttribute('data-command', prompt.command);
      li.setAttribute('title', prompt.description);

      const name = document.createElement('span');
      name.className = 'prompt-name';
      name.textContent = prompt.command;

      const desc = document.createElement('span');
      desc.className = 'prompt-description';
      desc.textContent = prompt.description;

      li.appendChild(name);
      li.appendChild(desc);
      ul.appendChild(li);

      li.addEventListener('click', () => {
        vscode.postMessage({ type: 'insertCommand', command: prompt.command });
      });
    });

    details.appendChild(summary);
    details.appendChild(ul);
    container.appendChild(details);
  });

  // Open first category by default
  const firstCategory = container.querySelector('.category');
  if (firstCategory) {
    firstCategory.setAttribute('open', '');
  }
}

// Show temporary notification
function showNotification(message) {
  // VS Code doesn't expose notifications to webviews, but we can log
  console.log(`[PowerPlay] ${message}`);
}

// Request initial prompts when page loads
window.addEventListener('load', () => {
  vscode.postMessage({ type: 'requestPrompts' });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    const items = document.querySelectorAll('.prompt-item');
    if (items.length === 0) return;

    const current = document.querySelector('.prompt-item.selected');
    let next;

    if (!current) {
      next = e.key === 'ArrowDown' ? items[0] : items[items.length - 1];
    } else {
      const currentIndex = Array.from(items).indexOf(current);
      if (e.key === 'ArrowDown') {
        next = items[(currentIndex + 1) % items.length];
      } else {
        next = items[(currentIndex - 1 + items.length) % items.length];
      }
    }

    // Remove previous selection
    document.querySelectorAll('.prompt-item.selected').forEach((item) => {
      item.classList.remove('selected');
    });

    // Set new selection
    next.classList.add('selected');
    next.scrollIntoView({ block: 'nearest' });

    e.preventDefault();
  }

  if (e.key === 'Enter') {
    const selected = document.querySelector('.prompt-item.selected');
    if (selected) {
      selected.click();
      e.preventDefault();
    }
  }
});
