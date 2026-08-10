import { Check, Copy, Facebook, Linkedin, Share2 } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';

import { buildShareUrl, type SocialSharePlatform } from '@/lib/social';
import { cn } from '@/lib/utils';

type SocialShareProps = {
  url?: string;
  title?: string;
  summary?: string;
  platforms?: SocialSharePlatform[];
  className?: string;
  label?: string;
};

const DEFAULT_PLATFORMS: SocialSharePlatform[] = [
  'twitter',
  'facebook',
  'linkedin',
  'copy',
];

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

export default function SocialShare({
  url,
  title = '',
  summary = '',
  platforms = DEFAULT_PLATFORMS,
  className = '',
  label = 'Share',
}: SocialShareProps) {
  const [shareUrl, setShareUrl] = useState(url ?? '');
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (url) {
      setShareUrl(url);
      return;
    }

    setShareUrl(window.location.href);
  }, [url]);

  useEffect(() => {
    setCanNativeShare(typeof navigator.share === 'function');
  }, []);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const openShare = (platform: Exclude<SocialSharePlatform, 'copy'>) => {
    if (!shareUrl) {
      return;
    }

    const href = buildShareUrl(platform, {
      url: shareUrl,
      title,
      summary,
    });

    window.open(href, '_blank', 'noopener,noreferrer,width=640,height=640');
  };

  const copyLink = async () => {
    if (!shareUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      window.prompt('Copy this link', shareUrl);
    }
  };

  const nativeShare = async () => {
    if (!shareUrl || typeof navigator.share !== 'function') {
      return;
    }

    try {
      await navigator.share({
        title,
        text: summary || title,
        url: shareUrl,
      });
    } catch {
      // User cancelled or share failed — ignore.
    }
  };

  return (
    <div
      className={cn(
        'border-theme-200/80 dark:border-theme-700/60 flex flex-wrap items-center gap-3 border-t pt-6',
        className
      )}
    >
      <div className="text-secondary-foreground/80 flex items-center gap-2 text-sm font-medium">
        <Share2 className="h-4 w-4" aria-hidden />
        <span>{label}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {canNativeShare ? (
          <button
            type="button"
            onClick={nativeShare}
            className="border-theme-200 text-secondary-foreground hover:bg-theme-50 dark:border-theme-700 dark:hover:bg-theme-900/60 inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition"
          >
            Share…
          </button>
        ) : null}

        {platforms.includes('twitter') ? (
          <ShareIconButton
            label="Share on X"
            onClick={() => openShare('twitter')}
          >
            <XIcon className="h-4 w-4" />
          </ShareIconButton>
        ) : null}

        {platforms.includes('facebook') ? (
          <ShareIconButton
            label="Share on Facebook"
            onClick={() => openShare('facebook')}
          >
            <Facebook className="h-4 w-4" />
          </ShareIconButton>
        ) : null}

        {platforms.includes('linkedin') ? (
          <ShareIconButton
            label="Share on LinkedIn"
            onClick={() => openShare('linkedin')}
          >
            <Linkedin className="h-4 w-4" />
          </ShareIconButton>
        ) : null}

        {platforms.includes('copy') ? (
          <ShareIconButton
            label={copied ? 'Link copied' : 'Copy link'}
            onClick={copyLink}
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </ShareIconButton>
        ) : null}
      </div>
    </div>
  );
}

function ShareIconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="border-theme-200 text-secondary-foreground hover:bg-theme-50 dark:border-theme-700 dark:hover:bg-theme-900/60 inline-flex h-9 w-9 items-center justify-center rounded-full border transition"
    >
      {children}
    </button>
  );
}
