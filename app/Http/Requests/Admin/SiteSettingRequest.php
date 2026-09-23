<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;

class SiteSettingRequest extends AdminFormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'about_intro' => ['nullable', 'string'],
            'social_menu' => ['nullable', 'array'],
            'social_menu.*.name' => ['required', 'string', 'max:50'],
            'social_menu.*.link' => ['required', 'url', 'max:255'],
            'footer' => ['nullable', 'array'],
            'footer.tagline' => ['nullable', 'string'],
            'footer.about_label' => ['nullable', 'string', 'max:255'],
            'footer.about_href' => ['nullable', 'string', 'max:255'],
            'footer.contact_label' => ['nullable', 'string', 'max:255'],
            'footer.contact_href' => ['nullable', 'string', 'max:255'],
            'footer.substack_label' => ['nullable', 'string', 'max:255'],
            'footer.copyright_name' => ['nullable', 'string', 'max:255'],
            'footer.map_title' => ['nullable', 'string', 'max:255'],
            'footer.map_description' => ['nullable', 'string'],
            'footer.map_iframe_title' => ['nullable', 'string', 'max:255'],
            'footer.map_embed_url' => ['nullable', 'string', 'max:2000'],
            'newsletter' => ['nullable', 'array'],
            'newsletter.heading' => ['nullable', 'string'],
            'newsletter.intro' => ['nullable', 'string'],
            'newsletter.substack_url' => ['nullable', 'url', 'max:255'],
            'newsletter.substack_embed' => ['nullable', 'url', 'max:255'],
            'newsletter.substack_title' => ['nullable', 'string', 'max:255'],
            'newsletter.embed_title' => ['nullable', 'string', 'max:255'],
            'home' => ['nullable', 'array'],
            'home.h1' => ['nullable', 'string', 'max:255'],
            'home.media_and_newsletter_heading' => ['nullable', 'string', 'max:255'],
            'home.media_heading' => ['nullable', 'string', 'max:255'],
            'home.newsletters_heading' => ['nullable', 'string', 'max:255'],
            'home.media_eyebrow' => ['nullable', 'string', 'max:255'],
            'home.newsletter_eyebrow' => ['nullable', 'string', 'max:255'],
            'home.featured_blogs_heading' => ['nullable', 'string', 'max:255'],
            'our_work' => ['nullable', 'array'],
            'our_work.thematic_heading' => ['nullable', 'string', 'max:255'],
            'our_work.thematic_intro' => ['nullable', 'string'],
            'our_work.sectors_heading' => ['nullable', 'string', 'max:255'],
            'our_work.sectors_intro' => ['nullable', 'string'],
            'our_work.explore_label' => ['nullable', 'string', 'max:255'],
            'our_work.placeholder_image' => ['nullable', 'string', 'max:255'],
            'our_work.sector_images' => ['nullable', 'array'],
            'our_work.sector_images.*' => ['nullable', 'string', 'max:255'],
            'reform_monitor' => ['nullable', 'array'],
            'reform_monitor.title' => ['nullable', 'string', 'max:255'],
            'reform_monitor.disclaimer' => ['nullable', 'string'],
            'errors' => ['nullable', 'array'],
            'errors.eyebrow' => ['nullable', 'string', 'max:255'],
            'errors.search_label' => ['nullable', 'string', 'max:255'],
            'errors.go_back_label' => ['nullable', 'string', 'max:255'],
            'errors.explore_heading' => ['nullable', 'string', 'max:255'],
            'errors.aside_heading' => ['nullable', 'string'],
            'errors.aside_body' => ['nullable', 'string'],
            'errors.public_links' => ['nullable', 'array'],
            'errors.public_links.*.href' => ['required', 'string', 'max:255'],
            'errors.public_links.*.label' => ['required', 'string', 'max:255'],
            'errors.pages' => ['nullable', 'array'],
            'globe_markers' => ['nullable', 'array'],
            'globe_markers.*.location' => ['required', 'array', 'size:2'],
            'globe_markers.*.location.0' => ['required', 'numeric'],
            'globe_markers.*.location.1' => ['required', 'numeric'],
            'globe_markers.*.size' => ['required', 'numeric'],
            'mobile_menu' => ['nullable', 'array'],
            'contact' => ['nullable', 'array'],
            'contact.org_name' => ['nullable', 'string', 'max:255'],
            'contact.working_days_label' => ['nullable', 'string', 'max:255'],
            'contact.working_days' => ['nullable', 'string', 'max:255'],
            'contact.office_hours_label' => ['nullable', 'string', 'max:255'],
            'contact.unavailable' => ['nullable', 'string'],
            'contact.location_image_alt' => ['nullable', 'string', 'max:255'],
            'media_fellows' => ['nullable', 'array'],
            'media_fellows.intro' => ['nullable', 'string'],
            'media_fellows.empty' => ['nullable', 'string'],
            'media_fellows.cohort_heading' => ['nullable', 'string', 'max:255'],
            'about' => ['nullable', 'array'],
            'about.member_institutions_heading' => ['nullable', 'string', 'max:255'],
            'about.member_institutions_intro' => ['nullable', 'string'],
            'search' => ['nullable', 'array'],
            'search.button_label' => ['nullable', 'string', 'max:255'],
            'search.title' => ['nullable', 'string', 'max:255'],
            'search.description' => ['nullable', 'string'],
            'search.placeholder' => ['nullable', 'string', 'max:255'],
            'search.input_label' => ['nullable', 'string', 'max:255'],
            'search.results_label' => ['nullable', 'string', 'max:255'],
            'search.press_enter' => ['nullable', 'string', 'max:255'],
            'search.helper' => ['nullable', 'string'],
            'search.examples' => ['nullable', 'array'],
            'search.examples.*' => ['nullable', 'string', 'max:50'],
            'seo' => ['nullable', 'array'],
            'seo.default_title' => ['nullable', 'string', 'max:255'],
            'seo.default_description' => ['nullable', 'string'],
            'seo.default_image' => ['nullable', 'string', 'max:255'],
            'seo.home_title' => ['nullable', 'string', 'max:255'],
            'seo.home_description' => ['nullable', 'string'],
        ];
    }

    protected function prepareForValidation(): void
    {
        foreach (['mobile_menu', 'globe_markers'] as $field) {
            $value = $this->input($field);

            if (! is_string($value)) {
                continue;
            }

            $decoded = json_decode($value, true);

            if (json_last_error() === JSON_ERROR_NONE) {
                $this->merge([$field => $decoded]);
            }
        }

        $pages = $this->input('errors.pages');

        if (is_string($pages)) {
            $decoded = json_decode($pages, true);

            if (json_last_error() === JSON_ERROR_NONE) {
                $errors = $this->input('errors', []);
                if (! is_array($errors)) {
                    $errors = [];
                }
                $errors['pages'] = $decoded;
                $this->merge(['errors' => $errors]);
            }
        }

        $sectorImages = $this->input('our_work.sector_images');

        if (is_string($sectorImages)) {
            $decoded = json_decode($sectorImages, true);

            if (json_last_error() === JSON_ERROR_NONE) {
                $ourWork = $this->input('our_work', []);
                if (! is_array($ourWork)) {
                    $ourWork = [];
                }
                $ourWork['sector_images'] = $decoded;
                $this->merge(['our_work' => $ourWork]);
            }
        }
    }
}
