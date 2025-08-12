import WebsiteHead from '@/components/Frontend/Head';
import Section from '@/components/Frontend/section';
import { Fragment } from 'react';
import '../../../../css/our-team.css';
import MainLayout from '@/components/Layouts/MainLayout';
import PageLayout from '@/components/Layouts/PageLayout';
import TeamMember from '../TeamMember';

const TeamsArchive = ({ category, teams, featured_image, srcSet }) => {
  return (
    <MainLayout>
      <WebsiteHead
        title={category.meta_title ? category.meta_title : category.name}
        description={category.meta_description}
        image={
          featured_image
            ? featured_image.original_url
            : '/assets/logo-sawtee.webp'
        }
      />
      <PageLayout
        featured_image={featured_image}
        srcSet={srcSet}
        title={category.name}
        showBackgroundPattern={false}
      >
        <Section
          pb="80px"
          py={{ base: '24px', lg: '80px' }}
          px={{ base: '32px', lg: '80px' }}
          size={'full'}
          mx="auto"
        >
          <div className="container max-w-5xl p-5 md:p-10">
            <div className="mb-8 flex justify-center">
              <h3 className="mb-3 text-center text-3xl font-bold">
                Our Experts
              </h3>
            </div>

            {!teams.data || teams.data.length <= 0 ? (
              <div className="text-center">
                <p className="font-2xl md:text4xl">"No posts found"</p>
              </div>
            ) : (
              <div className="flex flex-col gap-10">
                {teams.data.map(post => {
                  return (
                    <Fragment key={post.id}>
                      <TeamMember member={post} />
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
};

export default TeamsArchive;
