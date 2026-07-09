// Compte client simulé : sign_up, login, logout.
// Le compte créé est conservé dans localStorage (bb_account); la session active
// vit dans bb_user. Le user_id est un hachage du courriel, jamais le courriel.
document.addEventListener('DOMContentLoaded', function () {
  var loggedOut = document.getElementById('account-logged-out');
  var loggedIn = document.getElementById('account-logged-in');

  function hashEmail(email) {
    // Hachage djb2 : suffisant pour générer un identifiant stable non réversible ici
    var h = 5381;
    for (var i = 0; i < email.length; i++) {
      h = ((h << 5) + h + email.charCodeAt(i)) >>> 0;
    }
    return 'BB-' + h.toString(36).toUpperCase();
  }

  function getAccount() {
    try {
      return JSON.parse(localStorage.getItem('bb_account')) || null;
    } catch (e) {
      return null;
    }
  }

  function render() {
    var user = BB.getUser();
    loggedOut.hidden = !!user;
    loggedIn.hidden = !user;
    if (user) {
      document.getElementById('account-greeting').textContent = 'Bonjour, ' + user.firstName + '!';
      document.getElementById('account-userid').textContent = user.userId;
    }
  }

  // Onglets connexion / inscription
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.tab-panel').forEach(function (p) { p.hidden = true; });
      btn.classList.add('active');
      document.getElementById(btn.getAttribute('data-tab')).hidden = false;
    });
  });

  // Inscription
  document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var firstName = document.getElementById('signup-prenom').value.trim();
    var email = document.getElementById('signup-courriel').value.trim().toLowerCase();
    if (!firstName || !email) return;
    var account = { userId: hashEmail(email), firstName: firstName, email: email };
    localStorage.setItem('bb_account', JSON.stringify(account));
    localStorage.setItem('bb_user', JSON.stringify(account));
    BB.dlPush({
      event: 'sign_up',
      method: 'courriel',
      user_id: account.userId
    });
    render();
  });

  // Connexion : on accepte seulement le courriel du compte créé sur ce navigateur
  document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('login-courriel').value.trim().toLowerCase();
    var account = getAccount();
    var error = document.getElementById('login-error');
    if (account && account.email === email) {
      localStorage.setItem('bb_user', JSON.stringify(account));
      BB.dlPush({
        event: 'login',
        method: 'courriel',
        user_id: account.userId
      });
      error.hidden = true;
      render();
    } else {
      error.hidden = false;
    }
  });

  // Déconnexion : on ferme la session, le compte reste disponible pour se reconnecter
  document.getElementById('logout-btn').addEventListener('click', function () {
    var user = BB.getUser();
    localStorage.removeItem('bb_user');
    BB.dlPush({
      event: 'logout',
      user_id: user ? user.userId : undefined
    });
    render();
  });

  render();
});
