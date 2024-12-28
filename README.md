# TeamSync - ENG

**TeamSync** is a web application designed for task management and collaboration, helping teams efficiently organize their work and track hours worked. The app allows users to create teams, assign tasks to team members, and track the time spent on each task, promoting better time management and productivity.

### Features 

- **Team Creation**: Users can create teams and invite other members for collaboration.
- **Task Management**: Team members can create tasks, assign them to individuals or groups, and track their status.
- **Time Tracking**: Users can log hours worked on each task, providing real-time insight into productivity.
- **Task Status Updates**: Tasks can be updated with statuses like pending, in progress, or completed.
- **User Dashboard**: Each user can view their tasks, logged hours, and progress on a centralized dashboard.

### Technologies Used

#### Frontend:

- [**Vue.js**](https://vuejs.org/): Used for building the user interface and managing application logic.
- [**Tailwind CSS**](https://tailwindcss.com/): Provides utility-first CSS for designing responsive and modern layouts.
- [**shadcn**](https://www.shadcn-vue.com/): Enhances UI components with customizable and reusable elements.

#### Backend:

- [**Firebase**](https://firebase.google.com/): Manages backend functionalities like database, authentication, and file storage.
- [**EmailJS**](https://www.emailjs.com/): Used for sending email invitations to team members.

### Usage

You can use **TeamSync** either on the web at [TeamSync App](https://teamsync-app.vercel.app) or as an open-source project by downloading and customizing it to your needs.

### Environment Variables

To run the app, make sure to add the following environment variables in a `.env` file:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID

VITE_EMAILJS_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID
VITE_EMAILJS_PUBLIC_KEY
```

### Requirements

Before you start, make sure you have the following tools installed:

- [Node.js](https://nodejs.org/en)

### Installation and Project Setup

```bash
git clone https://github.com/robertvizvari/TeamSync.git
npm i && npm run dev
```

# TeamSync - SK

**TeamSync** je webová aplikácia určená na spoluprácu pri riadení úloh, ktorá pomáha tímom efektívne organizovať prácu a sledovať odpracované hodiny. Aplikácia umožňuje používateľom vytvárať tímy, priraďovať úlohy členom tímu a sledovať čas strávený na jednotlivých úlohách, čo podporuje lepšie riadenie času a produktivity.

## Funkcie

- **Vytváranie tímov**: Používatelia môžu vytvoriť tím a pozvať ostatných členov na spoluprácu.
- **Správa úloh**: Členovia tímu môžu vytvárať úlohy, priraďovať ich jednotlivcom alebo skupinám a sledovať ich stav.
- **Sledovanie času**: Používatelia môžu zaznamenávať odpracované hodiny na každej úlohe, čo poskytuje prehľad o produktivite v reálnom čase.
- **Aktualizácia stavu úloh**: Úlohy je možné aktualizovať stavmi ako čakajúca, prebiehajúca alebo dokončená.
- **Používateľská nástenka**: Každý používateľ môže vidieť svoje úlohy, odpracované hodiny a pokrok na jednej centralizovanej nástenke.

## Použité technológie

### Frontend:

- [**Vue.js**](https://vuejs.org/): Používa sa na vytváranie používateľského rozhrania a správu logiky aplikácie.
- [**Tailwind CSS**](https://tailwindcss.com/): Poskytuje utility-first CSS na navrhovanie responzívnych a moderných rozložení.
- [**shadcn**](https://www.shadcn-vue.com/): Zlepšuje UI komponenty pomocou prispôsobiteľných a znovu použiteľných prvkov.

### Backend:

- [**Firebase**](https://firebase.google.com/): Spravuje backendové funkcionality ako databázu, autentifikáciu a ukladanie súborov.
- [**EmailJS**](https://www.emailjs.com/): Používa sa na odosielanie emailových pozvánok členom tímu.

## Používanie

Aplikáciu **TeamSync** môžete používať buď na webe na [TeamSync App](https://teamsync-app.vercel.app), alebo ako open-source projekt, ktorý si môžete stiahnuť a prispôsobiť podľa svojich potrieb.

## Parametre prostredia

Aby aplikácia fungovala, pridajte nasledujúce premenné prostredia do `.env` súboru:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID

VITE_EMAILJS_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID
VITE_EMAILJS_PUBLIC_KEY
```

## Požiadavky

Predtým ako začnete, uistite sa, že máte nainštalované nasledujúce nástroje:

- [Node.js ](https://nodejs.org/en)

## Inštalácia a spustenie projektu

```bash
git clone https://github.com/robertvizvari/TeamSync.git
npm i && npm run dev
