type SocialPlatform = 'whatsapp' | 'instagram' | 'tiktok';

type SocialIconProps = {
  platform: SocialPlatform;
  href: string;
  className?: string;
};

const platformLabels: Record<SocialPlatform, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  tiktok: 'TikTok',
};

function PlatformIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === 'instagram') {
    return (
      <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
        <rect height="17" rx="5" stroke="currentColor" strokeWidth="2" width="17" x="3.5" y="3.5" />
        <circle cx="12" cy="12" r="3.75" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.75" cy="6.25" fill="currentColor" r="1" />
      </svg>
    );
  }

  if (platform === 'tiktok') {
    return (
      <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
        <path
          d="M14.25 4v10.15a4.25 4.25 0 1 1-3.5-4.18v2.4a2 2 0 1 0 1.25 1.86V4h2.25Zm0 0c.4 2.2 1.7 3.45 4 3.85v2.35c-1.55-.16-2.86-.72-4-1.68"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M20 11.65a8 8 0 0 1-11.84 7L4 20l1.36-4.04A8 8 0 1 1 20 11.65Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M9 8.25c.2 3.15 2.2 5.15 5.35 5.35l1.15-1.15c.25-.25.6-.33.92-.2.66.27 1.36.41 2.08.42"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function SocialIcon({ platform, href, className = '' }: SocialIconProps) {
  const label = platformLabels[platform];

  return (
    <a
      aria-label={`Siga a Hermex no ${label}`}
      className={`inline-flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition-colors hover:border-brand-primary-pure hover:bg-brand-primary-pure hover:text-brand-secondary-pure focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-pure ${className}`}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <PlatformIcon platform={platform} />
    </a>
  );
}
