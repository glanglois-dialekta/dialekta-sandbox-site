# Brûlerie Boréale - Site de pratique analytics

Site e-commerce fictif (torréfacteur québécois) conçu comme environnement de formation GTM/GA4. Tout est statique : aucun backend, aucune dépendance, hébergeable tel quel sur GitHub Pages. Le site pousse plus de 25 événements dans le `dataLayer` (e-commerce GA4 complet, leads, vidéo, consentement, etc.); le conteneur GTM est vide au départ et c'est à la personne en formation de tout configurer.

## Documents

- [docs/brief-client.md](docs/brief-client.md) : mise en situation « nouveau client » à remettre à l'analyste.
- [docs/plan-de-tracking.md](docs/plan-de-tracking.md) : plan de tracking complet (événements, paramètres, conversions, dimensions personnalisées) et parcours de progression en 10 étapes.

## Mise en place

### 1. Créer les comptes sandbox

1. Créer un conteneur GTM (type Web) dans un compte sandbox.
2. Créer une propriété GA4 de pratique (avec un flux Web pointant vers l'URL GitHub Pages).

### 2. Brancher le conteneur GTM

Remplacer l'ID `GTM-XXXXXXX` par celui du conteneur sandbox. Il apparaît à deux endroits : dans `js/config.js` et dans la balise `<noscript>` de chaque page. Une seule commande fait tout :

```bash
cd brulerie-boreale
LC_ALL=C find . -name "*.html" -o -name "config.js" | xargs sed -i '' 's/GTM-XXXXXXX/GTM-VOTREID/g'
```

(Sous Linux, utiliser `sed -i` sans les guillemets vides.)

### 3. Publier sur GitHub Pages

```bash
git add -A && git commit -m "Configuration du conteneur GTM"
gh repo create brulerie-boreale --public --source=. --push
gh api repos/{owner}/brulerie-boreale/pages -X POST -f "source[branch]=main" -f "source[path]=/"
```

Ou via l'interface GitHub : Settings > Pages > Deploy from a branch > main / (root). Le site sera servi à `https://<utilisateur>.github.io/brulerie-boreale/`.

### 4. Valider

- Mode aperçu GTM (Tag Assistant) sur l'URL GitHub Pages.
- `dataLayer` dans la console du navigateur pour inspecter les pushes.
- DebugView dans GA4.

## Structure

```
index.html                 Accueil (promotions, produits vedettes)
boutique.html              Liste produits, recherche, filtres, tri
produit.html?sku=...       Fiche produit (variantes de mouture, ajout panier)
panier.html                Panier (quantités, code promo BIENVENUE10)
caisse.html                Caisse 3 étapes (livraison, paiement)
confirmation.html          Confirmation (événement purchase, protégé contre le double envoi)
contact.html               Formulaire de contact (generate_lead)
compte.html                Compte simulé (sign_up, login, logout, user_id haché)
blogue.html                Liste d'articles
blogue-guide-infusion.html Article avec vidéo simulée + téléchargement PDF
blogue-cafe-origines.html  Article long (exercice scroll tracking)
a-propos.html              Page entreprise
js/config.js               ID GTM et paramètres du site
js/tracking.js             Helpers dataLayer (pageMeta, dlPush, toItem)
js/gtm-loader.js           Snippet GTM officiel paramétré
js/catalog.js              Catalogue produits (12 produits) et visuels SVG
js/cart.js                 Panier localStorage + événements e-commerce
js/main.js                 Infolettre, CTA, téléchargements, bannière de consentement
js/pages/*.js              Logique et tracking propres à chaque page
docs/                      Brief client et plan de tracking
```

## Notes de conception

- Tous les événements passent par des pushes `dataLayer` faits par le site (déclencheurs GTM de type « Événement personnalisé »), comme sur un site dont le dataLayer a été implanté par l'équipe de développement.
- L'objet `ecommerce` est réinitialisé (`ecommerce: null`) avant chaque événement e-commerce, conformément aux recommandations Google.
- Aucun renseignement personnel n'est poussé dans le dataLayer : le `user_id` est un hachage du courriel, les champs de formulaire ne sont jamais transmis.
- Le panier vit dans `localStorage`, la dernière commande dans `sessionStorage`. Pour repartir à neuf : effacer les données de site dans les outils de développement.
- La vidéo du guide d'infusion est simulée en accéléré (18 secondes réelles pour 3 minutes de vidéo) afin de tester rapidement les paliers de progression.
- Taxes québécoises (TPS + TVQ) et livraison gratuite dès 50 $ : les montants `value`, `tax` et `shipping` de l'événement `purchase` sont réalistes.
