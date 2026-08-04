import { TagsIcon } from 'lucide-react';

export default function PostTags({ tags }) {
  return (
    <div className="space-x-2">
      <TagsIcon className="inline h-5 w-5" />
      {tags.map(({ id, name }) => (
        <ClerkBadge key={id} text={name} color="theme" />
      ))}
    </div>
  );
}

export function ClerkBadge({ text, color }) {
  return (
    <span
      className={`relative px-[0.1875rem] text-[0.625rem]/[0.875rem] font-medium ${color ? `bg-${color}-50 text-${color}-500 dark:bg-${color}-950}` : 'bg-blue-50 text-blue-500 dark:bg-blue-950'}`}
    >
      {text ?? 'Clerk'}
      <span
        className={`absolute inset-x-[-0.1875rem] -top-px block transform-gpu ${color ? `text-${color}-200 dark:text-${color}-900` : 'text-blue-200 dark:text-blue-900'} `}
      >
        <svg
          width="100%"
          height="1"
          stroke="currentColor"
          strokeDasharray="3.3 1"
          aria-hidden="true"
        >
          <line x1="0" y1="0.5" x2="100%" y2="0.5" />
        </svg>
      </span>
      <span
        className={`absolute inset-x-[-0.1875rem] -bottom-px block transform-gpu ${color ? `text-${color}-200 dark:text-${color}-900` : 'text-blue-200 dark:text-blue-900'}`}
      >
        <svg
          width="100%"
          height="1"
          stroke="currentColor"
          strokeDasharray="3.3 1"
          aria-hidden="true"
        >
          <line x1="0" y1="0.5" x2="100%" y2="0.5" />
        </svg>
      </span>
      <span
        className={`absolute inset-y-[-0.1875rem] -left-px block transform-gpu ${color ? `text-${color}-200 dark:text-${color}-900` : 'text-blue-200 dark:text-blue-900'}`}
      >
        <svg
          width="1"
          height="100%"
          stroke="currentColor"
          strokeDasharray="3.3 1"
          aria-hidden="true"
        >
          <line x1="0.5" y1="0" x2="0.5" y2="100%" />
        </svg>
      </span>
      <span
        className={`absolute inset-y-[-0.1875rem] -right-px block transform-gpu ${color ? `text-${color}-200 dark:text-${color}-900` : 'text-blue-200 dark:text-blue-900'}`}
      >
        <svg
          width="1"
          height="100%"
          stroke="currentColor"
          strokeDasharray="3.3 1"
          aria-hidden="true"
        >
          <line x1="0.5" y1="0" x2="0.5" y2="100%" />
        </svg>
      </span>
    </span>
  );
}
