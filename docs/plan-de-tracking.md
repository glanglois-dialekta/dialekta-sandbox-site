# Plan de tracking - Brûlerie Boréale

Tous les événements sont poussés dans le `dataLayer` par le site (aucun déclencheur de clic ou de formulaire GTM n'est nécessaire : utiliser des déclencheurs de type **Événement personnalisé**). Les noms d'événements et de paramètres suivent les conventions GA4 (snake_case). Devise : CAD.

Ouvrir la console du navigateur et taper `dataLayer` à tout moment pour inspecter ce qui a été poussé.

## 1. Événement de contexte (toutes les pages)

| Événement | Quand | Paramètres |
|---|---|---|
| `page_metadata` | Sur chaque page, avant le chargement de GTM | `page_type`, `page_language`, `site_environment`, `login_status`, `user_id` (si connecté), `article_id` et `article_category` (pages d'articles) |

Valeurs de `page_type` : `accueil`, `boutique`, `produit`, `panier`, `caisse`, `confirmation`, `contact`, `compte`, `blogue`, `article`, `a_propos`.

## 2. E-commerce (format GA4, objet `ecommerce` avec tableau `items`)

| Événement | Quand | Paramètres clés |
|---|---|---|
| `view_item_list` | Chargement d'une liste de produits (accueil, boutique, produits similaires) et après chaque filtre | `item_list_name`, `items[]` |
| `select_item` | Clic sur une carte produit | `item_list_name`, `items[]` (1 item avec `index`) |
| `view_item` | Chargement d'une fiche produit | `currency`, `value`, `items[]` |
| `add_to_cart` | Ajout au panier (fiche produit) ou hausse de quantité (panier) | `currency`, `value`, `items[]` (avec `item_variant` = mouture) |
| `remove_from_cart` | Retrait ou baisse de quantité au panier | `currency`, `value`, `items[]` |
| `view_cart` | Chargement de la page panier (si non vide) | `currency`, `value`, `items[]` |
| `begin_checkout` | Clic sur « Passer à la caisse » | `currency`, `value`, `coupon`, `items[]` |
| `add_shipping_info` | Validation de l'étape livraison | `shipping_tier` (`standard`/`express`), + mêmes paramètres |
| `add_payment_info` | Validation de l'étape paiement | `payment_type` (`carte_credit`/`paypal`), + mêmes paramètres |
| `purchase` | Chargement de la page de confirmation (poussé une seule fois, protégé contre le rechargement) | `transaction_id`, `value`, `tax`, `shipping`, `coupon`, `payment_type`, `shipping_tier`, `items[]` |

Attributs des items : `item_id`, `item_name`, `item_brand`, `item_category`, `item_variant`, `price`, `quantity`, `item_list_name`, `index`.

## 3. Promotions et marchandisage

| Événement | Quand | Paramètres |
|---|---|---|
| `view_promotion` | Affichage de la bannière promo de l'accueil | `promotion_id`, `promotion_name`, `creative_name`, `creative_slot` |
| `select_promotion` | Clic sur la bannière promo | mêmes paramètres |
| `coupon_applied` | Code promo valide appliqué au panier | `coupon`, `discount_value` (événement personnalisé, hors spec GA4) |

## 4. Recherche et navigation

| Événement | Quand | Paramètres |
|---|---|---|
| `search` | Arrivée sur la boutique avec un terme de recherche | `search_term`, `search_results` |
| `filter_products` | Changement de filtre ou de tri en boutique | `filter_category`, `sort_by`, `results_count` |
| `select_content` | Clic sur un article du blogue | `content_type`, `content_id`, `content_title` |
| `cta_click` | Clic sur un bouton d'appel à l'action identifié | `cta_label`, `cta_destination` |

## 5. Leads et formulaires

| Événement | Quand | Paramètres |
|---|---|---|
| `generate_lead` | Envoi du formulaire de contact | `form_name`, `form_subject` (`commande`/`grossiste`/`presse`/`autre`), `lead_type` (`b2b`/`b2c`) |
| `newsletter_signup` | Abonnement à l'infolettre (pied de page) | `form_location` |

## 6. Compte utilisateur

| Événement | Quand | Paramètres |
|---|---|---|
| `sign_up` | Création de compte | `method`, `user_id` |
| `login` | Connexion | `method`, `user_id` |
| `logout` | Déconnexion | `user_id` |

Le `user_id` est un identifiant haché (jamais le courriel). À utiliser pour la fonctionnalité User-ID de GA4.

## 7. Média et fichiers

| Événement | Quand | Paramètres |
|---|---|---|
| `video_start` | Lancement de la vidéo du guide d'infusion | `video_title`, `video_provider`, `video_duration`, `video_percent` |
| `video_progress` | Paliers 25 %, 50 %, 75 % | mêmes paramètres |
| `video_complete` | Fin de la vidéo | mêmes paramètres |
| `file_download` | Clic sur la carte des cafés (PDF) | `file_name`, `file_extension`, `link_url` |

## Conversions recommandées dans GA4

| Événement | Justification |
|---|---|
| `purchase` | Vente en ligne (KPI principal) |
| `generate_lead` | Lead B2B/B2C; les leads `grossiste` valent environ 4 800 $/an |
| `sign_up` | Création de compte (rétention) |
| `newsletter_signup` | Levier de rétention principal |
| `begin_checkout` | Micro-conversion utile pour les audiences de remarketing |

## Dimensions personnalisées à créer dans GA4

| Nom | Paramètre | Portée |
|---|---|---|
| Type de page | `page_type` | Événement |
| Statut de connexion | `login_status` | Événement |
| Sujet du formulaire | `form_subject` | Événement |
| Type de lead | `lead_type` | Événement |
| Mode de paiement | `payment_type` | Événement |
| Mode de livraison | `shipping_tier` | Événement |
| Titre de la vidéo | `video_title` | Événement |

## Parcours de progression suggéré (pour la formation)

1. Créer la balise « Google Tag » GA4 déclenchée sur toutes les pages; vérifier les page_view dans DebugView.
2. Créer les variables de couche de données pour `page_type` et `login_status`, et les envoyer avec chaque événement.
3. Configurer `view_item` et `add_to_cart` avec l'objet `ecommerce` (case « Envoyer les données e-commerce »).
4. Compléter le tunnel : `view_cart`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase`. Faire un achat test complet et le retrouver dans GA4.
5. Ajouter les événements de leads (`generate_lead`, `newsletter_signup`) et les marquer comme conversions.
6. Ajouter `search`, `select_item`, `view_item_list`, `select_promotion`.
7. Ajouter les événements vidéo et `file_download`.
8. Mettre en place User-ID à partir de `user_id` (événements `login`/`sign_up` et `page_metadata`).
9. Créer les dimensions personnalisées et vérifier qu'elles se remplissent (délai de 24 h dans les rapports; visibles tout de suite dans DebugView).
10. Défi avancé : sortir du dataLayer et utiliser les déclencheurs natifs GTM, par exemple la profondeur de défilement (paliers 50 % et 90 %) sur les articles du blogue.

Autres exercices bonus avec les déclencheurs natifs : minuterie d'engagement, clics sortants.
