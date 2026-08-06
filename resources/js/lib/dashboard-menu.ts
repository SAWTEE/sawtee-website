import {
  BookDashed,
  FilePenIcon,
  FilesIcon,
  FileUpIcon,
  FilterX,
  Globe2Icon,
  LayoutDashboard,
  LayoutTemplate,
  MenuIcon,
  ReceiptText,
  SlidersHorizontalIcon,
  TagsIcon,
  UserPen,
  UsersIcon,
  Wand,
} from 'lucide-react';

import { HomeIcon } from '@/components/shared/icons';

export const DashBoardMenuItems = [
  {
    name: 'Dashboard',
    icon: HomeIcon,
    route: 'admin.dashboard',
  },
  {
    name: 'Website',
    icon: Globe2Icon,
    route: 'home',
  },
  {
    name: 'Home Page Sections',
    icon: LayoutTemplate,
    route: 'admin.home-page-sections.index',
  },
  {
    name: 'Menu',
    icon: MenuIcon,
    route: 'admin.menus.index',
  },
  {
    name: 'Pages',
    icon: FilesIcon,
    route: 'admin.pages.index',
  },
  {
    name: 'Sections',
    icon: LayoutDashboard,
    route: 'admin.sections.index',
  },
  {
    name: 'Fellowships',
    icon: Wand,
    route: 'admin.fellowships.index',
  },
  {
    name: 'Fellows',
    icon: UserPen,
    route: 'admin.fellows.index',
  },
  {
    name: 'Published Stories',
    icon: UserPen,
    route: 'admin.published-stories.index',
  },
  {
    name: 'Members',
    icon: UserPen,
    route: 'admin.members.index',
  },
  {
    name: 'Memebr Institutes',
    icon: UserPen,
    route: 'admin.institutes.index',
  },
  {
    name: 'Posts',
    icon: FileUpIcon,
    route: 'admin.posts.index',
  },
  {
    name: 'Themes',
    icon: TagsIcon,
    route: 'admin.themes.index',
  },
  {
    name: 'Tags',
    icon: TagsIcon,
    route: 'admin.tags.index',
  },
  {
    name: 'Categories',
    icon: FilterX,
    route: 'admin.categories.index',
  },
  {
    name: 'Publications',
    icon: BookDashed,
    route: 'admin.publications.index',
  },
  {
    name: 'Research',
    icon: FilePenIcon,
    route: 'admin.research.index',
  },
  {
    name: 'Team Members',
    icon: UsersIcon,
    route: 'admin.teams.index',
  },
  {
    name: 'Slider',
    icon: SlidersHorizontalIcon,
    route: 'admin.sliders.index',
  },
  {
    name: 'Articles',
    icon: ReceiptText,
    route: 'admin.articles.index',
  },
];
