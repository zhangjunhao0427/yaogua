const pad = (n: number) => String(n).padStart(2, '0');

export function formatDate(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function formatDateTime(ms: number): string {
  const d = new Date(ms);
  return `${formatDate(ms)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
