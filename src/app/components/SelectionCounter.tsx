"use client";

interface Props {
  selectedCount: number;
}

export default function SelectionCounter({ selectedCount }: Props) {
  if (!selectedCount) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
      {selectedCount} selected
    </div>
  );
}
