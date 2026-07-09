// Catalogue produits. Dans un vrai mandat, ces données viendraient du backend
// ou d'un flux produits; ici elles sont statiques pour garder le site autonome.
window.BB_CATALOG = [
  {
    sku: 'ESP-001', name: 'Espresso Nordique', category: 'Café espresso', price: 18.50,
    notes: 'Chocolat noir, noisette, cassonade', featured: true, type: 'bag', color: '#5b3a29',
    desc: 'Notre espresso signature. Un mélange corsé du Brésil et du Guatemala, torréfié foncé pour une crema dense et des notes de chocolat noir.'
  },
  {
    sku: 'ESP-004', name: 'Espresso Taïga', category: 'Café espresso', price: 21.00,
    notes: 'Cerise, cacao, sirop d’érable', type: 'bag', color: '#7b3f2a',
    desc: 'Un espresso moderne à la torréfaction moyenne. Parfait pour les lattés comme pour les espressos courts.'
  },
  {
    sku: 'FIL-002', name: 'Filtre du Fjord', category: 'Café filtre', price: 17.00,
    notes: 'Pomme verte, miel, amande', featured: true, type: 'bag', color: '#3f6a56',
    desc: 'Un café filtre doux et équilibré, torréfié pâle. Le café de tous les jours par excellence.'
  },
  {
    sku: 'FIL-005', name: 'Filtre Aurore', category: 'Café filtre', price: 16.50,
    notes: 'Agrumes, thé noir, caramel', type: 'bag', color: '#b0713a',
    desc: 'Un assemblage lumineux du Pérou et de la Colombie. Idéal en cafetière filtre ou en V60.'
  },
  {
    sku: 'DEC-003', name: 'Décaf Minuit', category: 'Décaféiné', price: 19.00,
    notes: 'Chocolat au lait, raisin sec, rond', type: 'bag', color: '#4a4058',
    desc: 'Décaféiné à l’eau (procédé Swiss Water), sans compromis sur le goût. Parfait après le souper.'
  },
  {
    sku: 'MIC-007', name: 'Micro-lot Éthiopie Guji', category: 'Micro-lot', price: 24.00,
    notes: 'Bleuet, jasmin, citron confit', featured: true, type: 'bag', color: '#8a5c9e',
    desc: 'Un lot nature d’exception, cultivé à 2100 m d’altitude. Quantités très limitées, torréfaction pâle.'
  },
  {
    sku: 'MIC-008', name: 'Micro-lot Colombie Huila', category: 'Micro-lot', price: 23.50,
    notes: 'Panela, orange sanguine, cacao', type: 'bag', color: '#a0522d',
    desc: 'Un lot lavé de la région du Huila, doux et sucré. Torréfaction pâle à moyenne.'
  },
  {
    sku: 'MEL-006', name: 'Mélange du Trappeur', category: 'Café filtre', price: 15.75,
    notes: 'Noix grillées, cacao, corsé', type: 'bag', color: '#6b4226',
    desc: 'Notre mélange économique et généreux, torréfié moyen-foncé. Le préféré des gros buveurs de café.'
  },
  {
    sku: 'ACC-009', name: 'Moulin manuel Boréal', category: 'Accessoires', price: 74.99,
    notes: 'Meules coniques en acier', type: 'gear', color: '#37474f',
    desc: 'Moulin manuel à meules coniques, 40 clics de réglage. Compact, robuste, parfait pour le bureau ou le camping.'
  },
  {
    sku: 'ACC-010', name: 'Cafetière à piston 1 L', category: 'Accessoires', price: 39.99,
    notes: 'Verre borosilicate, 8 tasses', type: 'gear', color: '#546e7a',
    desc: 'La classique cafetière à piston, revisitée avec un filtre double pour une tasse plus propre.'
  },
  {
    sku: 'ACC-011', name: 'Tasse en grès émaillé', category: 'Accessoires', price: 24.99,
    notes: 'Faite à la main au Québec, 350 ml', featured: true, type: 'mug', color: '#20647a',
    desc: 'Tasse en grès tournée à la main par une céramiste de Chicoutimi. Chaque pièce est unique.'
  },
  {
    sku: 'ABO-012', name: 'Abonnement découverte mensuel', category: 'Abonnement', price: 29.99,
    notes: '2 sacs par mois, livraison incluse', type: 'bag', color: '#c62f4b',
    desc: 'Recevez chaque mois deux cafés choisis par nos torréfacteurs, livrés chez vous. Sans engagement, annulable en tout temps.'
  }
];

window.BB = window.BB || {};

BB.getProduct = function (sku) {
  for (var i = 0; i < window.BB_CATALOG.length; i++) {
    if (window.BB_CATALOG[i].sku === sku) return window.BB_CATALOG[i];
  }
  return null;
};

// Génère un visuel SVG stylisé pour un produit (sac de café, moulin ou tasse).
BB.productSvg = function (p) {
  var initials = p.name.split(' ').slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
  if (p.type === 'mug') {
    return '<svg viewBox="0 0 200 200" role="img" aria-label="' + p.name + '">' +
      '<rect width="200" height="200" fill="#f1e9dc"/>' +
      '<path d="M55 70 h80 a6 6 0 0 1 6 6 v55 a24 24 0 0 1 -24 24 h-44 a24 24 0 0 1 -24 -24 v-55 a6 6 0 0 1 6 -6 z" fill="' + p.color + '"/>' +
      '<path d="M141 85 h12 a16 16 0 0 1 0 40 h-12 v-12 h10 a6 6 0 0 0 0 -16 h-10 z" fill="' + p.color + '"/>' +
      '<ellipse cx="95" cy="70" rx="40" ry="8" fill="#fff" opacity="0.35"/>' +
      '<text x="95" y="122" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#fff">' + initials + '</text>' +
      '</svg>';
  }
  if (p.type === 'gear') {
    return '<svg viewBox="0 0 200 200" role="img" aria-label="' + p.name + '">' +
      '<rect width="200" height="200" fill="#f1e9dc"/>' +
      '<rect x="70" y="55" width="60" height="100" rx="10" fill="' + p.color + '"/>' +
      '<rect x="78" y="63" width="44" height="30" rx="6" fill="#fff" opacity="0.25"/>' +
      '<circle cx="100" cy="45" r="10" fill="' + p.color + '"/>' +
      '<rect x="96" y="18" width="8" height="26" rx="4" fill="' + p.color + '"/>' +
      '<rect x="96" y="14" width="40" height="8" rx="4" fill="' + p.color + '"/>' +
      '<text x="100" y="135" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="#fff">' + initials + '</text>' +
      '</svg>';
  }
  // Sac de café par défaut
  return '<svg viewBox="0 0 200 200" role="img" aria-label="' + p.name + '">' +
    '<rect width="200" height="200" fill="#f1e9dc"/>' +
    '<path d="M60 55 h80 l8 115 a8 8 0 0 1 -8 8 h-80 a8 8 0 0 1 -8 -8 z" fill="' + p.color + '"/>' +
    '<rect x="56" y="42" width="88" height="18" rx="4" fill="' + p.color + '" opacity="0.75"/>' +
    '<circle cx="100" cy="118" r="30" fill="#f6f1e7"/>' +
    '<text x="100" y="127" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="' + p.color + '">' + initials + '</text>' +
    '<text x="100" y="165" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="#f6f1e7">BRÛLERIE BORÉALE</text>' +
    '</svg>';
};

// Rendu d'une carte produit (utilisé sur l'accueil, la boutique et les produits similaires).
BB.productCard = function (p, listName, index) {
  return '<article class="product-card">' +
    '<a href="produit.html?sku=' + p.sku + '" class="product-card-link" data-sku="' + p.sku + '" data-list="' + listName + '" data-index="' + index + '">' +
    '<div class="product-visual">' + BB.productSvg(p) + '</div>' +
    '<span class="product-category">' + p.category + '</span>' +
    '<h3>' + p.name + '</h3>' +
    '<p class="product-notes">' + p.notes + '</p>' +
    '<p class="product-price">' + p.price.toFixed(2) + ' $</p>' +
    '</a></article>';
};

// Attache le tracking select_item aux cartes produits d'un conteneur.
BB.bindProductCards = function (container) {
  container.addEventListener('click', function (e) {
    var link = e.target.closest('.product-card-link');
    if (!link) return;
    var p = BB.getProduct(link.getAttribute('data-sku'));
    if (!p) return;
    BB.dlPush({
      event: 'select_item',
      ecommerce: {
        item_list_name: link.getAttribute('data-list'),
        items: [BB.toItem(p, {
          listName: link.getAttribute('data-list'),
          index: parseInt(link.getAttribute('data-index'), 10)
        })]
      }
    });
  });
};
