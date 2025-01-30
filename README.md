# Conf4Tous - Plateforme de Gestion de Conférences

Plateforme complète de gestion de conférences avec système de réservation de tickets et gestion des participants.

## ✨ Fonctionnalités

### Côté Client
- 🎫 Réservation de tickets avec QR code
- 📱 Interface responsive et moderne
- 🔐 Authentification JWT sécurisée
- 📥 Génération de PDF avec tickets
- 🔔 Notifications en temps réel
- 🎨 Animations fluides (Framer Motion)

### Côté Admin
- 👥 Gestion des utilisateurs et permissions
- 📅 Création/Modification de conférences
- 📊 Statistiques en temps réel
- 📦 Gestion des sessions et inscriptions
- 🔎 Recherche et filtres avancés
- 📤 Export de données

## 🛠 Technologies

### Backend (Django REST)
![Django](https://img.shields.io/badge/Django-092E20?logo=django&logoColor=white)
![DRF](https://img.shields.io/badge/DRF-ff1709?logo=django&logoColor=white)

### Frontend (React)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)

## 🔒 Sécurité
- Authentification JWT avec refresh tokens
- CORS strictement configuré
- Validation des données côté serveur
- Gestion des permissions RBAC


### Authentification
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/token/` | Obtenir le JWT |
| `POST` | `/api/token/refresh/` | Rafraîchir le JWT |
| `POST` | `/api/register/` | Inscription utilisateur |

### Conférences
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/conferences/` | Liste des conférences |
| `POST` | `/api/conferences/create/` | Créer une conférence |
| `PUT` | `/api/conferences/<id>/update/` | Modifier conférence |

### Sessions
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/sessions/` | Liste des sessions |
| `POST` | `/api/sessions/create/` | Créer une session |

### Inscriptions
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/register-conference/` | S'inscrire à une conférence |
| `GET` | `/api/my-tickets/` | Mes tickets (QR codes) |

### Administration
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/admin/add-participant/` | Ajouter un participant |
| `GET` | `/api/user-profile/` | Profils utilisateurs |
| `GET` | `/api/stats/` | Statistiques |

## 🚀 Installation

### Backend
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm start
```

**Conf4Tous** © 2025 - Développé avec ❤️ par Nau-stack-110

