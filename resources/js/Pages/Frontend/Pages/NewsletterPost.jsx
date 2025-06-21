import { Button } from '@/components/ui/button';
import { htmlToText } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';

const NewsletterPost = ({ post }) => {
  const viewerConfig = {
    embedMode: 'IN_LINE',
    defaultViewMode: 'CONTINUOUS',
    showDownloadPDF: true,
    showPrintPDF: true,
  };

  const ENV = import.meta.env.VITE_APP_ENV;

  const Adobe_PDF_API =
    ENV === 'developement'
      ? import.meta.env.VITE_DEV_ENV_ADOBE_PDF_EMBED_API
      : import.meta.env.VITE_PROD_ENV_ADOBE_PDF_EMBED_API_2;

  const pdf = post.media.filter(m => m.collection_name === 'post-files')[0];

  useEffect(() => {
    document.addEventListener('adobe_dc_view_sdk.ready', () => {
      /* Initialize the AdobeDC View object */
      // const adobeDCView = new AdobeDC.View({
      const adobeDCView = new AdobeDC.View({
        clientId:
          'a216d6a763e14deda203664862f3dead' ||
          'a0b938dc0dda4ceba3ce648ec3caeb6a',
        divId: 'adobe-dc-view',
      });
      adobeDCView.previewFile(
        {
          content: {
            location: {
              url: pdf.original_url,
            },
          },
          metaData: {
            fileName: post.title,
          },
        },
        viewerConfig
      );
    });

    () => document.removeEventListener('adobe_dc_view_sdk.ready');
  }, []);
  return (
    <div className="pt-10">


      {post.content ? (
        <div className="container mx-auto max-w-7xl">
          <div className="newsletter-html">{htmlToText(post.content)}</div>
          <Link href={pdf.original_url}>
            <Button variant="outline">View PDF</Button>
          </Link>
        </div>
      ) : (
        <div
          id="adobe-dc-view"
          className="full-window-div mx-auto w-full"
        ></div>
      )}
    </div>
  );
};

export default NewsletterPost;
