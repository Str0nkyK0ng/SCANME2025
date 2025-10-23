// scanline overlay: create animated black-looking scan lines that invert content below them
function createScanlines({
  stripeHeight = 10, // px
  gap = 10, // px between stripes
  duration = 1600, // ms for one cycle
  zIndex = 100, // requested z-100
} = {}) {
  // remove existing if re-run
  const existing = document.querySelector('.scanlines-overlay');
  if (existing) existing.remove();

  const style = document.createElement('style');
  const stripeTotal = stripeHeight + gap;
  style.textContent = `
.scanlines-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: ${zIndex};
    /* repeating stripes: white strips will use mix-blend-mode: difference to invert underlying colors */
    background-image: repeating-linear-gradient(
        to bottom,
        rgba(255,255,255,0.95) 0 ${stripeHeight}px,
        rgba(255,255,255,0) ${stripeHeight}px ${stripeTotal}px
    );
    mix-blend-mode: difference;
    /* make the overlay itself mostly transparent so only the stripe effect shows */
    opacity: 1;
    will-change: background-position;
    animation: scanlines-slide ${duration}ms linear infinite;
    -webkit-tap-highlight-color: transparent;
}
/* fallback for browsers preferring backdrop-filter (optional) */
.scanlines-overlay.backdrop-invert {
    background-image: repeating-linear-gradient(
        to bottom,
        rgba(0,0,0,0.9) 0 ${stripeHeight}px,
        rgba(0,0,0,0) ${stripeHeight}px ${stripeTotal}px
    );
    backdrop-filter: invert(1);
    -webkit-backdrop-filter: invert(1);
    mix-blend-mode: normal;
}

@keyframes scanlines-slide {
    from { background-position: 0 0; }
    to   { background-position: 0 ${stripeTotal}px; }
}
`;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.className = 'scanlines-overlay';
  // If you'd rather use backdrop-filter inversion (may look different / has limited support),
  // toggle the class 'backdrop-invert' on overlay instead of the default mix-blend-mode approach.
  // overlay.classList.add('backdrop-invert');

  document.body.appendChild(overlay);
}

// call to start scanlines
createScanlines({
  stripeHeight: 8,
  gap: 12,
  duration: 1400,
  zIndex: 100, // z-100 as requested
});
