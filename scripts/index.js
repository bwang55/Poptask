import { getTasks, saveTasks, addToArchive } from './storage.js';

const taskList = document.getElementById('taskList');
const taskTemplate = document.getElementById('taskTemplate');
const emptyState = document.getElementById('emptyState');
const activeCount = document.getElementById('activeCount');
const sortButtons = document.querySelectorAll('.panel-toggle__chip');
const menuToggle = document.getElementById('menuToggle');
const panelOverlay = document.getElementById('panelOverlay');
const actionPanel = document.getElementById('actionPanel');
const closePanelButton = document.getElementById('closePanel');

const popTimeouts = new Map();

let sortPreference = localStorage.getItem('poptask_sort') || 'deadline';
let isPanelOpen = false;
let panelFocusTimeout;

function syncPanelState(isOpen) {
  if (isOpen) {
    panelOverlay.hidden = false;
    requestAnimationFrame(() => {
      panelOverlay.classList.add('is-visible');
      actionPanel.classList.add('is-visible');
    });
    actionPanel.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    panelFocusTimeout = window.setTimeout(() => {
      closePanelButton.focus({ preventScroll: true });
    }, 180);
    document.addEventListener('keydown', handlePanelKeyDown);
  } else {
    if (panelFocusTimeout) {
      window.clearTimeout(panelFocusTimeout);
      panelFocusTimeout = undefined;
    }
    panelOverlay.classList.remove('is-visible');
    actionPanel.classList.remove('is-visible');
    actionPanel.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', handlePanelKeyDown);
    const handleTransitionEnd = (event) => {
      if (event.target === panelOverlay && !isPanelOpen) {
        panelOverlay.hidden = true;
        panelOverlay.removeEventListener('transitionend', handleTransitionEnd);
      }
    };
    panelOverlay.addEventListener('transitionend', handleTransitionEnd);
    menuToggle.focus({ preventScroll: true });
  }
}

function openPanel() {
  if (isPanelOpen) return;
  isPanelOpen = true;
  syncPanelState(true);
}

function closePanel() {
  if (!isPanelOpen) return;
  isPanelOpen = false;
  syncPanelState(false);
}

function handlePanelKeyDown(event) {
  if (event.key === 'Escape') {
    closePanel();
  }
}

function setSortPreference(newValue) {
  sortPreference = newValue;
  localStorage.setItem('poptask_sort', newValue);
  sortButtons.forEach((button) => {
    const isActive = button.dataset.sort === newValue;
    button.setAttribute('aria-checked', String(isActive));
  });
}

function formatDuration(ms) {
  const abs = Math.abs(ms);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (abs < minute) {
    return 'a moment';
  }
  if (abs < hour) {
    const value = Math.round(abs / minute);
    return `${value} minute${value === 1 ? '' : 's'}`;
  }
  if (abs < day) {
    const value = Math.round(abs / hour * 10) / 10;
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)} hour${value === 1 ? '' : 's'}`;
  }
  if (abs < week) {
    const value = Math.round(abs / day * 10) / 10;
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)} day${value === 1 ? '' : 's'}`;
  }
  const value = Math.round(abs / week * 10) / 10;
  return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)} week${value === 1 ? '' : 's'}`;
}

function formatDeadline(task) {
  if (!task.deadline) {
    return 'No deadline';
  }
  const due = new Date(task.deadline);
  if (Number.isNaN(due.getTime())) {
    return 'No deadline';
  }

  const now = Date.now();
  const diff = due.getTime() - now;
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  if (Math.abs(diff) < 60 * 1000) {
    return 'Due now';
  }

  if (diff > 0) {
    return `Due in ${formatDuration(diff)} • ${dateFormatter.format(due)}`;
  }
  return `Overdue by ${formatDuration(diff)} • ${dateFormatter.format(due)}`;
}

function sortTasks(tasks) {
  const sorted = [...tasks];
  if (sortPreference === 'created') {
    sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else {
    sorted.sort((a, b) => {
      if (!a.deadline && !b.deadline) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }
  return sorted;
}

function renderTasks() {
  const tasks = sortTasks(getTasks());
  taskList.innerHTML = '';

  const previousCount = Number.parseInt(activeCount.textContent, 10);
  activeCount.textContent = tasks.length;
  if (!Number.isNaN(previousCount) && previousCount !== tasks.length) {
    activeCount.classList.remove('queue-count__value--pulse');
    void activeCount.offsetWidth;
    activeCount.classList.add('queue-count__value--pulse');
  }

  if (tasks.length === 0) {
    emptyState.style.display = 'grid';
    taskList.appendChild(emptyState);
    return;
  }

  emptyState.style.display = 'none';
  if (emptyState.isConnected) {
    emptyState.remove();
  }

  tasks.forEach((task, index) => {
    const fragment = taskTemplate.content.cloneNode(true);
    const card = fragment.querySelector('.task-card');
    const title = fragment.querySelector('.task-card__title');
    const description = fragment.querySelector('.task-card__description');
    const deadline = fragment.querySelector('.task-card__deadline');
    const button = fragment.querySelector('.pop-button');

    card.dataset.taskId = task.id;
    card.style.setProperty('--delay', `${index * 40}ms`);
    title.textContent = task.title;
    description.textContent = task.description || 'No additional details';
    description.dataset.empty = !task.description;
    deadline.textContent = formatDeadline(task);

    button.addEventListener('click', () => popTask(card, task.id));
    taskList.appendChild(fragment);
  });
}

function popTask(card, taskId) {
  if (card.classList.contains('popping')) {
    return;
  }

  card.classList.add('popping');
  card.style.pointerEvents = 'none';
  const button = card.querySelector('.pop-button');
  if (button) {
    button.disabled = true;
  }
  if ('vibrate' in navigator) {
    navigator.vibrate(30);
  }

  const handleAnimationEnd = (event) => {
    if (event.target !== card) {
      return;
    }
    finalizePop(taskId);
  };

  card.addEventListener('animationend', handleAnimationEnd);

  const fallback = window.setTimeout(() => finalizePop(taskId), 650);
  popTimeouts.set(taskId, { timeout: fallback, handler: handleAnimationEnd, card });
}

function finalizePop(taskId) {
  const pending = popTimeouts.get(taskId);
  if (pending) {
    window.clearTimeout(pending.timeout);
    if (pending.card && pending.handler) {
      pending.card.removeEventListener('animationend', pending.handler);
    }
    popTimeouts.delete(taskId);
  }

  const tasks = getTasks();
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) {
    renderTasks();
    return;
  }
  const [task] = tasks.splice(taskIndex, 1);
  saveTasks(tasks);
  addToArchive({ ...task, completedAt: new Date().toISOString() });
  renderTasks();
}

sortButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setSortPreference(button.dataset.sort);
    renderTasks();
    if (isPanelOpen) {
      closePanel();
    }
  });
});

menuToggle.addEventListener('click', () => {
  if (isPanelOpen) {
    closePanel();
  } else {
    openPanel();
  }
});

closePanelButton.addEventListener('click', closePanel);
panelOverlay.addEventListener('click', closePanel);

setSortPreference(sortPreference);
renderTasks();

window.addEventListener('focus', renderTasks);
