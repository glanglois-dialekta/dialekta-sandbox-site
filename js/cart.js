// Gestion du panier (localStorage) et événements e-commerce associés.
window.BB = window.BB || {};

BB.cart = {
  KEY: 'bb_cart',

  get: function () {
    try {
      var data = JSON.parse(localStorage.getItem(this.KEY));
      if (data && Array.isArray(data.items)) return data;
    } catch (e) { /* panier corrompu, on repart à neuf */ }
    return { items: [], coupon: null };
  },

  save: function (cart) {
    localStorage.setItem(this.KEY, JSON.stringify(cart));
    BB.updateCartBadge();
  },

  count: function () {
    return this.get().items.reduce(function (sum, line) { return sum + line.qty; }, 0);
  },

  findLine: function (cart, sku, variant) {
    for (var i = 0; i < cart.items.length; i++) {
      if (cart.items[i].sku === sku && cart.items[i].variant === variant) return cart.items[i];
    }
    return null;
  },

  // Ajout au panier + événement add_to_cart
  add: function (sku, variant, qty) {
    qty = qty || 1;
    var p = BB.getProduct(sku);
    if (!p) return;
    var cart = this.get();
    var line = this.findLine(cart, sku, variant);
    if (line) {
      line.qty += qty;
    } else {
      cart.items.push({ sku: sku, variant: variant || null, qty: qty });
    }
    this.save(cart);
    BB.dlPush({
      event: 'add_to_cart',
      ecommerce: {
        currency: window.BB_CONFIG.currency,
        value: BB.round2(p.price * qty),
        items: [BB.toItem(p, { quantity: qty, variant: variant })]
      }
    });
  },

  // Retrait complet d'une ligne + événement remove_from_cart
  remove: function (sku, variant) {
    var p = BB.getProduct(sku);
    var cart = this.get();
    var line = this.findLine(cart, sku, variant);
    if (!line) return;
    cart.items = cart.items.filter(function (l) { return l !== line; });
    this.save(cart);
    BB.dlPush({
      event: 'remove_from_cart',
      ecommerce: {
        currency: window.BB_CONFIG.currency,
        value: BB.round2(p.price * line.qty),
        items: [BB.toItem(p, { quantity: line.qty, variant: variant })]
      }
    });
  },

  // Changement de quantité : pousse add_to_cart ou remove_from_cart sur le delta,
  // conformément aux recommandations GA4.
  setQty: function (sku, variant, qty) {
    var p = BB.getProduct(sku);
    var cart = this.get();
    var line = this.findLine(cart, sku, variant);
    if (!line || !p) return;
    var delta = qty - line.qty;
    if (delta === 0) return;
    if (qty <= 0) {
      this.remove(sku, variant);
      return;
    }
    line.qty = qty;
    this.save(cart);
    BB.dlPush({
      event: delta > 0 ? 'add_to_cart' : 'remove_from_cart',
      ecommerce: {
        currency: window.BB_CONFIG.currency,
        value: BB.round2(p.price * Math.abs(delta)),
        items: [BB.toItem(p, { quantity: Math.abs(delta), variant: variant })]
      }
    });
  },

  applyCoupon: function (code) {
    code = (code || '').trim().toUpperCase();
    if (!window.BB_CONFIG.coupons[code]) return false;
    var cart = this.get();
    cart.coupon = code;
    this.save(cart);
    var totals = this.totals();
    BB.dlPush({
      event: 'coupon_applied',
      coupon: code,
      discount_value: totals.discount
    });
    return true;
  },

  clear: function () {
    localStorage.removeItem(this.KEY);
    BB.updateCartBadge();
  },

  // Sous-total, rabais et items GA4 du panier courant.
  totals: function (listName) {
    var cart = this.get();
    var subtotal = 0;
    var items = [];
    cart.items.forEach(function (line, i) {
      var p = BB.getProduct(line.sku);
      if (!p) return;
      subtotal += p.price * line.qty;
      items.push(BB.toItem(p, { quantity: line.qty, variant: line.variant, listName: listName, index: i }));
    });
    var rate = cart.coupon ? window.BB_CONFIG.coupons[cart.coupon] : 0;
    var discount = BB.round2(subtotal * rate);
    return {
      items: items,
      coupon: cart.coupon,
      subtotal: BB.round2(subtotal),
      discount: discount,
      netSubtotal: BB.round2(subtotal - discount)
    };
  }
};

BB.updateCartBadge = function () {
  var badge = document.getElementById('cart-badge');
  if (!badge) return;
  var count = BB.cart.count();
  badge.textContent = count;
  badge.hidden = count === 0;
};
