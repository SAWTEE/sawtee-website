# TypeScript allowlist

Files marked with `// @ts-nocheck` while the shared/core Inertia layer is checked under `strict: true`.

**Strictly typed core (not allowlisted):**
- `resources/js/types/*` (contracts + Ziggy/shared props + SEO page prop contracts + Backend CRUD helpers)
- `resources/js/lib/utils.ts`
- `resources/js/components/Layouts/{MainLayout,PageLayout,PostLayout,GuestLayout,AuthenticatedLayout}.tsx`
- `resources/js/components/Frontend/header/{DesktopNavigation,MainNavigation,mode-toggle,header,MegaMenu,social-menu}.tsx`
- `resources/js/components/Backend/{InputError,InputLabel,PrimaryButton,SecondaryButton,TextInput,Checkbox}.tsx`
- `resources/js/components/ui/{button,label,input}.tsx`
- `resources/js/components/shared/{theme-provider,ApplicationLogo}.tsx`

Remove allowlist entries as each file is migrated.

Count: 0

(empty — all `@ts-nocheck` markers cleared; `npm run typecheck` exits 0)
