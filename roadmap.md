# Roadmap

- [ ] Products, collections, blogs stored in the database (single source of truth)
- [ ] Seed existing catalogue into the database
- [ ] SEO fields (meta title, meta description, URL handle) on products, collections, blogs
- [ ] Blog: auto H1 from title, H2/H3 in body, featured image + alt text, OG tags
- [ ] Dashboard forms to edit all SEO fields without code
- [ ] Per-page head tags via react-helmet-async
- [ ] Crawler meta edge function for product/collection/blog pages
- [ ] sitemap.xml generated live from database content
- [ ] robots.txt allows /product/, /collections/, /blog/
- [x] Explain no rebuild is needed (live data, not prerendered)

## Status update
- [x] SEO fields (handle, meta title, meta description, image alt, social image) in product, collection and blog forms
- [x] Per-page title/description/canonical/OG/Twitter + JSON-LD via Seo component (home, shop, collection, product, blog, blog post)
- [x] Blog title is the only H1; H2/H3 available in the editor; featured image alt text
- [x] Site-wide head metadata in index.html
- [x] robots.txt allows /product/, /collections/, /blog/
- [ ] sitemap.xml — deferred until the site has a public/published domain

- [x] Database-backed announcement bar with dashboard controls and live storefront updates
