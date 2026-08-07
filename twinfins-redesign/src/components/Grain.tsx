/**
 * Film grain, matched to the VSCO-processed brand photography so the flat
 * UI surfaces sit on the same texture as the images.
 */
const NOISE = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="220" height="220" filter="url(#n)" opacity="0.55"/></svg>`;

export default function Grain() {
  return (
    <div
      className="grain"
      aria-hidden="true"
      style={
        {
          "--grain-url": `url("data:image/svg+xml;utf8,${encodeURIComponent(NOISE)}")`,
        } as React.CSSProperties
      }
    />
  );
}
