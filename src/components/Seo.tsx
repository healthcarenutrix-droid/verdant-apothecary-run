import { Helmet } from "react-helmet-async";

interface SeoProps {
  title: string;
  description?: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "product";
  jsonLd?: Record<string, unknown>;
}

/** Per-page title, description, canonical and Open Graph tags. */
const Seo = ({ title, description, path, image, type = "website", jsonLd }: SeoProps) => {
  const absolute = (url?: string) => {
    if (!url) return undefined;
    if (/^https?:\/\//i.test(url)) return url;
    if (typeof window === "undefined") return url;
    return `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
  };
  const ogImage = absolute(image);

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={path} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type === "product" ? "website" : type} />
      <meta property="og:url" content={path} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content={ogImage ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
};

export default Seo;
