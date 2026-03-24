# Vehicle Management System

This repo now follows the same high-level structure as your Agrirent reference, but tailored for a vehicle platform:

- Angular frontend
- Firebase Auth on the client
- Firestore-backed app data
- Express backend scaffold for `/api` routes

## Structure

```text
src/
  app/
    components/
      footer/
      navbar/
    core/
      config/
      guards/
      models/
      resolvers/
      services/
    pages/
      about/
      auth/
        login/
        register/
      contact/
      dashboard/
      home/
      vehicles/
        add-vehicle/
        vehicle-list/

server/
  config/
  controllers/
  middleware/
  routes/
  services/
```

## Run

Frontend:

```bash
npm start
```

Backend:

```bash
npm run server
```

## Express + Firebase Admin Setup

1. Run `npm install` so direct backend dependencies are available.
2. Download a Firebase service account key from Firebase Console.
3. Save it as `server/serviceAccountKey.json`, or set `FIREBASE_SERVICE_ACCOUNT_PATH`.

The Express app is defensive by default: if `firebase-admin` or the service account is missing, the server still starts and `/api/health` explains what is not configured yet.

## Contact Email Setup

The contact form submits to `POST /api/contact` and sends email through SMTP. Set these environment variables before running the backend:

```bash
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email-user
SMTP_PASS=your-email-password
CONTACT_FROM_EMAIL=your-from-email
CONTACT_TO_EMAIL=your-destination-email
```

If these values are missing, the contact form will return a configuration error instead of silently failing.

## Notes

- Angular dev server now uses `proxy.conf.json` for `/api` requests.
- Firebase Auth and Firestore client logic stay in Angular under `src/app/core/services`.
- Express is ready for server-side routes in `server/routes`.
