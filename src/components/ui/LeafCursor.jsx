import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import leafIcon from '../../assets/icone.svg';

const OFFSET_X = 20;
const OFFSET_Y = 14;
const STIFFNESS = 120;
const DAMPING = 15;
const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary';

export default function LeafCursor() {
  const { pathname } = useLocation();
  const wrapRef = useRef(null);
  const leafRef = useRef(null);
  const enabled = !pathname.startsWith('/admin');

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    const mq = window.matchMedia;
    if (!mq || !mq('(pointer: fine)').matches || mq('(prefers-reduced-motion: reduce)').matches) return;
    const wrap = wrapRef.current;
    const leaf = leafRef.current;
    if (!wrap || !leaf) return;

    const s = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, rot: 0, rotV: 0, scale: 1, grow: 1, seen: false };
    let raf = 0;
    let last = 0;

    const frame = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000 || 0.016);
      last = now;
      const ax = (s.tx - s.x) * STIFFNESS - s.vx * DAMPING;
      const ay = (s.ty - s.y) * STIFFNESS - s.vy * DAMPING;
      s.vx += ax * dt;
      s.vy += ay * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;

      const speed = Math.hypot(s.vx, s.vy);
      const targetRot = Math.max(-38, Math.min(38, s.vx * 0.045)) - 16 + Math.sin(now / 420) * Math.min(8, speed * 0.012);
      s.rotV += ((targetRot - s.rot) * 70 - s.rotV * 11) * dt;
      s.rot += s.rotV * dt;
      const targetScale = s.grow * (1 + Math.min(0.18, speed / 4200));
      s.scale += (targetScale - s.scale) * Math.min(1, dt * 10);

      wrap.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0)`;
      leaf.style.transform = `rotate(${s.rot.toFixed(2)}deg) scale(${s.scale.toFixed(3)})`;

      const settled = speed < 4 && Math.abs(s.tx - s.x) < 0.3 && Math.abs(s.ty - s.y) < 0.3 && Math.abs(s.rotV) < 3 && Math.abs(targetRot - s.rot) < 0.4;
      raf = settled ? 0 : requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };

    const onMove = (e) => {
      s.tx = e.clientX + OFFSET_X;
      s.ty = e.clientY + OFFSET_Y;
      if (!s.seen) {
        s.seen = true;
        s.x = s.tx; s.y = s.ty;
        wrap.style.opacity = '1';
      }
      const t = e.target;
      s.grow = t && t.closest && t.closest(INTERACTIVE) ? 1.45 : 1;
      kick();
    };
    const onLeave = () => { wrap.style.opacity = '0'; s.seen = false; };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={wrapRef} aria-hidden="true"
      className="fixed top-0 left-0 z-[9999] pointer-events-none opacity-0 transition-opacity duration-300 will-change-transform hidden [@media(pointer:fine)]:block">
      <img ref={leafRef} src={leafIcon} alt="" draggable="false"
        className="block w-[22px] h-auto -ml-[11px] -mt-[16px] will-change-transform [filter:drop-shadow(0_3px_5px_rgba(0,40,20,0.35))]" />
    </div>
  );
}
