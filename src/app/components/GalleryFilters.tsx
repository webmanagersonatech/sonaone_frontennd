"use client";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  year: string | number;
  onYearChange: (value: string) => void;
  template: string;
  onTemplateChange: (value: string) => void;
  title: string;
  onTitleChange: (value: string) => void;
  selectedCount: number;
  onCreate: () => void;
}

export default function GalleryFilters({
  search,
  onSearchChange,
  year,
  onYearChange,
  template,
  onTemplateChange,
  title,
  onTitleChange,
  selectedCount,
  onCreate,
}: Props) {
  return (
    <div className="bg-white shadow-md rounded-xl -mt-6 relative z-30 max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search photos..."
          className="w-full h-12 px-4 rounded-lg border-gray-300 border focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* Year */}
        <select
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          className="w-full h-12 px-3 rounded-lg border-gray-300 border"
        >
          <option value="">All Years</option>
          {Array.from({ length: 70 }).map((_, i) => {
            const y = 2025 - i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>

        {/* Template */}
        <select
          value={template}
          onChange={(e) => onTemplateChange(e.target.value)}
          className="w-full h-12 px-3 rounded-lg border-gray-300 border"
        >
          <option value="classic">Classic Grid</option>
          <option value="polaroid">Polaroid Cards</option>
          <option value="social">Social Banner</option>
          <option value="masonry">Masonry</option>
          <option value="diagonal">Diagonal</option>
          <option value="custom">Custom Layout</option>
          <option value="manual">Manual Layout</option>
        </select>

        {/* Title */}
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Collage Title"
          className="w-full h-12 px-4 rounded-lg border-gray-300 border focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* Button */}
        <button
          disabled={selectedCount < 2}
          onClick={onCreate}
          className={`h-12 w-full px-6 text-white font-medium rounded-lg transition
          ${
            selectedCount < 2
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.03] shadow-md"
          }`}
        >
          Create Collage ({selectedCount})
        </button>
      </div>
    </div>
  );
}
