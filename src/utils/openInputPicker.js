export function openInputPicker(event) {
  const input = event.currentTarget;
  if (typeof input.showPicker !== 'function') return;
  try {
    input.showPicker();
    event.preventDefault();
  } catch {
    // Embedded previews or unsupported picker types can reject showPicker().
    // Leave the native input usable through its own indicator or keyboard.
    input.focus();
  }
}
