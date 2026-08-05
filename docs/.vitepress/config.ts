import { defineConfig } from 'vitepress'

// GitHub Pages project site: https://SAWTEE.github.io/sawtee-website/
// Change base to '/' if you later host docs on a custom root domain.
export default defineConfig({
  title: 'SAWTEE CMS Docs',
  description:
    'How to use the SAWTEE content management system and how the public website is structured.',
  base: '/sawtee-website/',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'CMS (Backend)', link: '/cms/overview' },
      { text: 'Website', link: '/website/overview' },
      {
        text: 'GitHub',
        link: 'https://github.com/SAWTEE/sawtee-website',
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Getting started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Local setup', link: '/guide/local-setup' },
            { text: 'Environments', link: '/guide/environments' },
          ],
        },
      ],
      '/cms/': [
        {
          text: 'CMS / Admin',
          items: [
            { text: 'Overview', link: '/cms/overview' },
            { text: 'Logging in', link: '/cms/login' },
            { text: 'Posts & articles', link: '/cms/posts' },
            { text: 'Publications & research', link: '/cms/publications' },
            { text: 'Categories, tags & themes', link: '/cms/taxonomies' },
            { text: 'Pages, sections & menus', link: '/cms/pages-menus' },
            { text: 'Homepage sections', link: '/cms/homepage' },
            { text: 'Media & files', link: '/cms/media' },
            { text: 'Teams & fellowships', link: '/cms/people' },
          ],
        },
      ],
      '/website/': [
        {
          text: 'Public website',
          items: [
            { text: 'Overview', link: '/website/overview' },
            { text: 'Home page', link: '/website/home' },
            { text: 'Content pages', link: '/website/content' },
            { text: 'Navigation & SEO', link: '/website/navigation-seo' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/SAWTEE/sawtee-website' },
    ],
    footer: {
      message: 'Documentation for the SAWTEE CMS and public website.',
      copyright: 'Copyright © SAWTEE',
    },
    search: {
      provider: 'local',
    },
    editLink: {
      pattern:
        'https://github.com/SAWTEE/sawtee-website/edit/staging/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },
})
