# Sentimuse
### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/hemkan/Sentimuse.git
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Create a .env.local file in the root of your project directory and add your environment variables:**

   ```env
   # Example environment variables
    VITE_API_URL=https://api.example.com
    VITE_API_KEY=your_api_key
    # Additional keys can go here
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
