'use client';

export function StatusBar() {
  return (
    <div className="h-10 bg-slate-700 flex items-center justify-between px-4 text-slate-100 text-xs font-medium">
      <span>9:41</span>
      <div className="flex gap-1 items-center">
        <span>📶</span>
        <span>🔋</span>
      </div>
    </div>
  );
}
