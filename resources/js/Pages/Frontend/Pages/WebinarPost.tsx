import { Button } from '@/components/ui/button';
import { htmlToText } from '@/lib/utils';
import type { Post } from '@/types';

type WebinarPostProps = {
  post: Post & { link?: string | null };
};

const WebinarPost = ({ post }: WebinarPostProps) => {
  const file = post.media?.filter((m: any) => m.collection_name === 'post-files')[0];
  return (
    <div>
      <div className="mb-6">{htmlToText(post.content)}</div>
      <Button>
        <a target="_blank" href={file?.original_url} rel="noreferrer">
          Summary of Proceedings
        </a>
      </Button>
      <div className="mt-6 aspect-video">
        <iframe
          width="700"
          height="400"
          src={post.link ?? undefined}
          title={post.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen={true}
        ></iframe>
      </div>
    </div>
  );
};

export default WebinarPost;
