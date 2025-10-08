import { addTask, generateId } from './storage.js';

const form = document.getElementById('taskForm');
const deadlineOptions = Array.from(
  document.querySelectorAll('input[name="deadlineType"]')
);
const absoluteField = document.querySelector('.deadline-field--absolute');
const relativeField = document.querySelector('.deadline-field--relative');
const titleInput = document.getElementById('taskTitle');
const descriptionInput = document.getElementById('taskDescription');
const dateInput = document.getElementById('deadlineDate');
const timeInput = document.getElementById('deadlineTime');
const relativeSelect = document.getElementById('deadlineRelative');

if (dateInput) {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  today.setMinutes(today.getMinutes() - offset);
  dateInput.min = today.toISOString().split('T')[0];
}

function toggleDeadlineFields() {
  const selected = deadlineOptions.find((option) => option.checked)?.value;
  absoluteField.hidden = selected !== 'absolute';
  relativeField.hidden = selected !== 'relative';
}

deadlineOptions.forEach((option) => {
  option.addEventListener('change', toggleDeadlineFields);
});

toggleDeadlineFields();

titleInput.addEventListener('input', () => clearValidation(titleInput));
if (dateInput) {
  dateInput.addEventListener('input', () => clearValidation(dateInput));
}
if (timeInput) {
  timeInput.addEventListener('input', () => clearValidation(timeInput));
}
if (relativeSelect) {
  relativeSelect.addEventListener('change', () => clearValidation(relativeSelect));
}

function buildDeadline() {
  const selected = deadlineOptions.find((option) => option.checked)?.value;
  const now = new Date();

  if (selected === 'absolute') {
    if (!dateInput.value) {
      return { deadline: null };
    }
    const timeValue = timeInput.value || '00:00';
    const [hours, minutes] = timeValue.split(':').map(Number);
    const due = new Date(dateInput.value);
    if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
      due.setHours(hours, minutes, 0, 0);
    }
    if (due.getTime() < now.getTime()) {
      showValidationError(dateInput, 'Please choose a future time.');
      if (timeInput.value) {
        showValidationError(timeInput);
      }
      dateInput.reportValidity();
      return { deadline: null, invalid: true };
    }
    return { deadline: due.toISOString() };
  }

  if (selected === 'relative') {
    const offset = Number(relativeSelect.value);
    if (!Number.isNaN(offset)) {
      return { deadline: new Date(now.getTime() + offset).toISOString() };
    }
  }

  return { deadline: null };
}

function showValidationError(field, message) {
  field.classList.add('is-invalid');
  field.setAttribute('aria-invalid', 'true');
  if (message) {
    field.setCustomValidity(message);
  }
}

function clearValidation(field) {
  field.classList.remove('is-invalid');
  field.removeAttribute('aria-invalid');
  field.setCustomValidity('');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearValidation(titleInput);
  if (dateInput) {
    clearValidation(dateInput);
  }
  if (timeInput) {
    clearValidation(timeInput);
  }
  if (relativeSelect) {
    clearValidation(relativeSelect);
  }

  const title = titleInput.value.trim();
  if (!title) {
    showValidationError(titleInput, 'Please give the task a name.');
    titleInput.reportValidity();
    return;
  }

  const description = descriptionInput.value.trim();
  const { deadline, invalid } = buildDeadline();
  if (invalid) {
    return;
  }

  const task = {
    id: generateId(),
    title,
    description,
    deadline,
    createdAt: new Date().toISOString(),
  };

  addTask(task);

  form.reset();
  toggleDeadlineFields();
  window.location.href = 'index.html';
});
