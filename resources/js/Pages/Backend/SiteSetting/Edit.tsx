import { Head, useForm } from '@inertiajs/react';

import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';
import { SITE_COPY_DEFAULTS } from '@/lib/site-copy';
import type { SiteCopy } from '@/types';

function SectionHeading({
  children,
  description,
}: {
  children: string;
  description: string;
}) {
  return (
    <div className="border-border mt-8 flex flex-col gap-1 border-b pb-2">
      <h2 className="text-lg font-semibold">{children}</h2>
      <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function Edit({ settings }: { settings: SiteCopy }) {
  const initial = { ...SITE_COPY_DEFAULTS, ...settings };
  const { data, setData, patch, processing, errors, transform } = useForm({
    ...initial,
    globe_markers_json: JSON.stringify(initial.globe_markers ?? [], null, 2),
    mobile_menu_json: JSON.stringify(initial.mobile_menu ?? [], null, 2),
    error_pages_json: JSON.stringify(initial.errors?.pages ?? {}, null, 2),
    sector_images_json: JSON.stringify(
      initial.our_work?.sector_images ?? {},
      null,
      2
    ),
    search_examples: (initial.search?.examples ?? []).join(', '),
  });
  const { toast } = useToast();

  transform(formData => ({
    about_intro: formData.about_intro,
    social_menu: formData.social_menu,
    footer: formData.footer,
    newsletter: formData.newsletter,
    home: formData.home,
    our_work: {
      ...formData.our_work,
      sector_images: formData.sector_images_json,
    },
    reform_monitor: formData.reform_monitor,
    errors: {
      ...formData.errors,
      pages: formData.error_pages_json,
    },
    globe_markers: formData.globe_markers_json,
    mobile_menu: formData.mobile_menu_json,
    contact: formData.contact,
    media_fellows: formData.media_fellows,
    about: formData.about,
    search: {
      ...formData.search,
      examples: formData.search_examples
        .split(',')
        .map((item: string) => item.trim())
        .filter(Boolean),
    },
    seo: formData.seo,
  }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    patch(route('admin.settings.update'), {
      preserveScroll: true,
      onSuccess: () =>
        toast({
          title: 'Settings saved.',
          description: 'Public site copy was updated.',
        }),
      onError: formErrors => toastFormErrors(formErrors, toast),
    });
  };

  return (
    <>
      <Head title="Site settings" />

      <form onSubmit={submit} noValidate className="max-w-4xl space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          These strings appear on the public site. Home-page section headings
          still live under Home Page Sections; feature cards are under Features.
        </p>

        <SectionHeading description="Shown in the Know Us header mega menu as the About intro.">
          Know Us
        </SectionHeading>
        <FormField
          id="about_intro"
          label="Mega-menu intro"
          error={errors.about_intro}
        >
          {field => (
            <Textarea
              {...field}
              rows={6}
              value={data.about_intro}
              onChange={e => setData('about_intro', e.target.value)}
            />
          )}
        </FormField>

        <SectionHeading description="Header and footer social icons on every public page. Contact-page icons still come from that page’s JSON.">
          Social links
        </SectionHeading>
        {(data.social_menu ?? []).map((item, index) => (
          <div key={index} className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            <FormField
              id={`social_name_${index}`}
              label="Name"
              error={errors[`social_menu.${index}.name`]}
              className="sm:col-span-2"
            >
              {field => (
                <Input
                  {...field}
                  value={item.name}
                  onChange={e => {
                    const next = [...data.social_menu];
                    next[index] = { ...item, name: e.target.value };
                    setData('social_menu', next);
                  }}
                />
              )}
            </FormField>
            <FormField
              id={`social_link_${index}`}
              label="URL"
              error={errors[`social_menu.${index}.link`]}
              className="sm:col-span-3"
            >
              {field => (
                <Input
                  {...field}
                  value={item.link}
                  onChange={e => {
                    const next = [...data.social_menu];
                    next[index] = { ...item, link: e.target.value };
                    setData('social_menu', next);
                  }}
                />
              )}
            </FormField>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setData('social_menu', [
              ...data.social_menu,
              { name: '', link: '' },
            ])
          }
        >
          Add social link
        </Button>

        <SectionHeading description="Site-wide footer: tagline, About/Contact/Substack links, copyright, and the map that opens from the address.">
          Footer
        </SectionHeading>
        <FormField
          id="footer_tagline"
          label="Tagline"
          error={errors['footer.tagline']}
        >
          {field => (
            <Textarea
              {...field}
              rows={3}
              value={data.footer.tagline}
              onChange={e =>
                setData('footer', { ...data.footer, tagline: e.target.value })
              }
            />
          )}
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField id="footer_about_label" label="About label">
            {field => (
              <Input
                {...field}
                value={data.footer.about_label}
                onChange={e =>
                  setData('footer', {
                    ...data.footer,
                    about_label: e.target.value,
                  })
                }
              />
            )}
          </FormField>
          <FormField id="footer_about_href" label="About URL">
            {field => (
              <Input
                {...field}
                value={data.footer.about_href}
                onChange={e =>
                  setData('footer', {
                    ...data.footer,
                    about_href: e.target.value,
                  })
                }
              />
            )}
          </FormField>
          <FormField id="footer_contact_label" label="Contact label">
            {field => (
              <Input
                {...field}
                value={data.footer.contact_label}
                onChange={e =>
                  setData('footer', {
                    ...data.footer,
                    contact_label: e.target.value,
                  })
                }
              />
            )}
          </FormField>
          <FormField id="footer_contact_href" label="Contact URL">
            {field => (
              <Input
                {...field}
                value={data.footer.contact_href}
                onChange={e =>
                  setData('footer', {
                    ...data.footer,
                    contact_href: e.target.value,
                  })
                }
              />
            )}
          </FormField>
          <FormField id="footer_substack_label" label="Substack label">
            {field => (
              <Input
                {...field}
                value={data.footer.substack_label}
                onChange={e =>
                  setData('footer', {
                    ...data.footer,
                    substack_label: e.target.value,
                  })
                }
              />
            )}
          </FormField>
          <FormField id="footer_copyright" label="Copyright name">
            {field => (
              <Input
                {...field}
                value={data.footer.copyright_name}
                onChange={e =>
                  setData('footer', {
                    ...data.footer,
                    copyright_name: e.target.value,
                  })
                }
              />
            )}
          </FormField>
        </div>
        <FormField id="footer_map_title" label="Map title">
          {field => (
            <Input
              {...field}
              value={data.footer.map_title}
              onChange={e =>
                setData('footer', { ...data.footer, map_title: e.target.value })
              }
            />
          )}
        </FormField>
        <FormField id="footer_map_description" label="Map description">
          {field => (
            <Input
              {...field}
              value={data.footer.map_description}
              onChange={e =>
                setData('footer', {
                  ...data.footer,
                  map_description: e.target.value,
                })
              }
            />
          )}
        </FormField>
        <FormField id="footer_map_embed" label="Map embed URL">
          {field => (
            <Textarea
              {...field}
              rows={3}
              value={data.footer.map_embed_url}
              onChange={e =>
                setData('footer', {
                  ...data.footer,
                  map_embed_url: e.target.value,
                })
              }
            />
          )}
        </FormField>

        <SectionHeading description="Homepage newsletter callout, Substack embed and sidebar widget, and the footer Substack URL.">
          Newsletter
        </SectionHeading>
        <FormField id="newsletter_heading" label="Heading">
          {field => (
            <Textarea
              {...field}
              rows={2}
              value={data.newsletter.heading}
              onChange={e =>
                setData('newsletter', {
                  ...data.newsletter,
                  heading: e.target.value,
                })
              }
            />
          )}
        </FormField>
        <FormField id="newsletter_intro" label="Intro">
          {field => (
            <Textarea
              {...field}
              rows={3}
              value={data.newsletter.intro}
              onChange={e =>
                setData('newsletter', {
                  ...data.newsletter,
                  intro: e.target.value,
                })
              }
            />
          )}
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField id="substack_url" label="Substack URL">
            {field => (
              <Input
                {...field}
                value={data.newsletter.substack_url}
                onChange={e =>
                  setData('newsletter', {
                    ...data.newsletter,
                    substack_url: e.target.value,
                  })
                }
              />
            )}
          </FormField>
          <FormField id="substack_embed" label="Substack embed URL">
            {field => (
              <Input
                {...field}
                value={data.newsletter.substack_embed}
                onChange={e =>
                  setData('newsletter', {
                    ...data.newsletter,
                    substack_embed: e.target.value,
                  })
                }
              />
            )}
          </FormField>
        </div>

        <SectionHeading description="Homepage screen-reader H1 and the Media / Newsletter column labels. Section titles still live under Home Page Sections.">
          Home extras
        </SectionHeading>
        <FormField id="home_h1" label="Home H1">
          {field => (
            <Input
              {...field}
              value={data.home.h1}
              onChange={e =>
                setData('home', { ...data.home, h1: e.target.value })
              }
            />
          )}
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField id="media_eyebrow" label="Media eyebrow">
            {field => (
              <Input
                {...field}
                value={data.home.media_eyebrow}
                onChange={e =>
                  setData('home', {
                    ...data.home,
                    media_eyebrow: e.target.value,
                  })
                }
              />
            )}
          </FormField>
          <FormField id="newsletter_eyebrow" label="Newsletter eyebrow">
            {field => (
              <Input
                {...field}
                value={data.home.newsletter_eyebrow}
                onChange={e =>
                  setData('home', {
                    ...data.home,
                    newsletter_eyebrow: e.target.value,
                  })
                }
              />
            )}
          </FormField>
        </div>

        <SectionHeading description="Thematic Areas and Workstreams headings, intros, and sector images on /our-work.">
          Our Work
        </SectionHeading>
        <FormField id="thematic_heading" label="Thematic heading">
          {field => (
            <Input
              {...field}
              value={data.our_work.thematic_heading}
              onChange={e =>
                setData('our_work', {
                  ...data.our_work,
                  thematic_heading: e.target.value,
                })
              }
            />
          )}
        </FormField>
        <FormField id="thematic_intro" label="Thematic intro">
          {field => (
            <Textarea
              {...field}
              rows={3}
              value={data.our_work.thematic_intro}
              onChange={e =>
                setData('our_work', {
                  ...data.our_work,
                  thematic_intro: e.target.value,
                })
              }
            />
          )}
        </FormField>
        <FormField id="sectors_heading" label="Workstreams heading">
          {field => (
            <Input
              {...field}
              value={data.our_work.sectors_heading}
              onChange={e =>
                setData('our_work', {
                  ...data.our_work,
                  sectors_heading: e.target.value,
                })
              }
            />
          )}
        </FormField>
        <FormField id="sectors_intro" label="Workstreams intro">
          {field => (
            <Textarea
              {...field}
              rows={3}
              value={data.our_work.sectors_intro}
              onChange={e =>
                setData('our_work', {
                  ...data.our_work,
                  sectors_intro: e.target.value,
                })
              }
            />
          )}
        </FormField>
        <FormField id="sector_images" label="Sector image overrides (JSON)">
          {field => (
            <Textarea
              {...field}
              rows={6}
              value={data.sector_images_json}
              onChange={e => setData('sector_images_json', e.target.value)}
              className="font-mono text-xs"
            />
          )}
        </FormField>

        <SectionHeading description="Page title and disclaimer on /reform-monitor.">
          Reform Monitor
        </SectionHeading>
        <FormField id="reform_title" label="Title">
          {field => (
            <Input
              {...field}
              value={data.reform_monitor.title}
              onChange={e =>
                setData('reform_monitor', {
                  ...data.reform_monitor,
                  title: e.target.value,
                })
              }
            />
          )}
        </FormField>
        <FormField id="reform_disclaimer" label="Disclaimer">
          {field => (
            <Textarea
              {...field}
              rows={3}
              value={data.reform_monitor.disclaimer}
              onChange={e =>
                setData('reform_monitor', {
                  ...data.reform_monitor,
                  disclaimer: e.target.value,
                })
              }
            />
          )}
        </FormField>

        <SectionHeading description="Organisation name and working days on /contact. Phone, email, and address still come from the Contact page’s JSON.">
          Contact extras
        </SectionHeading>
        <FormField id="contact_org" label="Organisation name">
          {field => (
            <Input
              {...field}
              value={data.contact.org_name}
              onChange={e =>
                setData('contact', {
                  ...data.contact,
                  org_name: e.target.value,
                })
              }
            />
          )}
        </FormField>
        <FormField id="working_days" label="Working days">
          {field => (
            <Input
              {...field}
              value={data.contact.working_days}
              onChange={e =>
                setData('contact', {
                  ...data.contact,
                  working_days: e.target.value,
                })
              }
            />
          )}
        </FormField>

        <SectionHeading description="Member Institutions heading and intro on the About page.">
          About
        </SectionHeading>
        <FormField id="members_heading" label="Member institutions heading">
          {field => (
            <Input
              {...field}
              value={data.about.member_institutions_heading}
              onChange={e =>
                setData('about', {
                  ...data.about,
                  member_institutions_heading: e.target.value,
                })
              }
            />
          )}
        </FormField>
        <FormField id="members_intro" label="Member institutions intro">
          {field => (
            <Textarea
              {...field}
              rows={3}
              value={data.about.member_institutions_intro}
              onChange={e =>
                setData('about', {
                  ...data.about,
                  member_institutions_intro: e.target.value,
                })
              }
            />
          )}
        </FormField>

        <SectionHeading description="Intro, empty-state message, and cohort headings on /media-fellows.">
          Media fellows
        </SectionHeading>
        <FormField id="fellows_intro" label="Intro">
          {field => (
            <Textarea
              {...field}
              rows={3}
              value={data.media_fellows.intro}
              onChange={e =>
                setData('media_fellows', {
                  ...data.media_fellows,
                  intro: e.target.value,
                })
              }
            />
          )}
        </FormField>

        <SectionHeading description="Header search dialog: description, empty-state helper, and example queries.">
          Search
        </SectionHeading>
        <FormField id="search_description" label="Dialog description">
          {field => (
            <Textarea
              {...field}
              rows={2}
              value={data.search.description}
              onChange={e =>
                setData('search', {
                  ...data.search,
                  description: e.target.value,
                })
              }
            />
          )}
        </FormField>
        <FormField id="search_helper" label="Empty-state helper">
          {field => (
            <Input
              {...field}
              value={data.search.helper}
              onChange={e =>
                setData('search', { ...data.search, helper: e.target.value })
              }
            />
          )}
        </FormField>
        <FormField
          id="search_examples"
          label="Helper examples (comma separated)"
        >
          {field => (
            <Input
              {...field}
              value={data.search_examples}
              onChange={e => setData('search_examples', e.target.value)}
            />
          )}
        </FormField>

        <SectionHeading description="Fallback title and description when a page has none. Home title and description are used on the homepage.">
          SEO defaults
        </SectionHeading>
        <FormField id="seo_title" label="Default title">
          {field => (
            <Input
              {...field}
              value={data.seo.default_title}
              onChange={e =>
                setData('seo', { ...data.seo, default_title: e.target.value })
              }
            />
          )}
        </FormField>
        <FormField id="seo_description" label="Default description">
          {field => (
            <Textarea
              {...field}
              rows={3}
              value={data.seo.default_description}
              onChange={e =>
                setData('seo', {
                  ...data.seo,
                  default_description: e.target.value,
                })
              }
            />
          )}
        </FormField>
        <FormField id="home_title" label="Home title">
          {field => (
            <Input
              {...field}
              value={data.seo.home_title}
              onChange={e =>
                setData('seo', { ...data.seo, home_title: e.target.value })
              }
            />
          )}
        </FormField>
        <FormField id="home_description" label="Home description">
          {field => (
            <Textarea
              {...field}
              rows={3}
              value={data.seo.home_description}
              onChange={e =>
                setData('seo', {
                  ...data.seo,
                  home_description: e.target.value,
                })
              }
            />
          )}
        </FormField>

        <SectionHeading description="Public error screens for 403, 404, 419, 500, and 503.">
          Error pages
        </SectionHeading>
        <FormField id="errors_eyebrow" label="Eyebrow">
          {field => (
            <Input
              {...field}
              value={data.errors.eyebrow}
              onChange={e =>
                setData('errors', { ...data.errors, eyebrow: e.target.value })
              }
            />
          )}
        </FormField>
        <FormField id="error_pages" label="Status copy (JSON)">
          {field => (
            <Textarea
              {...field}
              rows={12}
              value={data.error_pages_json}
              onChange={e => setData('error_pages_json', e.target.value)}
              className="font-mono text-xs"
            />
          )}
        </FormField>

        <SectionHeading description="Country markers on the globe in the Know Us header mega menu.">
          Globe markers
        </SectionHeading>
        <FormField id="globe_markers" label="Markers (JSON)">
          {field => (
            <Textarea
              {...field}
              rows={10}
              value={data.globe_markers_json}
              onChange={e => setData('globe_markers_json', e.target.value)}
              className="font-mono text-xs"
            />
          )}
        </FormField>

        <SectionHeading description="Mobile navigation only when the CMS header menu is empty.">
          Mobile menu fallback
        </SectionHeading>
        <FormField id="mobile_menu" label="Menu tree (JSON)">
          {field => (
            <Textarea
              {...field}
              rows={16}
              value={data.mobile_menu_json}
              onChange={e => setData('mobile_menu_json', e.target.value)}
              className="font-mono text-xs"
            />
          )}
        </FormField>

        <PrimaryButton type="submit" isLoading={processing}>
          Save settings
        </PrimaryButton>
      </form>
    </>
  );
}
