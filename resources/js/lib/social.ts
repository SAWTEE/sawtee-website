export type SocialSharePlatform = 'twitter' | 'facebook' | 'linkedin' | 'copy';

export const DEFAULT_SOCIAL_PROFILES = {
  twitterHandle: 'sawteenp',
  twitterUrl: 'https://x.com/sawteenp',
  facebookPageUrl: 'https://www.facebook.com/sawteenp/',
  linkedinCompanyUrl: 'https://www.linkedin.com/company/sawtee/',
} as const;

export function buildShareUrl(
  platform: Exclude<SocialSharePlatform, 'copy'>,
  options: { url: string; title?: string; summary?: string }
): string {
  const url = encodeURIComponent(options.url);
  const title = encodeURIComponent(options.title ?? '');
  const summary = encodeURIComponent(options.summary ?? options.title ?? '');

  switch (platform) {
    case 'twitter':
      return `https://x.com/intent/tweet?url=${url}&text=${title}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`;
  }
}
