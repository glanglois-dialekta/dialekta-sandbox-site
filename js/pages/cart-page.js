// Page panier : affichage, quantités, retraits, code promo, begin_checkout.
document.addEventListener('DOMContentLoaded', function () {
  var container = document.getElementById('cart-container');

  function render() {
    var cart = BB.cart.get();
    var totals = BB.cart.totals('Panier');

    if (!cart.items.length) {
      container.innerHTML = '<p class="empty-state">Votre panier est vide. <a href="boutique.html">Découvrir nos cafés</a></p>';
      return;
    }

    var rows = cart.items.map(function (line, i) {
      var p = BB.getProduct(line.sku);
      return '<tr>' +
        '<td class="cart-visual">' + BB.productSvg(p) + '</td>' +
        '<td><a href="produit.html?sku=' + p.sku + '">' + p.name + '</a>' +
        (line.variant ? '<br><small>' + line.variant + '</small>' : '') + '</td>' +
        '<td>' + p.price.toFixed(2) + ' $</td>' +
        '<td><input type="number" class="qty-input" data-index="' + i + '" value="' + line.qty + '" min="0" max="20"></td>' +
        '<td>' + (p.price * line.qty).toFixed(2) + ' $</td>' +
        '<td><button class="btn-link remove-btn" data-index="' + i + '">Retirer</button></td>' +
        '</tr>';
    }).join('');

    container.innerHTML =
      '<table class="cart-table"><thead><tr>' +
      '<th></th><th>Produit</th><th>Prix</th><th>Qté</th><th>Total</th><th></th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table>' +
      '<div class="cart-summary">' +
      '<form id="coupon-form" class="coupon-form">' +
      '<input type="text" id="coupon-input" placeholder="Code promo" ' + (cart.coupon ? 'value="' + cart.coupon + '" disabled' : '') + '>' +
      (cart.coupon ? '<span class="coupon-ok">Code appliqué</span>' : '<button type="submit" class="btn">Appliquer</button>') +
      '</form>' +
      '<p id="coupon-error" class="form-error" hidden>Code promo invalide.</p>' +
      '<dl class="totals">' +
      '<dt>Sous-total</dt><dd>' + totals.subtotal.toFixed(2) + ' $</dd>' +
      (totals.discount ? '<dt>Rabais (' + cart.coupon + ')</dt><dd>-' + totals.discount.toFixed(2) + ' $</dd>' : '') +
      '<dt>Livraison</dt><dd>calculée à la caisse</dd>' +
      '</dl>' +
      '<a class="btn btn-accent btn-lg" id="checkout-btn" href="caisse.html">Passer à la caisse</a>' +
      '</div>';

    // Quantités
    container.querySelectorAll('.qty-input').forEach(function (input) {
      input.addEventListener('change', function () {
        var line = BB.cart.get().items[parseInt(input.getAttribute('data-index'), 10)];
        BB.cart.setQty(line.sku, line.variant, parseInt(input.value, 10) || 0);
        render();
      });
    });

    // Retraits
    container.querySelectorAll('.remove-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var line = BB.cart.get().items[parseInt(btn.getAttribute('data-index'), 10)];
        BB.cart.remove(line.sku, line.variant);
        render();
      });
    });

    // Code promo
    var couponForm = document.getElementById('coupon-form');
    couponForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = BB.cart.applyCoupon(document.getElementById('coupon-input').value);
      if (ok) {
        render();
      } else {
        document.getElementById('coupon-error').hidden = false;
      }
    });

    // begin_checkout au clic sur "Passer à la caisse"
    document.getElementById('checkout-btn').addEventListener('click', function () {
      var t = BB.cart.totals('Panier');
      BB.dlPush({
        event: 'begin_checkout',
        ecommerce: {
          currency: window.BB_CONFIG.currency,
          value: t.netSubtotal,
          coupon: t.coupon || undefined,
          items: t.items
        }
      });
    });
  }

  render();

  // view_cart au chargement (seulement si le panier contient des items)
  var totals = BB.cart.totals('Panier');
  if (totals.items.length) {
    BB.dlPush({
      event: 'view_cart',
      ecommerce: {
        currency: window.BB_CONFIG.currency,
        value: totals.netSubtotal,
        items: totals.items
      }
    });
  }
});
