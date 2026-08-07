import '../../../../css/our-team.css';
import { mainWithPageLayout } from '@/lib/page-layouts';

import { Fragment } from 'react';

import WebsiteHead from '@/components/Frontend/Head';
import Section from '@/components/Frontend/section';
import type { FrontendTeamsArchiveProps, Team } from '@/types';

import TeamMember from '../TeamMember';

function TeamsArchive({
  category,
  teams,
  featured_image = null,
  srcSet = null,
  seo,
}: FrontendTeamsArchiveProps) {
  const image =
    typeof featured_image === 'string' && featured_image !== ''
      ? featured_image
      : '/assets/logo-sawtee.webp';

  return (
    <>
      <WebsiteHead
        title={
          seo?.title ??
          (category.meta_title ? category.meta_title : category.name)
        }
        description={seo?.description ?? category.meta_description ?? undefined}
        image={seo?.image ?? image}
        url={seo?.url}
        type={seo?.type}
        jsonLd={seo?.jsonLd}
      />
      <Section className="mx-auto max-w-full px-8 py-6 lg:px-20 lg:py-20">
        <div className="container max-w-5xl p-5 md:p-10">
          <div className="mb-8 flex justify-center">
            <h3 className="mb-3 text-center text-3xl font-bold">Our Experts</h3>
          </div>

          {!teams.data || teams.data.length <= 0 ? (
            <div className="text-center">
              <p className="font-2xl md:text4xl">No posts found</p>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {teams.data.map((member: Team) => {
                return (
                  <Fragment key={member.id}>
                    <TeamMember member={member} />
                  </Fragment>
                );
              })}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}

TeamsArchive.layout = mainWithPageLayout(props => ({
  title: props.category.name,
  featured_image:
    typeof props.featured_image === 'string' ? props.featured_image : null,
  srcSet: props.srcSet,
}));

export default TeamsArchive;
