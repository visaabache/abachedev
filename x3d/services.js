// The six services shown in the 3D carousel and on their own pages (French site).
// `device` picks the 3D model, `color` is its label colour, `pastel` the hover block in "Autres services".
export const SERVICES = [
  { slug: 'design-site-web', name: 'Design de site web', device: 'browser', color: '#ff7a59', pastel: '#ffe4db' },
  { slug: 'developpement-web', name: 'Développement web', device: 'laptop', color: '#10b981', pastel: '#d5f4e7' },
  { slug: 'boutique-en-ligne', name: 'Boutiques en ligne', device: 'box', color: '#f5b400', pastel: '#fff0c4' },
  { slug: 'referencement-seo', name: 'Référencement SEO', device: 'phone', color: '#0ea5e9', pastel: '#d7eefb' },
  { slug: 'refonte-site-web', name: 'Refonte de site', device: 'tablet', color: '#ec4899', pastel: '#fbdcec' },
  { slug: 'maintenance-site-web', name: 'Maintenance & support', device: 'monitor', color: '#84cc16', pastel: '#e9f6d2' },
];

export const servicePath = (slug) => `/services/${slug}/`;
export const serviceIndex = (slug) => SERVICES.findIndex((s) => s.slug === slug);
