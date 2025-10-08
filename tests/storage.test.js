import { beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';

function createMockStorage() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
}

global.localStorage = createMockStorage();

const {
  addTask,
  addToArchive,
  clearArchive,
  generateId,
  getArchive,
  getTasks,
  removeTask,
  saveArchive,
  saveTasks,
} = await import('../scripts/storage.js');

beforeEach(() => {
  global.localStorage = createMockStorage();
});

test('addTask appends a task to saved tasks', () => {
  const firstTask = { id: '1', title: 'First', createdAt: '2024-01-01T00:00:00.000Z' };
  saveTasks([firstTask]);

  const secondTask = { id: '2', title: 'Second', createdAt: '2024-01-02T00:00:00.000Z' };
  addTask(secondTask);

  assert.deepEqual(getTasks(), [firstTask, secondTask]);
});

test('removeTask deletes the matching task', () => {
  const tasks = [
    { id: 'a', title: 'Alpha', createdAt: '2024-01-01T00:00:00.000Z' },
    { id: 'b', title: 'Beta', createdAt: '2024-01-02T00:00:00.000Z' },
  ];
  saveTasks(tasks);

  removeTask('a');

  assert.deepEqual(getTasks(), [tasks[1]]);
});

test('addToArchive puts the newest item at the top', () => {
  const first = { id: 'old', title: 'Old task' };
  saveArchive([first]);

  const second = { id: 'new', title: 'New task' };
  addToArchive(second);

  assert.deepEqual(getArchive(), [second, first]);
});

test('clearArchive removes all archived tasks', () => {
  saveArchive([{ id: 'something', title: 'Task' }]);
  clearArchive();
  assert.deepEqual(getArchive(), []);
});

test('generateId returns unique identifiers', () => {
  const first = generateId();
  const second = generateId();
  assert.notStrictEqual(first, second);
  assert.ok(first.length > 0);
  assert.ok(second.length > 0);
});
