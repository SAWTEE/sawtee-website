import '../../../../css/our-team.css';

import { Fragment } from 'react';

import WebsiteHead from '@/components/Frontend/Head';
import Section from '@/components/Frontend/section';
import MainLayout from '@/layouts/MainLayout';
import PageLayout from '@/layouts/PageLayout';
import type { FrontendTeamsArchiveProps, Team } from '@/types';

import TeamMember from '../TeamMember';

export default function TeamsArchive({
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
    <MainLayout>
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
      <PageLayout
        featured_image={
          typeof featured_image === 'string' ? featured_image : null
        }
        srcSet={srcSet}
        title={category.name}
        showBackgroundPattern={false}
      >
        <Section className="mx-auto max-w-full px-8 py-6 lg:px-20 lg:py-20">
          <div className="container max-w-5xl p-5 md:p-10">
            <div className="mb-8 flex justify-center">
              <h3 className="mb-3 text-center text-3xl font-bold">
                Our Experts
              </h3>
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
      </PageLayout>
    </MainLayout>
  );
}
