# RGB Online

Un système de contrôle lumineux en ligne pour shows, concerts et événements. Permet de contrôler les téléphones clients via leur écran, en envoyant des couleurs, effets lumineux, et plus encore en temps réel.

## ✨ Fonctions
- Contrôle centralisé via interface admin
- Palette RGB 64 couleurs + raccourcis clavier
- Effets spéciaux : Arc-en-ciel, Strobe
- Transition fondue (fade) ou coupure nette (cut)
- Support des ZONES : chaque spectateur peut être assigné à une zone (A, B, C...)
- Affichage dynamique côté client sans rechargement
- Affichage de message texte personnalisable
- Liste des clients connectés en temps réel

## 🔧 Installation (local)

```bash
npm install
node server.js
```

Accessible ensuite sur `http://localhost:10000`

## ☁️ Déploiement Render

1. Crée un projet sur [render.com](https://render.com)
2. Déploie depuis GitHub ce dossier
3. Active WebSocket dans les options avancées

## 🔤 Raccourcis clavier

- `1 à 8` → Couleurs rapides
- `a à z` → Accès palette RGB (64 couleurs)
