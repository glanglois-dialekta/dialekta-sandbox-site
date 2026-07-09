// Confirmation de commande : pousse l'événement purchase une seule fois,
// même si la page est rechargée (protection contre les doubles transactions).
document.addEventListener('DOMContentLoaded', function () {
  var container = document.getElementById('confirmation-container');
  var order = null;
  try {
    order = JSON.parse(sessionStorage.getItem('bb_last_order'));
  } catch (e) { /* rien */ }

  if (!order) {
    container.innerHTML = '<p class="empty-state">Aucune commande récente. <a href="boutique.html">Retour à la boutique</a></p>';
    return;
  }

  if (!order.pushed) {
    BB.dlPush({
      event: 'purchase',
      ecommerce: {
        transaction_id: order.transaction_id,
        currency: order.currency,
        value: order.value,
        tax: order.tax,
        shipping: order.shipping,
        coupon: order.coupon || undefined,
        payment_type: order.payment_type,
        shipping_tier: order.shipping_tier,
        items: order.items
      }
    });
    order.pushed = true;
    sessionStorage.setItem('bb_last_order', JSON.stringify(order));
  }

  var rows = order.items.map(function (item) {
    return '<tr><td>' + item.item_name +
      (item.item_variant ? '<br><small>' + item.item_variant + '</small>' : '') +
      '</td><td>' + item.quantity + '</td><td>' + (item.price * item.quantity).toFixed(2) + ' $</td></tr>';
  }).join('');

  container.innerHTML =
    '<div class="confirmation-box">' +
    '<h1>Merci pour votre commande!</h1>' +
    '<p>Numéro de commande : <strong>' + order.transaction_id + '</strong></p>' +
    '<p>Un courriel de confirmation vous sera envoyé sous peu (pas vraiment, ce site est fictif).</p>' +
    '<table class="cart-table"><thead><tr><th>Produit</th><th>Qté</th><th>Total</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table>' +
    '<dl class="totals">' +
    '<dt>Livraison</dt><dd>' + order.shipping.toFixed(2) + ' $</dd>' +
    '<dt>Taxes</dt><dd>' + order.tax.toFixed(2) + ' $</dd>' +
    '<dt class="grand-total">Total payé</dt><dd class="grand-total">' + order.value.toFixed(2) + ' $</dd>' +
    '</dl>' +
    '<a href="boutique.html" class="btn btn-accent" data-cta="confirmation_retour_boutique">Continuer à magasiner</a>' +
    '</div>';
});
