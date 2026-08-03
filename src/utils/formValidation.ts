/**
 * Global form validation helpers.
 *
 * Works with native HTML5 `required` attributes plus `type`/`pattern` rules.
 * Adds a red border (`.field-error`) and an inline message (`.inline-error`)
 * under each invalid field, and returns the first invalid element so it can be
 * focused & scrolled into view.
 *
 * Field-specific rules (email format, 10-digit phone, pincode digits) are
 * derived from the input's `type`, `pattern`, and `data-rule` attributes.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_10_RE = /^\d{10}$/;
const PINCODE_RE = /^\d{6}$/;
// Generic message as a fallback for other pattern rules.
const REQUIRED_MSG = 'This field is required';
const HINDI_REQUIRED_MSG = 'Kripya ye jaankari bharein';

export function insertError(el: HTMLElement, msg: string) {
  // Avoid duplicate error messages on repeated attempts.
  if (el.nextElementSibling && el.nextElementSibling.classList.contains('inline-error')) {
    el.nextElementSibling.textContent = msg;
    return;
  }
  const p = document.createElement('p');
  p.className = 'inline-error';
  p.textContent = msg;
  el.insertAdjacentElement('afterend', p);
}

export function clearInlineErrors(container?: HTMLElement | null) {
  if (!container) return;
  container.querySelectorAll('.inline-error').forEach((n) => n.remove());
  container.querySelectorAll('.field-error').forEach((n) => n.classList.remove('field-error'));
}

/** Returns a human-readable error for an empty required field. */
export function requiredMessage(el: HTMLElement): string {
  return el.getAttribute('data-required-msg') || el.getAttribute('data-hindi-msg') === 'true'
    ? HINDI_REQUIRED_MSG
    : REQUIRED_MSG;
}

/**
 * Validates a single field against its `type`/`pattern`/`data-rule`.
 * Returns an error string if invalid, or `null` if the value is acceptable.
 */
export function fieldRuleError(el: HTMLInputElement): string | null {
  const value = el.value.trim();
  if (!value) return null; // emptiness handled separately

  // Explicit data-rule wins over type heuristics.
  const rule = el.getAttribute('data-rule');

  if (rule === 'email' || el.type === 'email') {
    if (!EMAIL_RE.test(value)) {
      return el.getAttribute('data-email-msg') || 'Please enter a valid email address (e.g., example@domain.com)';
    }
  }

  if (rule === 'phone' || el.type === 'tel') {
    // Allow optional leading +91 / 0 prefix but require a 10-digit core.
    const digits = value.replace(/\D/g, '');
    if (!PHONE_10_RE.test(digits) || digits.length !== 10) {
      return el.getAttribute('data-phone-msg') || 'Phone number must be exactly 10 digits';
    }
  }

  if (rule === 'pincode' || el.getAttribute('data-pincode') === 'true') {
    const digits = value.replace(/\D/g, '');
    if (!PINCODE_RE.test(digits) && !/^\d+$/.test(value)) {
      return el.getAttribute('data-pincode-msg') || 'Pincode must be a valid 6-digit number';
    }
  }

  if (rule === 'year') {
    const digits = value.replace(/\D/g, '');
    if (!/^\d{4}$/.test(digits)) {
      return el.getAttribute('data-year-msg') || 'Enter a valid completion year (e.g., 2022)';
    }
  }

  // Any custom pattern attribute not satisfied.
  const pattern = el.getAttribute('pattern');
  if (pattern) {
    try {
      const re = new RegExp('^(?:' + pattern + ')$');
      if (!re.test(value)) {
        return el.getAttribute('data-pattern-msg') || 'Please enter a valid value';
      }
    } catch {
      /* invalid pattern, ignore */
    }
  }

  return null;
}

/**
 * Validates all `required` native fields inside `container`.
 * Returns `{ valid, firstInvalid }` where firstInvalid is the first field that
 * failed (empty required, or rule/pattern violation).
 */
export function validateRequiredFields(container: HTMLElement): {
  valid: boolean;
  firstInvalid: HTMLElement | null;
} {
  clearInlineErrors(container);
  let firstInvalid: HTMLElement | null = null;

  const selectors =
    'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="submit"]):not([type="button"]), select, textarea';
  const fields = Array.from(
    container.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(selectors)
  );

  // Validate required radio groups (none of the group is checked).
  container.querySelectorAll<HTMLInputElement>('input[type="radio"][required]').forEach((radio) => {
    const group = Array.from(
      container.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${radio.name}"]`)
    );
    if (group.length && !group.some((r) => r.checked)) {
      group.forEach((r) => r.classList.add('field-error'));
      insertError(radio, requiredMessage(radio));
      if (!firstInvalid) firstInvalid = radio;
    }
  });

  // Validate required checkboxes (must be checked).
  container.querySelectorAll<HTMLInputElement>('input[type="checkbox"][required]').forEach((cb) => {
    if (!cb.checked) {
      cb.classList.add('field-error');
      insertError(cb, requiredMessage(cb));
      if (!firstInvalid) firstInvalid = cb;
    }
  });

  fields.forEach((el) => {
    // 1) Required check
    if (el.hasAttribute('required')) {
      const empty = el.checkValidity() === false;
      if (empty && !el.value.trim()) {
        el.classList.add('field-error');
        insertError(el, requiredMessage(el));
        if (!firstInvalid) firstInvalid = el;
        return;
      }
    }

    // 2) Field-specific rule check (email / phone / pincode / pattern)
    if (el instanceof HTMLInputElement) {
      const ruleErr = fieldRuleError(el);
      if (ruleErr) {
        el.classList.add('field-error');
        insertError(el, ruleErr);
        if (!firstInvalid) firstInvalid = el;
        return;
      }
    }

    // 3) Native validity (e.g. min/max length)
    if (el.hasAttribute('required') && !el.checkValidity()) {
      el.classList.add('field-error');
      insertError(el, el.getAttribute('data-invalid-msg') || 'Please provide a valid value');
      if (!firstInvalid) firstInvalid = el;
    }
  });

  return { valid: !firstInvalid, firstInvalid };
}

/** Validates an entire form (all required fields inside it). */
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
