import { Button } from '@/components/ui/button';
import { htmlToText } from '@/lib/utils';

const WebinarPost = ({ post }) => {
  const file = post.media.filter(m => m.collection_name === 'post-files')[0];
  return (
    <div>
      <div className="mb-6">{htmlToText(post.content)}</div>
      <Button>
        <a target="_blank" href={file?.original_url}>
          Summary of Proceedings
        </a>
      </Button>
      <div className="mt-6 aspect-video">
        <iframe
          width="700"
          height="400"
          src={post.link}
          title={post.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowfullscreen={true}
        ></iframe>
      </div>
    </div>
  );
};

export default WebinarPost;
