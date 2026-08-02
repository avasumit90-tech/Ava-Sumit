/**
 * Global form validation helpers.
 *
 * These work with native HTML5 `required` attributes already present on inputs,
 * selects and textareas. They add a red border (`.field-error`) plus an inline
 * "This field is required" message (`.inline-error`) under each invalid field
 * and return the first invalid element so it can be focused & scrolled into view.
 */

export function insertError(el: HTMLElement, msg: string) {
  // Avoid duplicate error messages on repeated attempts.
  if (el.nextElementSibling && el.nextElementSibling.classList.contains('inline-error')) {
    return;
  }
  const p = document.createElement('p');
  p.className = 'inline-error';
  p.textContent = msg;
  el.insertAdjacentElement('afterend', p);
}

export function clearInlineErrors(container: HTMLElement) {
  container.querySelectorAll('.inline-error').forEach((n) => n.remove());
  container.querySelectorAll('.field-error').forEach((n) => n.classList.remove('field-error'));
}

/**
 * Validates all `required` native fields inside `container`.
 * Returns `{ valid, firstInvalid }`.
 */
export function validateRequiredFields(container: HTMLElement): {
  valid: boolean;
  firstInvalid: HTMLElement | null;
} {
  clearInlineErrors(container);
  let firstInvalid: HTMLElement | null = null;

  const selectors =
    'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="submit"]):not([type="button"]), select, textarea';
  const fields = Array.from(container.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(selectors));

  fields.forEach((el) => {
    if (!el.hasAttribute('required')) return;
    const valid = el.checkValidity();
    el.classList.toggle('field-error', !valid);
    if (!valid) {
      insertError(el, el.getAttribute('data-required-msg') || 'This field is required');
      if (!firstInvalid) firstInvalid = el;
    }
  });

  return { valid: !firstInvalid, firstInvalid };
}

/**
 * Validates the entire form (all required fields inside it) and returns the
 * first invalid element so the caller can focus/scroll to it.
 */
export function validateForm(form: HTMLFormElement): { valid: boolean; firstInvalid: HTMLElement | null } {
  return validateRequiredFields(form);
}

export function focusInvalid(el: HTMLElement | null) {
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  try {
    el.focus({ preventScroll: true });
  } catch {
    /* noop */
  }
}
