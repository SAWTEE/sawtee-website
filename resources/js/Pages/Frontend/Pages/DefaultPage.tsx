import type { ReactNode } from 'react';

type SectionLike = {
  title?: string;
  description?: string | null;
};

type DefaultPageProps = {
  sections?: SectionLike[] | null;
  content?: string | null;
  children?: ReactNode;
};

const DefaultPage = ({ sections, content, ...rest }: DefaultPageProps) => {
  return (
    <section
      className="page-content mx-auto max-w-2xl px-8 py-20 md:px-0"
      {...rest}
    >
      {content && <div dangerouslySetInnerHTML={{ __html: content }} />}

      {sections?.map(({ title, description }, index) => {
        return (
          <div key={index}>
            <h3 className="mb-4 py-4 text-lg md:text-xl xl:text-2xl">
              {title}
            </h3>
            {description && (
              <div dangerouslySetInnerHTML={{ __html: description }} />
            )}
          </div>
        );
      })}
    </section>
  );
};

export default DefaultPage;
