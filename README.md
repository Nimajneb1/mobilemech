# Mobile Mech rebuild starter

This is a static, responsive rebuild starter for `mobilemech.co.nz`.

## Included pages

- `index.html` — cleaner home page with clear calls to action
- `services.html` — service packages and other service descriptions
- `wof.html` — dedicated WOF pre-check and repair page
- `gallery.html` — gallery shell with prompts for genuine job photos
- `contact.html` — direct contact details and an email-prefill quote form
- `terms.html` — migration draft of the current terms for owner review
- `assets/style.css` — all styling
- `assets/site.js` — mobile navigation, current year and quote-email helper
- `assets/mobile-mech-banner.png` — converted from the supplied AVIF banner
- `robots.txt` and `sitemap.xml` — basic search-engine files

## Important before launch

1. **Review every claim and price.** The starter uses information shown on the current website, but the owner needs to confirm it is still accurate.
2. **Review the terms carefully.** The terms page is a migration draft. Publish a proper privacy policy as well.
3. **Replace remote Wix image links.** The logo, oil-filter hero and van photo currently load from the existing Wix site. Download the approved originals and update the URLs in the HTML files so the rebuilt site controls its own assets.
4. **Connect a real form service.** The contact form currently opens a pre-filled email. Replace this with a form backend before launch if web submissions are required.
5. **Add real project photos.** The gallery intentionally includes placeholders. Genuine photos of completed work will materially improve credibility.
6. **Confirm analytics and advertising tags.** Add the correct GA4 / Google Ads tags only after the final hosting approach is known.

## Local preview

Open `index.html` directly in a browser, or run a simple local server from this folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Suggested next development step

After the business owner has confirmed the wording and service priorities, refine the home-page copy and replace the temporary email-prefill form with the chosen booking workflow.
