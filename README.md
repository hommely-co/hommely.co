# hommely.co

- `site/`: the public website, plain HTML. Edit pages here; design and content are unchanged from the drag-and-drop version.
- `netlify/functions/`: server code (Stripe checkout, webhooks, downloads, Homzy quotes, admin). Added in Phase 1.
- Secrets (Stripe keys, admin password hash, GA4 API secret) live ONLY in Netlify environment variables, never in this repository.

Deploys: every branch and pull request gets a private Deploy Preview. Production auto-publishing is stopped; a person publishes each production deploy in Netlify.
