"use client";

export interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="h-8 bg-discord-darker flex items-center justify-center">
      <h1 className="text-base text-discord-text-normal">{title}</h1>
    </div>
  );
}
