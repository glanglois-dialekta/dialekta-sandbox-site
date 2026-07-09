// Page d'accueil : promotion héro + produits vedettes.
document.addEventListener('DOMContentLoaded', function () {
  var LIST_NAME = 'Vedettes - Accueil';
  var PROMO = {
    promotion_id: 'promo_bienvenue10',
    promotion_name: 'Bienvenue -10 %',
    creative_name: 'banniere_hero_accueil',
    creative_slot: 'hero'
  };

  // La promotion du héro est visible dès le chargement
  BB.dlPush({ event: 'view_promotion', ecommerce: Object.assign({}, PROMO) });

  var promoLink = document.getElementById('hero-promo-link');
  if (promoLink) {
    promoLink.addEventListener('click', function () {
      BB.dlPush({ event: 'select_promotion', ecommerce: Object.assign({}, PROMO) });
    });
  }

  // Produits vedettes
  var grid = document.getElementById('featured-grid');
  if (grid) {
    var featured = window.BB_CATALOG.filter(function (p) { return p.featured; });
    grid.innerHTML = featured.map(function (p, i) { return BB.productCard(p, LIST_NAME, i); }).join('');
    BB.bindProductCards(grid);
    BB.dlPush({
      event: 'view_item_list',
      ecommerce: {
        item_list_name: LIST_NAME,
        items: featured.map(function (p, i) { return BB.toItem(p, { listName: LIST_NAME, index: i }); })
      }
    });
  }
});
