// Comportements globaux présents sur toutes les pages.
document.addEventListener('DOMContentLoaded', function () {
  BB.updateCartBadge();

  // Lien Compte : affiche le prénom si l'utilisateur est connecté
  var user = BB.getUser();
  var accountLink = document.getElementById('account-link');
  if (accountLink && user) {
    accountLink.textContent = 'Bonjour, ' + user.firstName;
  }

  // Infolettre (pied de page)
  var newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = newsletterForm.querySelector('input[type="email"]').value.trim();
      if (!email) return;
      // On ne pousse jamais le courriel dans le dataLayer (renseignement personnel)
      BB.dlPush({
        event: 'newsletter_signup',
        form_location: 'footer'
      });
      newsletterForm.hidden = true;
      var success = document.querySelector('.newsletter-success');
      if (success) success.hidden = false;
    });
  }

  // Boutons d'appel à l'action identifiés par data-cta
  document.body.addEventListener('click', function (e) {
    var cta = e.target.closest('[data-cta]');
    if (cta) {
      BB.dlPush({
        event: 'cta_click',
        cta_label: cta.getAttribute('data-cta'),
        cta_destination: cta.getAttribute('href') || null
      });
    }

    // Téléchargements de fichiers (PDF)
    var dl = e.target.closest('a[href$=".pdf"]');
    if (dl) {
      var url = dl.getAttribute('href');
      BB.dlPush({
        event: 'file_download',
        file_name: url.split('/').pop(),
        file_extension: 'pdf',
        link_url: url
      });
    }
  });

  // Bannière de consentement (simplifiée, à des fins de formation).
  // Le choix est poussé dans le dataLayer pour alimenter le Consent Mode dans GTM.
  var banner = document.getElementById('cookie-banner');
  if (banner) {
    var stored = localStorage.getItem('bb_consent');
    if (stored) {
      pushConsent(stored, 'stored');
    } else {
      banner.hidden = false;
    }
    var accept = document.getElementById('cookie-accept');
    var refuse = document.getElementById('cookie-refuse');
    if (accept) accept.addEventListener('click', function () { chooseConsent('granted'); });
    if (refuse) refuse.addEventListener('click', function () { chooseConsent('denied'); });
  }

  function chooseConsent(state) {
    localStorage.setItem('bb_consent', state);
    banner.hidden = true;
    pushConsent(state, 'banner');
  }

  function pushConsent(state, source) {
    BB.dlPush({
      event: 'cookie_consent_update',
      consent_source: source,
      analytics_storage: state,
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state
    });
  }
});
