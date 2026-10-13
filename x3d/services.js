// The six services shown in the 3D carousel and on their own pages (French, English and Arabic sites).
// `device` picks the 3D model, `color` is its label colour, `pastel` the hover block in "Autres services".
export const SERVICES = [
  { slug: 'design-site-web', en: 'Website Design', ar: 'تصميم المواقع', name: 'Design de site web', device: 'browser', color: '#ff7a59', pastel: '#ffe4db' },
  { slug: 'developpement-web', en: 'Web Development', ar: 'تطوير المواقع', name: 'Développement web', device: 'laptop', color: '#10b981', pastel: '#d5f4e7' },
  { slug: 'boutique-en-ligne', en: 'Online Stores', ar: 'المتاجر الإلكترونية', name: 'Boutiques en ligne', device: 'box', color: '#f5b400', pastel: '#fff0c4' },
  { slug: 'referencement-seo', en: 'SEO Setup', ar: 'تحسين محركات البحث', name: 'Référencement SEO', device: 'phone', color: '#0ea5e9', pastel: '#d7eefb' },
  { slug: 'refonte-site-web', en: 'Website Redesign', ar: 'إعادة تصميم المواقع', name: 'Refonte de site', device: 'tablet', color: '#ec4899', pastel: '#fbdcec' },
  { slug: 'maintenance-site-web', en: 'Maintenance & Support', ar: 'الصيانة والدعم', name: 'Maintenance & support', device: 'monitor', color: '#84cc16', pastel: '#e9f6d2' },
];

// base: '' for French, '/en' for English, '/ar' for Arabic
export const servicePath = (slug, base = '') => `${base}/services/${slug}/`;
export const serviceName = (s, lang = 'fr') => s[lang] || s.name;
export const serviceIndex = (slug) => SERVICES.findIndex((s) => s.slug === slug);
