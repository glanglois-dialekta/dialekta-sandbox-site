// Boutique : liste des produits, recherche, filtres et tri.
document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('shop-grid');
  var countEl = document.getElementById('shop-count');
  var categorySelect = document.getElementById('filter-category');
  var sortSelect = document.getElementById('sort-by');
  var params = new URLSearchParams(window.location.search);
  var query = (params.get('q') || '').trim();
  var listName = query ? 'Résultats de recherche' : 'Boutique';

  function currentProducts() {
    var products = window.BB_CATALOG.slice();
    if (query) {
      var q = query.toLowerCase();
      products = products.filter(function (p) {
        return (p.name + ' ' + p.category + ' ' + p.notes + ' ' + p.desc).toLowerCase().indexOf(q) !== -1;
      });
    }
    var cat = categorySelect.value;
    if (cat !== 'tous') {
      products = products.filter(function (p) { return p.category === cat; });
    }
    var sort = sortSelect.value;
    if (sort === 'prix-asc') products.sort(function (a, b) { return a.price - b.price; });
    if (sort === 'prix-desc') products.sort(function (a, b) { return b.price - a.price; });
    if (sort === 'nom') products.sort(function (a, b) { return a.name.localeCompare(b.name, 'fr'); });
    return products;
  }

  function render(products) {
    grid.innerHTML = products.length
      ? products.map(function (p, i) { return BB.productCard(p, listName, i); }).join('')
      : '<p class="empty-state">Aucun produit ne correspond à votre recherche.</p>';
    countEl.textContent = products.length + (products.length > 1 ? ' produits' : ' produit');
  }

  function pushList(products) {
    BB.dlPush({
      event: 'view_item_list',
      ecommerce: {
        item_list_name: listName,
        items: products.map(function (p, i) { return BB.toItem(p, { listName: listName, index: i }); })
      }
    });
  }

  // Rendu initial
  var initial = currentProducts();
  render(initial);
  BB.bindProductCards(grid);

  if (query) {
    var title = document.getElementById('shop-title');
    if (title) title.textContent = 'Résultats pour « ' + query + ' »';
    BB.dlPush({
      event: 'search',
      search_term: query,
      search_results: initial.length
    });
  }
  pushList(initial);

  // Filtres et tri
  function onFilterChange() {
    var products = currentProducts();
    render(products);
    BB.dlPush({
      event: 'filter_products',
      filter_category: categorySelect.value,
      sort_by: sortSelect.value,
      results_count: products.length
    });
    pushList(products);
  }
  categorySelect.addEventListener('change', onFilterChange);
  sortSelect.addEventListener('change', onFilterChange);
});
