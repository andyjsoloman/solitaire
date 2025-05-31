export function formatTime(seconds, blink = false) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const colon = blink
    ? Math.floor(Date.now() / 500) % 2 === 0
      ? ":"
      : "\u00A0" // non-breaking space (invisible, but same width)
    : ":";

  const h = hrs > 0 ? `${hrs.toString().padStart(2, "0")}${colon}` : "";
  const m = mins.toString().padStart(2, "0");
  const s = secs.toString().padStart(2, "0");

  return `${h}${m}${colon}${s}`;
}
