import React from "react";

export function HistoryItem({ date, title, description }) {
  return (
    <div className="relative pl-6 pb-2">
      {/* Timeline dot and line */}
      <div className="absolute left-0 top-2 h-3 w-3 rounded-full bg-[#6366f1]"></div>
      <div className="absolute left-1.5 top-5 bottom-0 w-0.5 bg-gray-200"></div>

      <div>
        <span className="text-sm text-gray-500">{date}</span>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}