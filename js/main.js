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
});
