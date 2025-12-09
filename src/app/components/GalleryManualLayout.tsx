"use client";

interface Props {
  visible: boolean;
}

export default function GalleryManualLayout({ visible }: Props) {
  if (!visible) return null;

  return (
    <div className="collage-controls mb-10">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        Manual Collage Layout
      </h3>

      <div className="collage-dimensions flex gap-4">
        <input id="canvasWidth" defaultValue={1200} />
        <input id="canvasHeight" defaultValue={800} />
        <input id="bgColor" type="color" defaultValue="#ffffff" />
        <input id="spacing" defaultValue={10} />
      </div>

      <div className="collage-actions flex gap-4 mt-4">
        <button id="applyCanvasSettings">Apply</button>
        <button id="resetLayout">Reset</button>
        <button id="generateManualCollage">Generate</button>
      </div>

      <div id="collageCanvas" className="collage-canvas"></div>
      <div id="collagePreviewGrid"></div>
    </div>
  );
}
