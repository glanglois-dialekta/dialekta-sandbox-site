// Snippet officiel Google Tag Manager, paramétré via BB_CONFIG.gtmId.
(function (w, d, s, l, i) {
  if (!i || i === 'GTM-XXXXXXX') {
    console.warn('[Brûlerie Boréale] Aucun ID GTM configuré. Modifier js/config.js pour activer le conteneur.');
  }
  w[l] = w[l] || [];
  w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var f = d.getElementsByTagName(s)[0];
  var j = d.createElement(s);
  var dl = l !== 'dataLayer' ? '&l=' + l : '';
  j.async = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', window.BB_CONFIG.gtmId);
