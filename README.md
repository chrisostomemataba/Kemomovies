# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
```
## 🚧 Development Status

### 📊 Dashboard & User Features
- **Dashboard:** Currently using sample data for visualization
  - 📈 Watch time trends
  - 📊 Genre distribution
  - 🎬 Trending movies
  - 📈 User statistics

- **User Profile:** Operating with mock data
  - 👤 User information
  - 📈 Watch history
  - ❤️ Favorites
  - 🎯 Preferences

- **Settings:** Implemented with static content
  - 🎨 Theme preferences
  - 🔔 Notification settings
  - 🌍 Language options
  - 🎭 Genre preferences

### 🔐 Authentication & Session Management

> 🔑 **Login Instructions:** Use the Google Sign-In button to access the platform. All features are currently using sample data for demonstration purposes.

#### Current Implementation:
- ✅ Google Authentication sign-in/sign-up


#### Planned Features (Pending Database Connection):
- 🔄 Persistent sessions
- 🔑 Secure token management
- 💾 User data storage
- 🔒 Protected routes
- 🔄 Real-time data synchronization

### 🗃️ Data Management
### 🔐 Authentication
```mermaid
graph LR
    A[Login] -->|Google Auth| B[Platform Access]
    C[Sign Up] -->|Google Auth| B
```

### 🎯 Current Stack
- ⚛️ React with TypeScript
- 🎨 TailwindCSS
- 📊 Recharts for data visualization
- 🔐 Google Authentication
- 💫 Lucide Icons



---
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
```
PS: USE PNPM RUN SERVE  to run the project i did not use npm
