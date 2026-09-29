/** The hero departure board — split-flap cells cycling through live-looking rows. */
import { useEffect, useState } from "react";
import { BOARD_ROWS } from "./config";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const reduced =
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function Flap({ char, delay }: { char: string; delay: number }) {
  const [shown, setShown] = useState(reduced ? char : " ");
  useEffect(() => {
    if (reduced) {
      setShown(char);
      return;
    }
    let ticks = 0;
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        ticks += 1;
        if (ticks >= 6) {
          setShown(char);
          clearInterval(timer);
        } else {
          setShown(char === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
        }
      }, 50);
    }, delay);
    return () => {
      clearTimeout(start);
      if (timer) clearInterval(timer);
    };
  }, [char, delay]);
  return (
    <span className="flap" aria-hidden="true">
      {shown}
    </span>
  );
}

function FlapText({ text, width, base = 0 }: { text: string; width: number; base?: number }) {
  const chars = text.toUpperCase().padEnd(width, " ").slice(0, width).split("");
  return (
    <span className="flaps" aria-label={text}>
      {chars.map((c, i) => (
        <Flap key={`${i}-${c}`} char={c} delay={base + i * 40} />
      ))}
    </span>
  );
}

export function Board() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const h = setInterval(() => setOffset((o) => (o + 1) % BOARD_ROWS.length), 3200);
    return () => clearInterval(h);
  }, []);
  const rows = Array.from({ length: 5 }, (_, i) => BOARD_ROWS[(offset + i) % BOARD_ROWS.length]);
  const now = new Date();
  const clock = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return (
    <figure className="board" data-testid="hero-board" aria-label="Example departure board of parcel bookings">
      <div className="board-head">
        <span>DEPARTURES · PARCEL OFFICE</span>
        <span className="board-live">● {clock}</span>
      </div>
      <div className="board-cols" aria-hidden="true">
        <span>TRAIN</span>
        <span>TO</span>
        <span>PKG</span>
        <span>STATUS</span>
      </div>
      {rows.map(([train, to, pkg, status], i) => (
        <div className="board-row" key={`${offset}-${i}`}>
          <FlapText text={train} width={5} base={i * 60} />
          <FlapText text={to} width={4} base={i * 60 + 200} />
          <span className="board-mono">{pkg}</span>
          <span className={`board-mono status-${status.split(" ")[0].toLowerCase()}`}>{status}</span>
        </div>
      ))}
    </figure>
  );
}
