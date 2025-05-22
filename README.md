# Pixel XP Habit Battle

Pixel XP Habit Battle is a Progressive Web App (PWA) with a retro pixel-art UI where users set daily quests and compete in real-time against an AI Rival. The Rival gains XP when quests remain incomplete, creating a dynamic challenge to stay on top of your habits.

Built with Next.js (React) for the frontend and designed for use with Firestore for data storage, Firebase Authentication for user accounts, and Firebase Hosting for deployment.

## Features

- **Retro Pixel UI**: Engaging pixel-art interface with side-by-side XP bars for User vs. Rival.
- **Daily Quest System**: Users can create and manage daily tasks with custom XP values.
- **Real-Time XP Updates**: Instantly see your XP grow as you complete quests.
- **Adaptive AI Rival**: The AI Rival's XP dynamically adjusts based on your incomplete quests, powered by a Genkit AI flow.
- **PWA Ready**: Installable on your device for an app-like experience.

## Tech Stack

- **Frontend**: Next.js (React)
- **Styling**: Tailwind CSS with ShadCN UI components
- **AI Logic**: Genkit (via Google AI)
- **Backend (intended)**: Firebase (Firestore, Authentication, Hosting)

## Getting Started

### Prerequisites

- Node.js (v18.x or later recommended)
- npm or yarn
- Firebase CLI (for deployment)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd pixel-xp-habit-battle
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Environment Variables:**
    If the project uses environment variables (e.g., for Firebase configuration or AI keys), create a `.env.local` file in the root directory and add them:
    ```env
    # Example for Firebase (if integrating client-side SDK)
    # NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    # NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    # ... other Firebase config variables

    # Example for Genkit/Google AI (if running locally)
    # GOOGLE_API_KEY=your_google_api_key
    ```
    *Note: The current version uses a mock AI flow and in-memory data, so extensive Firebase/AI key setup might not be immediately necessary for frontend development but will be for full functionality.*

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:9002](http://localhost:9002) (or the port specified in your `package.json`) in your browser.

### Building for Production

To create a production build:
```bash
npm run build
```
This will generate an optimized version of your application, typically in the `.next` directory.

## Deployment

This project is configured for deployment using Firebase Hosting.

1.  **Set up Firebase Project:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project or use an existing one.
    *   Add a Web app to your Firebase project to get your Firebase configuration (apiKey, authDomain, etc.) if you plan to integrate Firebase services like Auth or Firestore on the client-side.
    *   Enable Firebase Hosting for your project.

2.  **Login to Firebase CLI:**
    ```bash
    firebase login
    ```

3.  **Initialize Firebase in your project (if not already done):**
    ```bash
    firebase init hosting
    ```
    *   Select your Firebase project.
    *   When asked for your public directory, if you are using `next export` (static HTML export), specify `out`. If you are deploying a standard Next.js app that requires a server, you'll typically deploy to Cloud Functions for Firebase or Cloud Run, and `firebase.json` hosting config would point to that function/service. The provided `firebase.json` assumes `public` as the public directory and an `index.html` SPA structure, which aligns more with a static export or specific PWA serving needs. **Ensure your build output matches this configuration.** For a standard Next.js build, the `public` directory in `firebase.json` refers to the Next.js `public` folder (for assets like `manifest.webmanifest`, `service-worker.js`), and server-side rendering/routing is usually handled by a Firebase Function. The `rewrites` to `index.html` might need adjustment based on your specific Next.js deployment strategy (static export vs. SSR).

4.  **Deploy to Firebase Hosting:**
    After building your project (`npm run build`):
    ```bash
    firebase deploy --only hosting
    ```

    This command will deploy the content of your specified public directory (and respect other `firebase.json` configurations) to Firebase Hosting.

## AI Rival Logic

The AI Rival's XP gain is calculated using a Genkit flow (`src/ai/flows/rival-xp-calculator.ts`). This flow determines the Rival's XP based on the user's incomplete quests, considering their XP value and the proportion of time elapsed for each quest.

To run Genkit flows locally for development or testing (if applicable):
```bash
npm run genkit:dev
# or
npm run genkit:watch
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please make sure to update tests as appropriate.
```
