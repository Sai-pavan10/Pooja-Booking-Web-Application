const toastQueue = [];
const listeners = new Set();

export function showToast(message, type = 'success') {
  const id = Date.now() + Math.random();
  toastQueue.push({ id, message, type });
  listeners.forEach(fn => fn([...toastQueue]));
  setTimeout(() => {
    const idx = toastQueue.findIndex(t => t.id === id);
    if (idx !== -1) toastQueue.splice(idx, 1);
    listeners.forEach(fn => fn([...toastQueue]));
  }, 3500);
}

export function subscribeToast(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
