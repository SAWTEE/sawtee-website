import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { customTheme, config } from '@/Utils/data';
import { register } from 'swiper/element/bundle';
import * as Sentry from '@sentry/react';

Sentry.init({
	dsn: import.meta.env.VITE_SENTRY_DSN_PUBLIC,
	integrations: [Sentry.replayIntegration()],
	// Session Replay
	// This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
	replaysSessionSampleRate: import.meta.env.VITE_APP_ENV === 'developement' ? 1 : 0.1,
	replaysOnErrorSampleRate: 1.0,
});

const appName = import.meta.env.VITE_APP_NAME || 'SAWTEE';
const theme = extendTheme(customTheme);
// register Swiper custom elements
register();

createInertiaApp({
	title: title => `${appName} | ${title}`,
	resolve: name => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
	setup({ el, App, props }) {
		const root = createRoot(el);

		root.render(
			<ChakraProvider resetCSS theme={{ config, ...theme }}>
				<App {...props} />
			</ChakraProvider>
		);
	},
	progress: {
		delay: 250,
		color: 'primary.700',
		includeCSS: true,

		// Whether the NProgress spinner will be shown...
		showSpinner: true,
	},
});
