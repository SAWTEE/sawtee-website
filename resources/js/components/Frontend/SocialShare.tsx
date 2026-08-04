import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterShareButton,
  XIcon,
} from 'react-share';

const SocialShare = ({ url, title, excerpt }) => {
  return (
    <div className="mt-8">
      <div className="flex gap-4">
        <p className="text-2xl font-semibold">Share: </p>
        <FacebookShareButton url={url}>
          <FacebookIcon size="28px" />
        </FacebookShareButton>
        <TwitterShareButton url={url} title={title} related={['SAWTEENP']}>
          <XIcon size="28px" />
        </TwitterShareButton>
        <LinkedinShareButton
          url={url}
          title={title}
          summary={excerpt}
          source="SAWTEE"
        >
          <LinkedinIcon size="28px" />{' '}
        </LinkedinShareButton>

        <EmailShareButton url={url}>
          <EmailIcon size="28px" />
        </EmailShareButton>
      </div>
    </div>
  );
};

export default SocialShare;
