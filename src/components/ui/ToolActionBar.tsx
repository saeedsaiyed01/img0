"use client";

import { ReactNode, useEffect, useRef } from "react";

export function ToolActionBar({ children, visible = true }: { children: ReactNode; visible?: boolean }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!visible || !barRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const height = entry.target.getBoundingClientRect().height;
      wrapperRef.current?.style.setProperty("--tool-action-height", `${height}px`);
    });
    observer.observe(barRef.current);
    return () => observer.disconnect();
  }, [visible]);
  if (!visible) return null;
  return <div ref={wrapperRef} className="tool-action-space"><div ref={barRef} className="tool-action-bar">{children}</div></div>;
}
