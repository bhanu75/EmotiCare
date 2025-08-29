# Morning Emotional Care - React App

A modular React application for building personalized morning emotional wellness routines.

## 📁 Project Structure

```
morning-emotional-care/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header/
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Header.test.js
│   │   │   └── index.js
│   │   ├── practices/
│   │   │   ├── PracticeCard/
│   │   │   │   ├── PracticeCard.jsx
│   │   │   │   ├── PracticeCard.test.js
│   │   │   │   └── PracticeCard.module.css
│   │   │   ├── PracticeSelection/
│   │   │   │   ├── PracticeSelection.jsx
│   │   │   │   └── PracticeSelection.test.js
│   │   │   └── index.js
│   │   ├── routines/
│   │   │   ├── SampleRoutines/
│   │   │   │   ├── SampleRoutines.jsx
│   │   │   │   └── SampleRoutines.test.js
│   │   │   ├── RoutineBuilder/
│   │   │   │   ├── BuildButton.jsx
│   │   │   │   ├── RoutineItem.jsx
│   │   │   │   ├── CurrentRoutineDisplay.jsx
│   │   │   │   └── index.js
│   │   │   └── index.js
│   │   ├── ui/
│   │   │   ├── Instructions/
│   │   │   │   ├── Instructions.jsx
│   │   │   │   └── Instructions.test.js
│   │   │   ├── ExampleRoutines/
│   │   │   │   ├── ExampleRoutines.jsx
│   │   │   │   └── ExampleRoutines.test.js
│   │   │   ├── ProTips/
│   │   │   │   ├── ProTips.jsx
│   │   │   │   └── ProTips.test.js
│   │   │   └── index.js
│   │   └── index.js
│   ├── hooks/
│   │   ├── useRoutineBuilder.js
│   │   ├── useLocalStorage.js
│   │   ├── useTracking.js
│   │   └── index.js
│   ├── data/
│   │   ├── practices.js
│   │   ├── sampleRoutines.js
│   │   ├── constants.js
│   │   └── index.js
│   ├── utils/
│   │   ├── timeUtils.js
│   │   ├── routineUtils.js
│   │   ├── storageUtils.js
│   │   └── index.js
│   ├── styles/
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── utilities.css
│   ├── types/
│   │   ├── practice.js
│   │   ├── routine.js
│   │   └── index.js
│   ├── __tests__/
│   │   ├── setup.js
│   │   ├── utils/
│   │   └── integration/
│   ├── App.jsx
│   ├── App.test.js
│   ├── index.js
│   └── index.css
├── .env.example
├── .env.local
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── docs/
    ├── ARCHITECTURE.md
    ├── DEPLOYMENT.md
    ├── API.md
    └── CHANGELOG.md
```

## 📦 Dependencies

### Core Dependencies (`package.json`)

```json
{
  "name": "morning-emotional-care",
  "version": "1.0.0",
  "private": true,
  "description": "A React app for building personalized morning emotional wellness routines",
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/morning-emotional-care.git"
  },
  "keywords": [
    "react",
    "wellness",
    "morning-routine",
    "emotional-care",
    "mindfulness"
  ],
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1",
    "prop-types": "^15.8.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.4.3",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.45.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "postcss": "^8.4.27",
    "prettier": "^2.8.8",
    "tailwindcss": "^3.3.3",
    "vite": "^4.4.5",
    "vitest": "^0.34.1"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "format": "prettier --write \"src/**/*.{js,jsx,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,css,md}\"",
    "prepare": "husky install"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

### Additional Dev Dependencies for Enhanced Development

```json
{
  "devDependencies": {
    "husky": "^8.0.3",
    "lint-staged": "^13.2.3",
    "@commitlint/cli": "^17.6.7",
    "@commitlint/config-conventional": "^17.6.7",
    "storybook": "^7.1.1",
    "@storybook/addon-essentials": "^7.1.1",
    "@storybook/addon-interactions": "^7.1.1",
    "@storybook/addon-links": "^7.1.1",
    "@storybook/blocks": "^7.1.1",
    "@storybook/react": "^7.1.1",
    "@storybook/react-vite": "^7.1.1",
    "@storybook/testing-library": "^0.2.0"
  }
}
```

## 🔧 Configuration Files

### `.gitignore`
```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Production
/build
/dist

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Build tools
.cache/
```

### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
        wellness: {
          pink: '#fce7f3',
          yellow: '#fef3c7',
          orange: '#fed7aa',
          blue: '#dbeafe',
          green: '#d1fae5',
          purple: '#e9d5ff',
          indigo: '#e0e7ff',
          amber: '#fef3c7',
          teal: '#ccfbf1',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [],
}
```

### `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@data': path.resolve(__dirname, './src/data'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.js'],
  },
})
```

### `.eslintrc.js`
```javascript
module.exports = {
  env: {
    browser: true,
    es2020: true,
    jest: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@eslint/js/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: '18.2',
    },
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'warn',
    'react/jsx-key': 'error',
    'no-unused-vars': 'warn',
    'no-console': 'warn',
  },
}
```

### `.prettierrc`
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### `husky` and `lint-staged` setup

#### `.husky/pre-commit`
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

#### `package.json` lint-staged configuration
```json
{
  "lint-staged": {
    "*.{js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,md}": [
      "prettier --write"
    ]
  }
}
```

### `commitlint.config.js`
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'perf',
        'ci',
        'build',
        'revert'
      ]
    ]
  }
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/morning-emotional-care.git

# Navigate to project directory
cd morning-emotional-care

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 📚 Documentation Structure

### `docs/ARCHITECTURE.md`
- Component architecture explanation
- State management patterns
- Folder structure rationale
- Design decisions

### `docs/DEPLOYMENT.md`
- Build and deployment instructions
- Environment variables
- CI/CD pipeline setup

### `docs/API.md`
- Component APIs
- Hook usage
- Utility functions

### `CONTRIBUTING.md`
- Contribution guidelines
- Code style requirements
- Pull request process

## 🧪 Testing Strategy

- **Unit Tests**: Component and utility function tests
- **Integration Tests**: User interaction flows
- **E2E Tests**: Complete user journeys
- **Visual Tests**: Component appearance and responsive design

## 📝 Development Guidelines

### Commit Message Format
```
type(scope): description

feat(practices): add new meditation practice type
fix(routing): resolve navigation bug
docs(readme): update installation instructions
```

### Component Structure
```javascript
// ComponentName/
├── ComponentName.jsx          // Main component
├── ComponentName.test.js      // Unit tests
├── ComponentName.stories.js   // Storybook stories (optional)
└── index.js                   // Export file
```

### File Naming Conventions
- Components: PascalCase (`PracticeCard.jsx`)
- Hooks: camelCase with 'use' prefix (`useRoutineBuilder.js`)
- Utils: camelCase (`timeUtils.js`)
- Constants: UPPER_SNAKE_CASE (`MAX_ROUTINE_TIME`)

This modular structure provides:
- **Scalability**: Easy to add new features
- **Maintainability**: Clear separation of concerns
- **Testability**: Each module can be tested independently
- **Reusability**: Components and hooks can be reused
- **Developer Experience**: Clear structure and tooling setup
