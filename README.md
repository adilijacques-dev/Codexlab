# CodeXLab — Plateforme de cours statique (prête pour GitHub Pages)

Ce dépôt contient une petite plateforme de cours en HTML/CSS/JS statique (nommée CodeXLab) prête à être hébergée gratuitement sur GitHub Pages.

## Contenu
- `index.html` — page d'accueil listant les cours.
- `course.html` — page d'un cours (paramètre `?id=course-1`).
- `assets/css/styles.css` — styles.
- `assets/js/main.js` — logique JS pour charger `data/courses.json`.
- `data/courses.json` — données des cours / leçons (format JSON).
- `LICENSE` — MIT.

## Déploiement sur GitHub Pages (rapide)
1. Crée un nouveau dépôt GitHub (ex: `CodeXLab`) sur ton compte `adilijacques-dev`.
2. Clone-le localement :
   ```
   git clone https://github.com/adilijacques-dev/CodeXLab.git
   cd CodeXLab
   ```
3. Ajoute les fichiers fournis, commit et push :
   ```
   git add .
   git commit -m "Ajout CodeXLab — site statique"
   git push origin main
   ```
4. Sur GitHub, va dans `Settings` → `Pages`. Choisis la source :
   - Branch: `main`
   - Folder: `/ (root)`
   Clique sur "Save". Le site sera disponible à `https://adilijacques-dev.github.io/CodeXLab/` en quelques minutes.

## Personnalisation
- Ajouter un cours : ouvrir `data/courses.json` et ajouter un objet de cours (champ `id`, `title`, `description`, `image`, `level`, `tags`, `lessons`).
- Chaque leçon a `title` et `content` (HTML simple). Tu peux utiliser du `<pre><code>` pour montrer du code.
- Pour ajouter des ressources (images locales), crée `assets/images/` et mets les images, puis référence-les dans `data/courses.json`.

## Améliorations possibles
- Support Markdown (ajouter un parseur JS comme marked.js).
- Pagination, catégories, inscription utilisateur (nécessite backend).
- Utiliser GitHub Actions pour publier depuis une branche `docs/` ou générer des pages.

## Licence
MIT — voir `LICENSE`.