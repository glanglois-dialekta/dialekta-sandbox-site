// Fiche produit : rendu dynamique, view_item, add_to_cart, produits similaires.
document.addEventListener('DOMContentLoaded', function () {
  var params = new URLSearchParams(window.location.search);
  var product = BB.getProduct(params.get('sku'));
  var container = document.getElementById('product-detail');

  if (!product) {
    container.innerHTML = '<p class="empty-state">Produit introuvable. <a href="boutique.html">Retour à la boutique</a></p>';
    return;
  }

  var isCoffee = product.category.indexOf('Café') === 0 ||
    product.category === 'Décaféiné' || product.category === 'Micro-lot';

  document.title = product.name + ' | Brûlerie Boréale';

  container.innerHTML =
    '<nav class="breadcrumb"><a href="index.html">Accueil</a> / <a href="boutique.html">Boutique</a> / ' + product.name + '</nav>' +
    '<div class="product-layout">' +
    '<div class="product-visual product-visual-lg">' + BB.productSvg(product) + '</div>' +
    '<div class="product-info">' +
    '<span class="product-category">' + product.category + '</span>' +
    '<h1>' + product.name + '</h1>' +
    '<p class="product-notes">' + product.notes + '</p>' +
    '<p class="product-price product-price-lg">' + product.price.toFixed(2) + ' $ <abbr title="Dollars canadiens">CAD</abbr></p>' +
    '<p>' + product.desc + '</p>' +
    (isCoffee
      ? '<label for="variant-select">Mouture</label>' +
        '<select id="variant-select">' +
        '<option value="Grains entiers">Grains entiers</option>' +
        '<option value="Mouture filtre">Mouture filtre</option>' +
        '<option value="Mouture espresso">Mouture espresso</option>' +
        '</select>'
      : '') +
    '<div class="qty-row">' +
    '<label for="qty-input">Quantité</label>' +
    '<input type="number" id="qty-input" value="1" min="1" max="20">' +
    '<button class="btn btn-accent" id="add-to-cart-btn">Ajouter au panier</button>' +
    '</div>' +
    '<p class="add-confirmation" id="add-confirmation" hidden>Ajouté au panier. <a href="panier.html">Voir le panier</a></p>' +
    '</div></div>';

  // view_item au chargement de la fiche
  BB.dlPush({
    event: 'view_item',
    ecommerce: {
      currency: window.BB_CONFIG.currency,
      value: product.price,
      items: [BB.toItem(product)]
    }
  });

  document.getElementById('add-to-cart-btn').addEventListener('click', function () {
    var variantEl = document.getElementById('variant-select');
    var variant = variantEl ? variantEl.value : null;
    var qty = parseInt(document.getElementById('qty-input').value, 10) || 1;
    BB.cart.add(product.sku, variant, qty);
    document.getElementById('add-confirmation').hidden = false;
  });

  // Produits similaires (même catégorie)
  var related = window.BB_CATALOG.filter(function (p) {
    return p.category === product.category && p.sku !== product.sku;
  }).slice(0, 3);
  var relatedGrid = document.getElementById('related-grid');
  if (related.length && relatedGrid) {
    var LIST_NAME = 'Produits similaires';
    relatedGrid.innerHTML = related.map(function (p, i) { return BB.productCard(p, LIST_NAME, i); }).join('');
    BB.bindProductCards(relatedGrid);
    BB.dlPush({
      event: 'view_item_list',
      ecommerce: {
        item_list_name: LIST_NAME,
        items: related.map(function (p, i) { return BB.toItem(p, { listName: LIST_NAME, index: i }); })
      }
    });
  } else if (relatedGrid) {
    document.getElementById('related-section').hidden = true;
  }
});
