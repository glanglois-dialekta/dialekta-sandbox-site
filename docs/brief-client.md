# Brief client - Brûlerie Boréale

> Document de mise en situation. À remettre à la personne qui joue le rôle de l'analyste, comme s'il s'agissait d'un vrai brief de nouveau client.

## Le client

La Brûlerie Boréale est un torréfacteur artisanal fondé en 2014 à Chicoutimi. L'entreprise vend en ligne des cafés de spécialité, des accessoires et un abonnement mensuel, partout au Canada. Le commerce électronique représente environ 60 % de son chiffre d'affaires; le reste provient du café-boutique et des ventes en gros (restaurants, bureaux).

Le site vient d'être refait. L'équipe de développement a mis en place un dataLayer complet, mais aucune balise n'est encore configurée : le conteneur GTM est vide et la propriété GA4 est neuve.

## Le mandat

Implanter la mesure GA4 complète du site via Google Tag Manager, selon le plan de tracking fourni (docs/plan-de-tracking.md) :

1. Configurer la balise GA4 de base et les événements du plan de tracking.
2. Créer les variables de couche de données nécessaires (paramètres d'événements, données e-commerce).
3. Marquer les événements clés comme conversions dans GA4.
4. Mettre en place les dimensions personnalisées (portée événement et utilisateur).
5. Valider le tout en mode aperçu GTM et dans DebugView, puis publier.

## Objectifs d'affaires du client

- Augmenter les ventes en ligne, en particulier l'abonnement mensuel (marge la plus élevée, revenu récurrent).
- Développer le segment B2B : les demandes « grossiste » du formulaire de contact sont les leads les plus précieux (valeur moyenne d'un client B2B : environ 4 800 $ par année).
- Faire croître l'infolettre, principal levier de rétention.

## Questions auxquelles le client veut pouvoir répondre

- Quel est le taux de conversion e-commerce, et où le tunnel d'achat perd-il le plus d'utilisateurs (panier, livraison, paiement)?
- Quels produits et quelles catégories performent le mieux (vus, ajoutés au panier, achetés)?
- Les contenus du blogue et la vidéo du guide d'infusion contribuent-ils aux ventes?
- Combien de leads B2B le site génère-t-il par mois?
- Quelle part des utilisateurs est connectée à un compte, et ces utilisateurs achètent-ils plus?

## Contraintes

- Le client est au Québec : la conformité à la Loi 25 est un enjeu. Une bannière de consentement est en place et pousse le choix de l'utilisateur dans le dataLayer; la configuration du Consent Mode dans GTM fait partie des attentes (phase 2 acceptable).
- Aucun renseignement personnel (courriel, nom, adresse) ne doit se retrouver dans GA4.
- Devise : dollar canadien (CAD).
