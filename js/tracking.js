// Couche de données et helpers de tracking.
// Ce fichier est chargé dans le <head>, avant GTM, pour que les métadonnées
// de page soient disponibles dès le premier événement.
window.dataLayer = window.dataLayer || [];
window.BB = window.BB || {};

// Push générique. Pour les événements e-commerce, on réinitialise d'abord
// l'objet ecommerce afin d'éviter que des items d'un événement précédent
// persistent dans le dataLayer (recommandation Google).
BB.dlPush = function (payload) {
  if (payload && payload.ecommerce) {
    window.dataLayer.push({ ecommerce: null });
  }
  window.dataLayer.push(payload);
};

BB.getUser = function () {
  try {
    return JSON.parse(localStorage.getItem('bb_user')) || null;
  } catch (e) {
    return null;
  }
};

// Métadonnées de page, poussées sur chaque page avant le chargement de GTM.
// Sert de base aux variables de couche de données dans GTM
// (page_type, login_status, user_id, etc.).
BB.pageMeta = function (pageType, extra) {
  var user = BB.getUser();
  var meta = {
    event: 'page_metadata',
    page_type: pageType,
    page_language: 'fr-CA',
    site_environment: 'sandbox',
    login_status: user ? 'connecte' : 'anonyme'
  };
  if (user) {
    // user_id haché, jamais de courriel ni de nom dans le dataLayer
    meta.user_id = user.userId;
  }
  if (extra) {
    for (var k in extra) meta[k] = extra[k];
  }
  window.dataLayer.push(meta);
};

// Convertit un produit du catalogue en item au format GA4.
BB.toItem = function (p, opts) {
  opts = opts || {};
  var item = {
    item_id: p.sku,
    item_name: p.name,
    item_brand: window.BB_CONFIG.brand,
    item_category: p.category,
    price: p.price,
    quantity: opts.quantity || 1
  };
  if (opts.variant) item.item_variant = opts.variant;
  if (opts.listName) {
    item.item_list_name = opts.listName;
    if (typeof opts.index === 'number') item.index = opts.index;
  }
  return item;
};

BB.round2 = function (n) {
  return Math.round(n * 100) / 100;
};
