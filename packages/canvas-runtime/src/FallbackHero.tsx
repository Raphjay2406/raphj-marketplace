import React from "react";

export function FallbackHero({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1 }}>
      <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}
