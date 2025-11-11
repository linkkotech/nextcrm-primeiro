"use client";

interface MobilePreviewProps {
  templateName?: string;
  previewUrl?: string;
}

export function MobilePreview({ templateName = "Template", previewUrl = "example.com" }: MobilePreviewProps) {
  return (
    <div className="flex h-full w-full flex-col">
      {/* Top Info Bar */}
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground capitalize">
          {templateName}
        </h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span>
            Seu link é <span className="text-primary">{previewUrl}</span>
          </span>
        </div>
      </div>

      {/* Mobile Frame Wrapper */}
      <div className="flex flex-1 items-center justify-center">
        <div className="relative w-[320px] rounded-3xl bg-black shadow-2xl overflow-hidden border-8 border-black">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10" />

          {/* Screen Content */}
          <div className="flex h-[640px] w-full flex-col overflow-hidden bg-gradient-to-b from-blue-400 to-blue-600">
            {/* Status Bar Placeholder */}
            <div className="flex h-8 items-center justify-between bg-black/20 px-4 text-xs text-white">
              <span>9:41</span>
              <div className="flex gap-1">
                <span>📶</span>
                <span>🔋</span>
              </div>
            </div>

            {/* Hero Section Preview */}
            <div className="flex flex-1 items-center justify-center border-b-2 border-blue-300/50 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700">
              <div className="px-4 text-center text-xs text-white">
                <p className="mb-1 text-sm font-semibold">Hero</p>
                <p className="text-blue-100">Preview (em breve)</p>
              </div>
            </div>

            {/* Dynamic Content Area */}
            <div className="flex flex-1 items-center justify-center overflow-y-auto bg-white/10 px-4">
              <div className="text-center text-xs text-white">
                <p className="text-white/70">Conteúdo dinâmico</p>
              </div>
            </div>

            {/* Menu Mobile Preview */}
            <div className="flex h-16 items-center justify-center gap-2 border-t-2 border-blue-700 bg-blue-800 px-2">
              <div className="flex h-10 flex-1 items-center justify-center rounded bg-blue-700 text-xs font-semibold text-white">
                Menu
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Caption */}
      <p className="mt-6 text-xs text-muted-foreground">Preview</p>
    </div>
  );
}
