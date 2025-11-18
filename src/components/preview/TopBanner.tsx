'use client';

interface TopBannerProps {
  text: string;
}

export function TopBanner({ text }: TopBannerProps) {
  return (
    <div className="bg-accent py-3 px-4 text-center">
      <span className="text-accent-foreground font-bold text-sm">{text}</span>
    </div>
  );
}
