// Configuration globale du site
// IMPORTANT : remplacer gtmId par l'ID du conteneur GTM sandbox (format GTM-XXXXXXX).
// Le même ID doit aussi être remplacé dans les balises <noscript> de chaque page HTML
// (voir README.md pour une commande qui fait tout d'un coup).
window.BB_CONFIG = {
  gtmId: 'GTM-XXXXXXX',
  currency: 'CAD',
  brand: 'Brûlerie Boréale',
  freeShippingThreshold: 50,
  shippingRates: { standard: 7.99, express: 14.99 },
  taxes: { tps: 0.05, tvq: 0.09975 },
  coupons: { BIENVENUE10: 0.10 }
};
