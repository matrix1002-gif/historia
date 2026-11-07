# Activer le classement en ligne (≈10 min, gratuit)

1. https://console.firebase.google.com → « Ajouter un projet » → nom : Historia (Analytics inutile).
2. Dans le projet : « Créer » → **Authentication** → Commencer → fournisseur **E-mail/Mot de passe** → Activer.
3. **Firestore Database** → Créer une base → mode production → région europe-west (ex. eur3).
4. Onglet **Règles** de Firestore : coller le contenu de `firebase/firestore.rules` → Publier.
5. ⚙ Paramètres du projet → « Vos applications » → ajouter une appli **Web** (</>) → copier apiKey, authDomain, projectId, appId.
6. Les coller dans `www/js/firebase-config.js`, puis me renvoyer le build (ou me donner les valeurs, je les mets).
7. Authentication → Paramètres → Domaines autorisés : ajouter `localhost` (l'appli Android Capacitor utilise localhost).
Le classement s'affiche alors dans l'onglet Quiz. Tant que la configuration est vide, il est marqué « indisponible ».
