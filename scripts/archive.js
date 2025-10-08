import { getArchive, clearArchive } from './storage.js';

const list = document.getElementById('archiveList');
const empty = document.getElementById('archiveEmpty');
const clearButton = document.getElementById('clearArchive');

function formatTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
}

function renderArchive() {
  const archive = getArchive();
  list.innerHTML = '';

  if (!archive.length) {
    empty.style.display = 'grid';
    return;
  }

  empty.style.display = 'none';

  archive.forEach((task) => {
    const card = document.createElement('article');
    card.className = 'archive-card';

    const title = document.createElement('h3');
    title.textContent = task.title;

    const description = document.createElement('p');
    description.textContent = task.description || 'No additional details';

    const meta = document.createElement('p');
    meta.className = 'archive-card__meta';
    const completed = formatTimestamp(task.completedAt);
    const created = formatTimestamp(task.createdAt);
    const deadline = task.deadline ? formatTimestamp(task.deadline) : null;

    meta.textContent = [
      completed ? `Popped ${completed}` : null,
      deadline ? `Due ${deadline}` : null,
      created ? `Added ${created}` : null,
    ]
      .filter(Boolean)
      .join(' • ');

    card.appendChild(title);
    card.appendChild(description);
    if (meta.textContent) {
      card.appendChild(meta);
    }

    list.appendChild(card);
  });
}

clearButton.addEventListener('click', () => {
  if (!getArchive().length) {
    return;
  }
  const confirmed = window.confirm('Clear all popped tasks?');
  if (confirmed) {
    clearArchive();
    renderArchive();
  }
});

renderArchive();
