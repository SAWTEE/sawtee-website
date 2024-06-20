import {
  FiBook,
  FiCompass,
  FiFileText,
  FiGlobe,
  FiGrid,
  FiHome,
  FiLayout,
  FiStar,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';
import { RiPagesLine } from 'react-icons/ri';
import { TbSlideshow } from 'react-icons/tb';

export const feature = {
	name: 'Reform Monitoring Platform',
	image: '/assets/Policy-Reform-Banner-green-sized.webp',
	link: '/reform-monitoring-platform',
};

const font_heading =
	'Figtree , ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", -apple-system, BlinkMacSystemFont, "Segoe UI Emoji",Segoe UI Symbol, "Noto Color Emoji"';

const font_body =
	'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", -apple-system, BlinkMacSystemFont, "Segoe UI Emoji",Segoe UI Symbol, "Noto Color Emoji"';

const font_mono = "'Inconsolata', Consolas, monospace";

export const config = {
	initialColorMode: 'system',
	useSystemColorMode: true,
};

export const customTheme = {
	colors: {
		darkgray: {
			base: '#6D6D6D',
			light: '#DCD7CA',
			lighter: '#F5EFE0',
		},
		primary: {
			50: '#e1f8ff',
			100: '#bee4f1',
			200: '#9ad1e5',
			300: '#74bed9',
			400: '#50acce',
			500: '#3892b4',
			600: '#29728d',
			700: '#1a5165',
			800: '#09313f',
			900: '#001219',
		},
		accent: {
			50: '#e3f7fb',
			100: '#cbdfe3',
			200: '#afc8ce',
			300: '#92b2ba',
			400: '#759ca5',
			500: '#5b838b',
			600: '#45666d',
			700: '#30494f',
			800: '#192d31',
			900: '#001115',
		},
		light: {
			50: '#f0f4f3',
			100: '#d9dcdb',
			200: '#bec6c3',
			300: '#a3b0ac',
			400: '#879a94',
			500: '#6d807a',
			600: '#55645f',
			700: '#3e4744',
			800: '#252b29',
			900: '#0b0f0d',
		},
		youtube: {
			50: '#FFF5F5',
			100: '#FED7D7',
			200: '#FEB2B2',
			300: '#FC8181',
			400: '#F56565',
			500: '#E53E3E',
			600: '#C53030',
			700: '#9B2C2C',
			800: '#822727',
			900: '#63171B',
		},
		headerBg: '#d9d9d9',
		footerBg: '#262626',
		linkColor: 'rgba(8 ,126, 164, 1)',
	},
	fonts: {
		heading: font_heading,
		body: font_body,
		mono: font_mono,
	},
};

export const memberInstitutions = [
	{
		id: 1,
		country: 'Bangladesh',
		institutes: [
			{
				id: 1,
				member_name: 'Bangladesh Environmental Lawyers’ Association (BELA), Dhaka',
				member_website_link: 'https://www.belabangla.org/',
			},
			{
				id: 2,
				member_name: 'Unnayan Shamannay, Dhaka',
				member_website_link: 'https://www.unsy.org/',
			},
		],
	},
	{
		id: 2,
		country: 'India',
		institutes: [
			{
				id: 1,
				member_name: 'Citizen consumer and civic Action Group (CAG), Chennai',
				member_website_link: 'https://www.cag.org.in/',
			},
			{
				id: 2,
				member_name: 'Consumer Unity & Trust Society (CUTS), Jaipur',
				member_website_link: 'https://cuts-international.org/',
			},
			{
				id: 3,
				member_name: 'Development Research and Action Group (DRAG), New Delhi',
				member_website_link: 'https://dragindia.org/',
			},
		],
	},
	{
		id: 3,
		country: 'Nepal',
		institutes: [
			{
				id: 1,
				member_name: 'Society for Legal and Environmental Analysis and Development Research (LEADERS), Kathmandu',
				member_website_link: 'https://leadersnepal.org.np/',
			},
			{
				id: 2,
				member_name: 'Forum for Protection of Public Interest (Pro Public), Kathmandu',
				member_website_link: 'http://propublic.org/',
			},
		],
	},
	{
		id: 4,
		country: 'Pakistan',
		institutes: [
			{
				id: 1,
				member_name: 'Journalists for Democracy and Human Rights (JDHR), Islamabad',
				member_website_link: 'http://www.jdhr.org/',
			},
			{
				id: 2,
				member_name: 'Sustainable Development Policy Institute (SDPI), Islamabad',
				member_website_link: 'https://sdpi.org/',
			},
		],
	},
	{
		id: 5,
		country: 'Sri Lanka',
		institutes: [
			{
				id: 1,
				member_name: 'Institute of Policy Studies (IPS), Colombo',
				member_website_link: 'https://www.ips.lk/',
			},
			{
				id: 2,
				member_name: 'Law & Society Trust (LST), Colombo',
				member_website_link: 'https://www.lstlanka.org/',
			},
		],
	},
];

export const staticExperts = [
	{
		name: 'Ratnakar Adhikari',
		designation: 'Chairman',
		media: [{ original_url: '/assets/Ratnakar_headshot.webp' }],
	},
	{
		name: 'Posh Raj Pandey',
		designation: 'Chair Emeritus',
		media: [{ original_url: '/assets/PRP.webp' }],
	},
	{
		name: 'Paras Kharel',
		designation: 'Executive Director',
		media: [{ original_url: '/assets/PK_headshot.webp' }],
	},
	{
		name: 'Dhrubesh C. Regmi',
		designation: 'General Secretary',
		media: [{ original_url: '/assets/dhrubesh.webp' }],
	},
	// {
	//     name: "Neelu Thapa",
	//     designation: "Treasurer",
	//     media: [{ original_url: "/assets/Neelu-Thapa.webp" }],
	// },
	{
		name: 'Dikshya Singh',
		designation: 'Programme Coordinator',
		media: [{ original_url: '/assets/dikshya.webp' }],
	},
	{
		name: 'Kshitiz Dahal',
		designation: 'Sr. Research Officer',
		media: [{ original_url: '/assets/Kshitiz.webp' }],
	},
];

export const aboutMenuData = {
	introText:
		'South Asia Watch on Trade, Economics and Environment (SAWTEE) was launched in 1994 as a loose regional network of non-governmental organizations (NGOs) from five South Asian countries: Bangladesh, India, Nepal, Pakistan and Sri Lanka. Taking into consideration the emerging need for fair, effective and meaningful integration of South Asian countries into the regional as well as global economies, the major motto of this regional initiative has been “GLOBALIZATION YES, BUT WITH SAFETY NETS”',
	introImage: '/assets/Airports_Network_Map.png',
	experts: [...staticExperts],
};

export const DashBoardMenuItems = [
	{
		name: 'Dashboard',
		icon: FiHome,
		route: 'admin.dashboard',
	},
	{
		name: 'Website',
		icon: FiGlobe,
		route: 'home',
	},
	{
		name: 'Menu',
		icon: FiGrid,
		route: 'admin.menus.index',
	},
	{
		name: 'Pages',
		icon: RiPagesLine,
		route: 'admin.pages.index',
	},
	{
		name: 'Sections',
		icon: FiLayout,
		route: 'admin.sections.index',
	},
	{
		name: 'Posts',
		icon: FiTrendingUp,
		route: 'admin.posts.index',
	},
	{
		name: 'Themes',
		icon: FiCompass,
		route: 'admin.themes.index',
	},
	{
		name: 'Tags',
		icon: FiCompass,
		route: 'admin.tags.index',
	},
	{
		name: 'Categories',
		icon: FiStar,
		route: 'admin.categories.index',
	},
	{
		name: 'Publications',
		icon: FiBook,
		route: 'admin.publications.index',
	},
	{
		name: 'Research',
		icon: FiFileText,
		route: 'admin.research.index',
	},
	{
		name: 'Team Members',
		icon: FiUsers,
		route: 'admin.teams.index',
	},
	,
	{
		name: 'Slider',
		icon: TbSlideshow,
		route: 'admin.sliders.index',
	},
];

export const primarMenu = [
	{
		title: 'Home',
		url: '/',
		children: null,
	},
	{
		title: 'Know Us',
		url: '/about',
		children: [
			{
				title: 'Genesis',
				url: '/about#genesis',
				children: null,
			},
			{
				title: 'Registration and Recognition',
				url: '/about#registration-and-recognition',
				children: null,
			},
			{
				title: 'Governance Structure',
				url: '/about#governance-structure',
				children: null,
			},
			{
				title: 'Vision, Goal and Objectives',
				url: '/about#vision-goal-and-objectives',
				children: null,
			},
			{
				title: 'Strategies',
				url: '/about#strategies',
				children: null,
			},
			{
				title: 'Resources',
				url: '/about#resources',
				children: null,
			},
			{
				title: 'Member Institutions',
				url: '/about#member-institutions',
				children: null,
			},
		],
		introText:
			'South Asia Watch on Trade, Economics and Environment (SAWTEE) was launched in 1994 as a loose regional network of non-governmental organizations (NGOs) from five South Asian countries: Bangladesh, India, Nepal, Pakistan and Sri Lanka. Taking into consideration the emerging need for fair, effective and meaningful integration of South Asian countries into the regional as well as global economies, the major motto of this regional initiative has been “GLOBALIZATION YES, BUT WITH SAFETY NETS”',
		introImage: '/assets/Airports_Network_Map.png',
		experts: [...staticExperts],
	},
	{
		title: 'Our Work',
		url: '/our-work',
		children: [
			{
				title: 'Thematic Areas',
				url: '/our-work#thematic-areas',
				children: [
					{
						title: 'Economic and social reform, growth and poverty',
						url: '/our-work#theme1',
						children: null,
					},
					{
						title: 'Trade integration and supply-side constrants',
						url: '/our-work#theme2',
						children: null,
					},
					{
						title: 'Trade and climate change',
						url: '/our-work#theme3',
						children: null,
					},
					{
						title: 'Agriculture policies, biodiversity management and food security',
						url: '/our-work#theme4',
						children: null,
					},
					{
						title: 'Competition, regulation and competitiveness',
						url: '/our-work#theme5',
						children: null,
					},
					{
						title: 'Financial resource management',
						url: '/our-work#theme6',
						children: null,
					},
					{
						title: 'Remittance and development',
						url: '/our-work#theme7',
						children: null,
					},
					{
						title: 'Covid-19',
						url: '/our-work#theme8',
						children: null,
					},
					{
						title: "Advancing LDCs' Trade Interest",
						url: '/our-work#theme9',
						children: null,
					},
				],
			},
			{
				title: 'Programmes',
				url: '/category/programme',
				children: [
					{
						title: 'Ongoing Programmes',
						url: '/category/ongoing-programmes',
						children: null,
					},
					{
						title: 'Completed Programmes',
						url: '/category/completed-programmes',
						children: null,
					},
				],
			},
			{
				title: 'Research',
				url: '/category/research',
				children: null,
			},
		],
	},
	{
		title: 'Publications',
		url: '/category/publications',
		children: [
			{
				title: 'Trade Insight',
				url: '/category/publications/trade-insight',
				children: null,
			},
			{
				title: 'Policy Brief',
				url: '/category/publications/policy-brief',
				children: null,
			},
			{
				title: 'Briefing Paper',
				url: '/category/publications/briefing-paper',
				children: null,
			},
			{
				title: 'Discussion Paper',
				url: '/category/publications/discussion-paper',
				children: null,
			},
			{
				title: 'Research Brief',
				url: '/category/publications/research-brief',
				children: null,
			},
			{
				title: 'Books',
				url: '/category/publications/books',
				children: null,
			},
			{
				title: 'Working Paper',
				url: '/category/publications/working-paper',
				children: null,
			},
			{
				title: 'Others',
				url: '/category/publications/others',
				children: null,
			},
			{
				title: 'Publications in Nepali',
				url: '/category/publications/publication-in-nepali',
				children: [
					{
						title: 'Nepali Briefing Paper',
						url: '/category/publications/publications-in-nepali/nepali-briefing-paper',
						children: null,
					},
					{
						title: 'Nepali Policy Brief',
						url: '/category/publications/publications-in-nepali/nepali-policy-brief',
						children: null,
					},
					{
						title: 'Nepali Newsletters',
						url: '/category/publications/publications-in-nepali/nepali-newsletters',
						children: [
							{
								title: 'Swachha Pratispardha',
								url: '/category/publications/publications-in-nepali/nepali-newsletters/swachha-pratispardha',
								children: null,
							},
							{
								title: 'Byapar ra Bikash',
								url: '/category/publications/publications-in-nepali/nepali-newsletters/byapar-ra-bikash',
								children: null,
							},
						],
					},
				],
			},
		],
	},
	{
		title: 'Policy Research',
		url: '/category/featured-events',
		children: null,
	},
];
export const footerMenu = [
	{
		title: 'Contact Us',
		url: '/contact',
		children: [
			{
				title: 'Phone: +977-1-4544438',
				url: 'tel:+977-1-4544438',
			},
			{
				title: 'Fax: +977-1-4544570',
				url: 'fax:+977-1-4544570',
			},
			{
				title: 'Email: sawtee@sawtee.org',
				url: 'mailto:sawtee@sawtee.org',
			},
			{
				title: 'Address: Tukucha Marg, Baluwatar, Kathmandu',
				url: null,
			},
			{
				title: 'P.O Box: 19366',
				url: null,
			},
		],
	},
	{
		title: 'Publications',
		url: '/category/publications',
		children: [
			{
				title: 'Trade Insight',
				url: '/category/publications/trade-insight',
			},
			{
				title: 'Policy Brief',
				url: '/category/publications/policy-brief',
			},
			{
				title: 'Books',
				url: '/category/publications/books',
			},
			{
				title: 'Briefing Paper',
				url: '/category/publications/briefing-paper',
			},
			{
				title: 'Discussion Paper',
				url: '/category/publications/discussion-paper',
			},
		],
	},
	{
		title: 'Useful Links',
		url: null,
		children: [
			{
				title: 'InFocus',
				url: '/category/infocus',
			},
			{
				title: 'Work with Us',
				url: '/career',
			},
			{
				title: 'Contact Us',
				url: '/contact',
			},
			{
				title: 'Newsletters',
				url: '/category/newsletters',
			},
			{
				title: 'SAES',
				url: 'https://sawtee.org/saes',
			},
		],
	},
];
export const socialMenu = [
	{
		name: 'twitter',
		link: 'https://www.twitter.com/SAWTEENP/',
	},
	{
		name: 'facebook',
		link: 'https://www.facebook.com/sawteenp/',
	},
	{
		name: 'linkedin',
		link: 'https://www.linkedin.com/sawteenp/',
	},
	{
		name: 'youtube',
		link: 'https://www.youtube.com/@sawteenp/',
	},
];

export const mobileMenu = [
	{
		title: 'Home',
		url: '/',
		children: null,
	},
	{
		title: 'Know Us',
		url: '/about',
		children: null,
	},
	{
		title: 'Our Work',
		url: '/our-work',
		children: [
			{
				title: 'Thematic Areas',
				url: '/our-work#thematic-areas',
				children: null,
			},
			{
				title: 'Programmes',
				url: '/category/programme',
				children: [
					{
						title: 'Ongoing Programmes',
						url: '/category/ongoing-programmes',
						children: null,
					},
					{
						title: 'Completed Programmes',
						url: '/category/completed-programmes',
						children: null,
					},
				],
			},
			{
				title: 'Research',
				url: '/category/research',
				children: null,
			},
		],
	},
	{
		title: 'Publications',
		url: '/category/publications',
		children: [
			{
				title: 'Trade Insight',
				url: '/category/publications/trade-insight',
				children: null,
			},
			{
				title: 'Policy Brief',
				url: '/category/publications/policy-brief',
				children: null,
			},
			{
				title: 'Briefing Paper',
				url: '/category/publications/briefing-paper',
				children: null,
			},
			{
				title: 'Discussion Paper',
				url: '/category/publications/discussion-paper',
				children: null,
			},
			{
				title: 'Research Brief',
				url: '/category/publications/research-brief',
				children: null,
			},
			{
				title: 'Books',
				url: '/category/publications/books',
				children: null,
			},
			{
				title: 'Working Paper',
				url: '/category/publications/working-paper',
				children: null,
			},
			{
				title: 'Others',
				url: '/category/publications/others',
				children: null,
			},
			{
				title: 'Publications in Nepali',
				url: '/category/publications/publication-in-nepali',
				children: [
					{
						title: 'Nepali Briefing Paper',
						url: '/category/publications/publications-in-nepali/nepali-briefing-paper',
						children: null,
					},
					{
						title: 'Nepali Policy Brief',
						url: '/category/publications/publications-in-nepali/nepali-policy-brief',
						children: null,
					},
					{
						title: 'Nepali Newsletters',
						url: '/category/publications/publications-in-nepali/nepali-newsletters',
						children: [
							{
								title: 'Swachha Pratispardha',
								url: '/category/publications/publications-in-nepali/nepali-newsletters/swachha-pratispardha',
								children: null,
							},
							{
								title: 'Byapar ra Bikash',
								url: '/category/publications/publications-in-nepali/nepali-newsletters/byapar-ra-bikash',
								children: null,
							},
						],
					},
				],
			},
		],
	},
	{
		title: 'Policy Research',
		url: '/category/featured-events',
		children: null,
	},
];

export const mediaFellows = [
	{
		id: 1,
		name: 'Himal Lamsal',
		designation: 'Correspondent, Nagarik',
		bio: 'Himal Lamsal, a correspondent for the national daily newspaper Nagarik, has 12 years of experience in news reporting. His reporting focuses on issues related to infrastructure development, including energy, hydropower, climate change, and public procurement. Additionally, Mr. Lamsal has contributed investigative stories to the Centre for Investigative Journalism, Nepal, addressing issues like urban development and public property misuse. Mr. Lamsal holds an MA in Journalism and Mass Communication from Tribhuvan University. He has received numerous awards, including recognition of his contributions in metropolitan governance journalism and tourism journalism. He also serves as the secretary of the Society of Nepal Infrastructure Journalists.',
		avatar: '/assets/Himal Lamsal.jpg',
		published_stories: [
			{
				title: 'विकासशील मुलुकमा स्तरोन्नतिसँगै तयारी पोशाकको निर्यात घट्न सक्ने ',
				link: 'https://nagariknews.nagariknetwork.com/economy/1363451-1701392388.html',
				image_src: ['/assets/himal-news-1.jpg'],
				media_src: null,
			},
			{
				title: 'युरोपको बजार जोगाउन छैन तयारी ',
				link: 'https://nagariknews.nagariknetwork.com/economy/1332491-1698452894.html',
				image_src: ['/assets/himal-news-2-page-1.jpg', '/assets/himal-news-2-page-2.jpg'],
				media_src: null,
			},
		],
		experience: [
			'Before being awarded this fellowship, my reporting on international trade was limited to basic issues. Although I was aware of Nepal graduating from the least developed country (LDC) category to a developing country, I had limited idea about its implications for Nepal’s trade, especially with regard to exports to the European Union (EU) and the United Kingdom (UK). This fellowship provided me with an opportunity to understand various aspects of Nepal’s LDC graduation. I believe that this experience will help me in enhancing my understanding of similar trade-related issues in the future. This experience also allowed me to understand and analyze different technical aspects of the effects of Nepal’s graduation from LDC status. It has not only changed my perspective on the subject matter but I have gained insights into the ways to examine this issue.',
			'Consultations with Dr. Paras Kharel, Executive Director, SAWTEE, helped me understand the technical and practical aspects of LDC graduation and its implications. Our interactions have made me realize that there is ample room for me to nurture my interest in, and improve my understanding of, this topic. I had an opportunity to learn about “rules of origin” which will have a long-term impact on the export sector of Nepal after it graduates from the LDC category but is missing in the discourse in the media. Finally, I would like to thank SAWTEE for granting me this fellowship and providing me with the opportunity to learn. May we continue to cooperate in the future as well. ',
		],
	},
	{
		id: 2,
		name: 'Lok Bahadur Chapagai',
		designation: 'Editor, Capital Business Magazine',
		bio: "Lok Bahadur Chapagai is the editor of Capital Business Magazine. He holds an M.A. in Economics from Tribhuvan University. Mr. Chapagain started his career in journalism with reporting roles at Abhiyan Weekly and Dristi Weekly and worked his way through Karobar National Economic Daily and Capitalnepal.com. Mr. Chapagai's contribution to journalism has been acknowledged through numerous accolades, including the Samana Banking Patrakarita Puraskar in 2012, the ACAN Journalism Honor in 2015, the Rotary Journo Award in 2019, and the Punjibazar Patrakarita Puraskar in 2023, among others. ",
		avatar: '/assets/Lok_Bahadur_Chapagain.jpg',
		published_stories: [
			{
				title: 'आयात अवरोधको परिणाम शिथिल अर्थतन्त्र',
				link: 'https://www.capitalnepal.com/detail/44035',
				image_src: ['/assets/Lokbahadur-news-1.png'],
				media_src: null,
			},
		],
		experience: [
			'For a journalist, journalism is a life-long process of learning—each day we can learn about a new topic. For the first time in my two-decade journey in journalism, through this fellowship, I got an opportunity to learn from experts outside the media circle. Understanding the issues of international trade and economics through this association with South Asia Watch on Trade, Economics and Environment (SAWTEE) has been a positively unique experience. ',
			'Considering the deteriorated balance of payments situation in 2021, the Nepal government imposed a ban on imports of certain items for about six months beginning in April 2022 and Nepal’s central bank introduced a 50-100 percent cash margin requirement on imports of certain items beginning in December 2021 that lasted a year. This fellowship provided me with an opportunity to delve deeper into the implications of the import ban on Nepal’s economy while writing an article in Capital Business magazine.',
			'Despite the limited time, the collaboration with SAWTEE helped me understand how to approach a new subject matter and undertake an in-depth analysis of it. It also gave me insights into how decisions such as the ban and other financial tools used by the government and the central bank impact the economy and common people and what is the role of the authorities in addressing the adverse impact. SAWTEE’s mentors also helped me in various aspects of the content and even language-related accuracy during the reporting. This reporting opportunity has provided me with new perspectives on the issues and opened up ways to examine international trade-related issues that have been ignored.',
			'I am grateful to Executive Director Dr. Paras Kharel and Ms. Neelu Thapa for this opportunity to learn. I am hoping for more cooperation in the future with SAWTEE. ',
		],
	},
	{
		id: 3,
		name: 'Modnath Dhakal',
		designation: 'Journalist, The Rising Nepal',
		bio: 'Mr. Modnath Dhakal is a journalist at The Rising Nepal daily. He has extensively covered issues related to macro economy, investment and development. He has a deep interest in political economy, investment climate and foreign affairs. Mr. Dhakal holds a MS in Communication Studies from the University of the Punjab, Lahore, as well as an MA in Political Science from Tribhuvan University. His previous roles include visiting faculty at the University of Dhaka in Bangladesh, Purwanchal University and Kathmandu University and weekend editor and chief reporter at Arthik Abhiyan business daily. He is currently serving as the President of the Nepal Association of Financial Journalists (NAFIJ).',
		avatar: '/assets/Modnath_Dhakal.JPG',
		published_stories: [
			{
				title: 'Poor policy backup, cumbersome process disappoint women entrepreneurs',
				link: 'https://risingnepaldaily.com/news/36957',
				image_src: ['/assets/modnath-news-1.webp'],
				media_src: null,
			},
			{
				title: 'Women Entrepreneurs Need Support',
				link: 'https://risingnepaldaily.com/news/37526',
				image_src: ['/assets/modnath-news-2.webp'],
				media_src: null,
			},
		],
		experience: [
			"A journalist's identity is shaped not by reporting event-based news stories but by opinion pieces, commentaries and investigative or in-depth reporting. This is because hard news is reported by every media and it is hard to distinguish, most often, among the stories reported in various media since it follows the same writing structure—the celebrated 'inverted pyramid'. This was the reason behind my interest to apply for the fellowship offered by SAWTEE.",
			'Quite contrary to my anticipation, it took almost three weeks to gather basic information and latest data on the mobilization of concessional loans to women. It was a serious task to know about the plight of women in business in Nepal. I talked with more than 10 women in business and three experts who have an understanding of the matter. I went through multiple documents, research reports, books and news articles, on the subject to enhance my understanding.',
		],
	},
	{
		id: 4,
		name: 'Rudra Pangeni',
		designation: 'Freelance investigative and multimedia journalist',
		bio: "Rudra Pangeni is a freelance investigative and multimedia journalist based in Kathmandu. He has worked for two major English-language daily newspapers—The Himalayan Times and Republica—as well as at the Centre for Investigative Journalism, Nepal. He was named a 2019 Bertha Fellow for his reporting on Nepal's land and housing sector. Beyond his national contributions, he also collaborated with the UK’s Finance Uncovered and The Bureau of Investigative Journalism to uncover cross-border financial crimes, human trafficking, and corruption. In October 2022, he shared an award 'The Best Investigative Reports 2022 on Modern Slavery' with two British journalists in the UK for a story concerning the exploitation of Nepali seasonal labourers in UK farms.",
		avatar: '/assets/Rudra_pangeni.jpg',
		published_stories: [
			{
				title: 'एक्सप्लेनर : बिलमा हुने गोलमालको कथा ',
				link: 'https://www.himalkhabar.com/news/139387',
				image_src: [],
				media_src: 'https://youtu.be/tBDXWX00TvA',
			},
		],
		experience: [
			"In the age of information flood and social media, it's not an easy task to draw and hold the attention of the audience for 20 minutes. But I have been successful to do so of more than 35k viewers minimum and earn thousands of shares, comments and likes (till December 31, 2023) and more importantly compliments from renowned editors in the country (it's not easy to get their compliments as I have got such compliments rarely from them though I have worked with them in the past).",
			`My former editor <a href="https://x.com/kosmosbk/status/1739614608284176690?s=20" target="_blank">Kosmos Biswokarma</a> (who was my editor at Republica daily newspaper) wrote in a tweet: “Excellent explainer this…good job bro! keep it up!” and former Editor of the Kathmandu Post <a href="https://x.com/SanjeevSatgainy/status/1738816805525954957?s=20" target="_blank">Sanjeev Satgainya</a> (who was my copy editor during my stint at the Himalayan Times) commented: “Very Good Explainer”, and <a href="https://x.com/Anurag_Acharya/status/1739472811817844874?s=20" target="_blank">Anurag Acharya</a> (who is a former journalist and I worked with him at the Centre for Investigative Journalism, Nepal where he was program manager) wrote in a tweet “Brilliant investigation into under-invoicing and illicit trade in Nepali market.” There are several comments and feedback in social media posts and youtube posts as well.`,
			"Many of the video audiences, whom I had personal conversations with, told me that they felt like it was just 10 to 12 minutes but they saw the length of the video later and were surprised. In facebook group chats, I have gotten several compliments from my colleagues like ‘you have rocked in a visual medium like the print medium.” (I also note that colleagues hardly give compliments in public forums; that's why I am successful to an extent in this work).",
			'This is not the first time I produced video reports. I have so far reproduced over a dozen investigative reports into short videos but they hadn’t gotten attention of this scale.',
			'I have also got calls from the chairmen of the two parliamentary committees (Public Accounts Committee and State Affairs Committee) showing interest to talk with me on the matter ofunder invoicing. I will definitely share more thoughts with them during upcoming meetings.',
			'Lastly, a team of people has played a great role to bring this out. I appreciate their relentless support and work. They are storytelling designer and video editor Arun Karki, cameraman Gopen Rai and editor of Himal Khabar Santa Gaha Magar.',
			'I extend my thanks to SAWTEE for providing me this opportunity.',
		],
	},
	{
		id: 5,
		name: 'Saraswati Dhakal',
		designation: 'Senior Journalist, Karobar National Economic Daily',
		bio: "Saraswati Dhakal is a Senior Journalist at the Karobar National Economic Daily and has 13 years of work experience. Ms. Dhakal specializes in economic matters, including private sector and trade issues. Concurrently, she is pursuing a Master of Philosophy (MPhil) in economics. She has received awards, including the National ICT Media Award, the National Telecommunication Creative Writing Award, the Best Telecommunications Journalism Award, and a Letter of Appreciation from the National Consumer Forum. Her leadership extends to her role as the Former Vice President of the Society of Economic Journalists Nepal and as the Past President of the Tech Journalists' Forum.",
		avatar: '/assets/saru-dhakal-resized.jpg',
		published_stories: [
			{
				title: 'नजिक भएर पनि सदुपयोग छैन ',
				link: 'https://www.karobardaily.com/news/237936',
				image_src: ['assets/saru-news-1.jpg'],
				media_src: null,
			},
			{
				title: 'बंगलादेश निर्यातमा उच्च कर मुख्य समस्या',
				link: 'https://www.karobardaily.com/news/239769',
				image_src: ['/assets/saru-news-2-page-1.jpg', '/assets/saru-news-2-page-2.jpg'],
				media_src: null,
			},
		],
		experience: [
			'I am grateful to the SAWTEE Nepal Team for such a rich learning experience. My fellowship focused on Nepal-Bangladesh trade—the opportunities and challenges.',
			'The fellowship provided by SAWTEE was enlightening and complements my decade-long experience in reporting about various facets of the economy. This experience was also notable as it was the first time I had received a fellowship for reporting about international trade. The mentorship provided by SAWTEE’s senior researcher Kshitiz Dahal was also memorable. He provided many ideas on data collection and assessment of data to cover the topic comprehensively and clearly. Particularly, his knowledge delivery style made the topic easy to understand, and I felt comfortable asking questions and learning about things I was unfamiliar with.',
			'Finally, I would like to request SAWTEE to keep on providing such fellowship programmes in the future as my experience has been that fellowship helps tremendously to reach the crux of the matter. ',
		],
	},
];

export const contactPageData = {
	opening_hours: '9:00 AM – 5:30 PM',
	phone_numbers: ['+977 1 4544438'],
	fax: '+977 1 4544570',
	email: 'sawtee@sawtee.org',
	address: 'Tukucha Marg, Baluwatar, Kathmandu, Nepal',
	social_menus: [
		{
			name: 'twitter',
			link: 'https://www.twitter.com/SAWTEENP/',
		},
		{
			name: 'facebook',
			link: 'https://www.facebook.com/sawteenp/',
		},
		{
			name: 'linkedin',
			link: 'https://www.linkedin.com/sawteenp/',
		},
		{
			name: 'youtube',
			link: 'https://www.youtube.com/@sawteenp/',
		},
	],
};
