# Ajouter de vraies peintures au jeu « Trouve les intrus »

1. **Crée l'image** (voir `Historia-prompts-intrus.txt` pour les prompts prêts à coller), format paysage, environ 1600 × 1000 px, JPEG ≤ 600 Ko.
2. **Ajoute un intrus moderne** : si l'IA ne l'a pas placé, retouche l'image (Gemini / ChatGPT : « ajoute un petit smartphone dans la main de l'homme à gauche, dans le même style de peinture » ; ou Photopea / Canva : colle l'objet et réduis-le).
3. Ouvre `tools/intrus-editor.html` dans un navigateur, charge l'image, clique au centre de chaque intrus, remplis les noms et anecdotes.
4. Copie le bloc obtenu dans le tableau `IMAGES` de `www/js/intrus-images.js`, place l'image dans `www/img/intrus/`.
5. Pousse le tout : la scène apparaît dans le jeu, avant les scènes dessinées.
