export function getTimestamp() {
  return new Date().toISOString();
}

export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: "numeric",
    hour: 'numeric',
    minute: 'numeric',
    second: "2-digit",
    hour12: false,
  });
}