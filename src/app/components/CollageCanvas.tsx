"use client";

import { useEffect, useRef, useState } from "react";

type Img = {
  id: number;
  url: string;
  thumb: string;
  year: number;
  type: string;
  title: string;
};

const layouts = {
  grid2x2: { rows: 2, cols: 2 },
  grid3x3: { rows: 3, cols: 3 },
  stripH: { rows: 1, cols: 4 },
  stripV: { rows: 4, cols: 1 },
} as const;

type LayoutKey = keyof typeof layouts;

export default function CollageCanvas({ images }: { images: Img[] }) {
  
  const [layout, setLayout] = useState<LayoutKey>("grid2x2");
  const [size, setSize] = useState(1000);
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /** ✅ Draw collage */
  const draw = async () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const { rows, cols } = layouts[layout];

    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const pad = 10;
    const cellW = (size - pad * (cols + 1)) / cols;
    const cellH = (size - pad * (rows + 1)) / rows;

    // Load images
    const imgs = await Promise.all(
      images.slice(0, rows * cols).map(
        (i) =>
          new Promise<HTMLImageElement>((res, rej) => {
            const im = new Image();
            im.crossOrigin = "anonymous";
            im.onload = () => res(im);
            im.onerror = rej;
            im.src = i.url;
          })
      )
    );

    // Draw images
    imgs.forEach((im, idx) => {
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      const x = pad + c * (cellW + pad);
      const y = pad + r * (cellH + pad);
      const ratio = Math.min(cellW / im.width, cellH / im.height);
      const w = im.width * ratio;
      const h = im.height * ratio;
      const cx = x + (cellW - w) / 2;
      const cy = y + (cellH - h) / 2;

      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(x, y, cellW, cellH);
      ctx.drawImage(im, cx, cy, w, h);
    });

    // ✅ Title watermark
    ctx.fillStyle = "#222";
    ctx.font = `${Math.floor(size * 0.035)}px sans-serif`;
    ctx.fillText("Sona One — Collage", pad, size - pad);
  };

  useEffect(() => {
    draw();
    // eslint-disable-next-line
  }, [layout, size, images]);

  /** ✅ Download Collage */
  const download = async () => {
    setDownloading(true);
    try {
      const url = canvasRef.current!.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "Sona-One-Collage.png";
      a.click();
    } finally {
      setDownloading(false);
    }
  };

  /** ✅ Share via Phone Apps */
  const share = async () => {
    const blob: Blob = await new Promise((res) =>
      canvasRef.current!.toBlob((b) => res(b!), "image/png")
    );
    const file = new File([blob], "Sona-One-Collage.png", {
      type: "image/png",
    });

    if (navigator.share && (navigator as any).canShare?.({ files: [file] })) {
      await navigator.share({
        title: "Sona One Collage",
        text: "Made with Sona One Gallery",
        files: [file],
      });
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Sona-One-Collage.png";
      a.click();
      URL.revokeObjectURL(url);
      alert("Sharing unsupported. Collage downloaded.");
    }
  };

  return (
    <div className="space-y-4">
      {/* ✅ Controls */}
      <div className="p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-white text-xs">Layout</label>
          <select
            className="mt-1 h-10 px-3 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white"
            value={layout}
            onChange={(e) => setLayout(e.target.value as LayoutKey)}
          >
            <option value="grid2x2">2 × 2</option>
            <option value="grid3x3">3 × 3</option>
            <option value="stripH">Horizontal Strip</option>
            <option value="stripV">Vertical Strip</option>
          </select>
        </div>

        <div>
          <label className="text-white text-xs">Size</label>
          <select
            className="mt-1 h-10 px-3 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          >
            <option value={800}>800 px</option>
            <option value={1000}>1000 px</option>
            <option value={1600}>1600 px</option>
            <option value={2000}>2000 px</option>
          </select>
        </div>

        <div className="ml-auto flex gap-3">
          <button
            onClick={download}
            disabled={downloading}
            className="px-4 py-2 text-white rounded-lg bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-md"
          >
            {downloading ? "Preparing..." : "Download"}
          </button>

          <button
            onClick={share}
            className="px-4 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            Share
          </button>
        </div>
      </div>

      {/* ✅ Canvas Preview */}
      <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md p-3 shadow-md overflow-auto">
        <canvas ref={canvasRef} className="mx-auto block" />
      </div>
    </div>
  );
}
