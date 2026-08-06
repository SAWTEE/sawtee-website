import { Button } from '@/components/ui/button';
import { htmlToText } from '@/lib/utils';
import type { Post } from '@/types';

type WebinarPostProps = {
  post: Post & { link?: string | null };
};

const WebinarPost = ({ post }: WebinarPostProps) => {
  const file = post.media?.filter(m => m.collection_name === 'post-files')[0];
  return (
    <div>
      <div className="mb-6">{htmlToText(post.content)}</div>
      {file?.original_url ? (
        <Button asChild>
          <a
            target="_blank"
            href={file.original_url}
            rel="noopener noreferrer"
          >
            Summary of Proceedings
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Button>
      ) : null}
      {post.link ? (
        <div className="mt-6 aspect-video">
          <iframe
            width="700"
            height="400"
            src={post.link}
            title={`Video: ${post.title}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen={true}
          ></iframe>
        </div>
      ) : null}
    </div>
  );
};

export default WebinarPost;
