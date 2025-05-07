# Legacy LLM Frontend

This is the frontend for the Legacy LLM Proof-of-Concept (POC), built with Next.js and TypeScript.

## 🧩 Features

- Search interface for clinical data examples
- ML prediction form (mock)
- LLM suggestion integration via backend API
- Responsive design

## 🛠 Tech Stack

- React / Next.js 15
- TypeScript
- Tailwind CSS
- Deployed on Netlify

## 🧪 Environment Variables

Add the following to your Netlify or local `.env`:

```env
NEXT_PUBLIC_BACKEND_URL=https://<your-backend-domain>
```

## 🚀 Getting Started (Locally)

```bash
git clone https://github.com/thiago-roberto/legacy-llm-frontend.git
cd legacy-llm-frontend
npm install
npm run dev
```

Visit `http://localhost:3000`.

## 📦 Deployment

This app is configured for **Netlify** static deployment. The build command is:

```bash
npm run build
```

Output will be exported to the `out/` directory.

## 🤝 Contributions

This project is for demo purposes. Contributions are not expected at this time.