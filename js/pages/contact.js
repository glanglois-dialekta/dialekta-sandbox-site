// Formulaire de contact : generate_lead (sans aucun renseignement personnel).
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var sujet = document.getElementById('contact-sujet').value;
    // On pousse le sujet et le nom du formulaire, jamais le nom, le courriel
    // ni le contenu du message (renseignements personnels).
    BB.dlPush({
      event: 'generate_lead',
      form_name: 'contact',
      form_subject: sujet,
      lead_type: sujet === 'grossiste' ? 'b2b' : 'b2c'
    });
    form.hidden = true;
    document.getElementById('contact-success').hidden = false;
  });
});
