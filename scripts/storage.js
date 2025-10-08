const TASK_KEY = 'poptask_tasks';
const ARCHIVE_KEY = 'poptask_archive';

export function getTasks() {
  try {
    const raw = localStorage.getItem(TASK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Unable to read tasks from storage', error);
    return [];
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Unable to save tasks to storage', error);
  }
}

export function getArchive() {
  try {
    const raw = localStorage.getItem(ARCHIVE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Unable to read archive from storage', error);
    return [];
  }
}

export function saveArchive(tasks) {
  try {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Unable to save archive to storage', error);
  }
}

export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export function addTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
}

export function removeTask(id) {
  const tasks = getTasks().filter((task) => task.id !== id);
  saveTasks(tasks);
}

export function addToArchive(task) {
  const archive = getArchive();
  archive.unshift(task);
  saveArchive(archive);
}

export function clearArchive() {
  saveArchive([]);
}
