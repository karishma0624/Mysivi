import React, { useState } from 'react';
import clsx from 'clsx';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label = 'Copy',
  copiedLabel = 'Copied!',
  size = 'sm',
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label}
      className={clsx(
        'inline-flex items-center gap-1.5 font-semibold rounded-lg border transition-all duration-150 select-none active:scale-95',
        size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3.5 py-1.5',
        copied
          ? 'bg-[#E6F8EE] text-[#12A36B] border-[#BBF7D0]'
          : 'bg-white text-body border-[#ECE9F8] hover:border-[#DDD8F5] hover:text-ink hover:bg-lavender-50 shadow-sm',
        className
      )}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-[#12A36B]" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
};
