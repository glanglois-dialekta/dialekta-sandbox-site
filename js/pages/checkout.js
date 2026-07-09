// Caisse en 3 étapes : coordonnées, livraison (add_shipping_info),
// paiement (add_payment_info), puis création de la commande.
// L'événement purchase est poussé sur la page de confirmation.
document.addEventListener('DOMContentLoaded', function () {
  var totals = BB.cart.totals();
  if (!totals.items.length) {
    document.getElementById('checkout-steps').innerHTML =
      '<p class="empty-state">Votre panier est vide. <a href="boutique.html">Retour à la boutique</a></p>';
    return;
  }

  var state = { shippingTier: null, paymentType: null };

  function showStep(n) {
    document.querySelectorAll('.checkout-step').forEach(function (step, i) {
      step.classList.toggle('active', i === n - 1);
      step.classList.toggle('done', i < n - 1);
    });
  }

  function shippingCost() {
    if (totals.netSubtotal >= window.BB_CONFIG.freeShippingThreshold && state.shippingTier === 'standard') return 0;
    return window.BB_CONFIG.shippingRates[state.shippingTier] || 0;
  }

  function renderSummary() {
    var shipping = shippingCost();
    var taxable = totals.netSubtotal + shipping;
    var tps = BB.round2(taxable * window.BB_CONFIG.taxes.tps);
    var tvq = BB.round2(taxable * window.BB_CONFIG.taxes.tvq);
    var grand = BB.round2(taxable + tps + tvq);
    document.getElementById('order-summary').innerHTML =
      '<h3>Récapitulatif</h3><dl class="totals">' +
      '<dt>Sous-total</dt><dd>' + totals.subtotal.toFixed(2) + ' $</dd>' +
      (totals.discount ? '<dt>Rabais (' + totals.coupon + ')</dt><dd>-' + totals.discount.toFixed(2) + ' $</dd>' : '') +
      '<dt>Livraison</dt><dd>' + (state.shippingTier ? shipping.toFixed(2) + ' $' : 'à déterminer') + '</dd>' +
      '<dt>TPS (5 %)</dt><dd>' + tps.toFixed(2) + ' $</dd>' +
      '<dt>TVQ (9,975 %)</dt><dd>' + tvq.toFixed(2) + ' $</dd>' +
      '<dt class="grand-total">Total</dt><dd class="grand-total">' + grand.toFixed(2) + ' $</dd>' +
      '</dl>';
    return { shipping: shipping, tax: BB.round2(tps + tvq), grand: grand };
  }

  renderSummary();

  // Livraison gratuite : adapter le libellé de l'option standard
  if (totals.netSubtotal >= window.BB_CONFIG.freeShippingThreshold) {
    document.getElementById('standard-label').textContent = 'Standard (3 à 5 jours ouvrables) - Gratuite';
  }

  // Étape 1 : coordonnées
  document.getElementById('form-contact').addEventListener('submit', function (e) {
    e.preventDefault();
    showStep(2);
  });

  // Étape 2 : livraison
  document.getElementById('form-shipping').addEventListener('submit', function (e) {
    e.preventDefault();
    var checked = document.querySelector('input[name="shipping"]:checked');
    if (!checked) return;
    state.shippingTier = checked.value;
    renderSummary();
    BB.dlPush({
      event: 'add_shipping_info',
      ecommerce: {
        currency: window.BB_CONFIG.currency,
        value: totals.netSubtotal,
        coupon: totals.coupon || undefined,
        shipping_tier: state.shippingTier,
        items: totals.items
      }
    });
    showStep(3);
  });

  // Étape 3 : paiement puis commande
  document.getElementById('form-payment').addEventListener('submit', function (e) {
    e.preventDefault();
    var checked = document.querySelector('input[name="payment"]:checked');
    if (!checked) return;
    state.paymentType = checked.value;
    BB.dlPush({
      event: 'add_payment_info',
      ecommerce: {
        currency: window.BB_CONFIG.currency,
        value: totals.netSubtotal,
        coupon: totals.coupon || undefined,
        payment_type: state.paymentType,
        items: totals.items
      }
    });

    // Création de la commande (simulée) puis redirection vers la confirmation,
    // où l'événement purchase sera poussé une seule fois.
    var s = renderSummary();
    var order = {
      transaction_id: 'BB-' + Date.now().toString(36).toUpperCase(),
      currency: window.BB_CONFIG.currency,
      value: s.grand,
      tax: s.tax,
      shipping: s.shipping,
      coupon: totals.coupon || null,
      shipping_tier: state.shippingTier,
      payment_type: state.paymentType,
      items: totals.items,
      pushed: false
    };
    sessionStorage.setItem('bb_last_order', JSON.stringify(order));
    BB.cart.clear();
    window.location.href = 'confirmation.html';
  });

  // Liens "Modifier" pour revenir à une étape
  document.querySelectorAll('[data-goto-step]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      showStep(parseInt(link.getAttribute('data-goto-step'), 10));
    });
  });

  showStep(1);
});
