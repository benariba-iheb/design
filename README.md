# Gasra (قصرة) — De ton quartier, à ton pays

> **« من حومتك، لبلادك »**  
> Plateforme sociale algérienne qui transforme le temps passé sur son téléphone en revenu local en Dinars Algériens (DA).  
> **Livrable Jour 1 : Le Dossier Concept & Premières Esquisses Moyenne Fidélité**

---

## 🚀 Comment lancer et tester le projet

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancement en local
```bash
npm run dev
```
L'application démarre sur `http://localhost:3000`.

### 3. Comment tester sur ton smartphone

#### Option A : Lien direct ou QR Code (Pour le Jury)
1. Ouvrez l'application sur votre ordinateur.
2. Cliquez sur le bouton **« QR Mobile »** dans la barre du haut ou rendez-vous sur `/screen/web-landing`.
3. Ouvrez l'appareil photo de votre téléphone (iPhone ou Android) et scannez le QR code.
4. Gasra s'ouvre instantanément dans votre navigateur mobile.

#### Option B : En réseau local Wi-Fi pendant le dev
1. Connectez votre ordinateur et votre téléphone sur le même réseau Wi-Fi.
2. Lancez le serveur avec l'option host :
   ```bash
   npm run dev -- --host
   ```
3. Ouvrez sur votre smartphone l'adresse affichée dans le terminal (ex: `http://192.168.1.XX:3000`).

#### Option C : Installer comme une vraie application (PWA)
- **Sur iPhone (Safari)** : Bouton *Partager* → *Sur l'écran d'accueil*.
- **Sur Android (Chrome)** : Menu (3 points) → *Installer l'application* (ou cliquer sur le bouton *Installer* intégré dans Gasra).
- Gasra s'ouvrira en plein écran sans barre d'adresse avec son icône « G ».

---

## 🧭 Structure des Livrables Jour 1

| Route | Description |
|---|---|
| **`/concept`** | **Livrable 1 : Le Dossier Concept (14 slides)** plein écran, navigation clavier/flèches/tactile, barre de progression et sommaire. |
| **`/ecrans`** | **Livrable 2 : Galerie des 9 esquisses**, chacune annotée avec 2 ou 3 choix de conception UX et rattachement aux parcours. |
| **`/screen/onboarding`** | Mobile 1 : Accueil + inscription (téléphone, OTP, Wilaya/Quartier, Se montrer vs Discret). |
| **`/screen/feed`** | Mobile 2 : Fil d'actualité avec Le Pouls du quartier en tête, les 8 réactions Gasra et « Offrir un café ». |
| **`/screen/creer`** | Mobile 3 : Création d'une publication, promotion de bon avec calculateur de gain et avis certifié. |
| **`/screen/profil`** | Mobile 4 : Profil avec niveau (Weld el Houma), jauge de progression et statut Berrani par wilaya. |
| **`/screen/explorer`** | Mobile 5 : Carte interactive OpenStreetMap / Leaflet avec filtres de calques (Bons, Missions, Commerces). |
| **`/screen/commerce`** | Mobile 6 : Page d'un commerce avec bons actifs, avis vérifiés et bouton prédictif « Rani jay ». |
| **`/screen/portefeuille`** | Mobile 7 : Portefeuille en DA, cagnotte des points, conversion et retrait vers Edahabia / BaridiMob. |
| **`/screen/web-landing`** | Web 8 : Page d'accueil visiteur avec le QR code scannable pour tester sur mobile. |
| **`/screen/web-feed`** | Web 9 : Fil d'actualité 3 colonnes pour grand écran. |

---

## 🎨 Identité Visuelle « Pétrole et Citron »
- **Fond** : Clair `#F3F7F6` / Sombre `#0B1E26`
- **Surface** : Clair `#FFFFFF` / Sombre `#14303B`
- **Signature Citron** : `#E4FF3C`
- **Argent & Gains** : `#3D5AFE` (Clair) / `#6F86FF` (Sombre)
- **Local & Affluence** : `#E0503A` (Clair) / `#FF8A78` (Sombre)
- **Typographie** : **Readex Pro** (optimisée pour l'harmonie arabe RTL et français LTR)
- **Les 8 Réactions Gasra** :
  1. *Ya3tik saha* (يعطيك الصحة) — Main sur le cœur, réaction par défaut
  2. *Hbel* (هبل) — Flamme / enthousiasme
  3. *Hhhh* (هههه) — Rire et autodérision
  4. *Ya hasra* (يا حسرة) — Nostalgie
  5. *Wach hada* (واش هذا) — Étonnement
  6. *Nervi* (نرفي) — Langue mordue / agacement
  7. *M3ak* (معاك) — Solidarité
  8. *Rani jay* (راني جاي) — Signal d'intention de visite en magasin
