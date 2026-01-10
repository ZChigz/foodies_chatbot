# Foodies Chat Widget 🍕

A beautiful, modern chat widget component for the Foodies restaurant brand.

## Installation

```bash
npm install react react-dom framer-motion lucide-react tailwindcss autoprefixer postcss
```

Or with yarn:

```bash
yarn add react react-dom framer-motion lucide-react tailwindcss autoprefixer postcss
```

## Setup Tailwind CSS

1. Initialize Tailwind (if not already done):
```bash
npx tailwindcss init -p
```

2. Add Tailwind directives to your CSS file (e.g., `index.css` or `App.css`):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Usage

```jsx
import FoodiesChatWidget from './FoodiesChatWidget';

function App() {
  return (
    <div className="App">
      {/* Your app content */}
      <FoodiesChatWidget />
    </div>
  );
}
```

## Features

✨ Beautiful amber/yellow branding theme
🎨 Glassmorphism effects and smooth shadows
🎭 Smooth animations with Framer Motion
💬 Real-time chat with typing indicators
🔄 Auto-scroll to newest messages
📱 Responsive design
🎯 API integration ready

## API Endpoint

The widget sends POST requests to: `http://localhost:5000/api/chat`

Expected request format:
```json
{
  "message": "User message here"
}
```

Expected response format:
```json
{
  "response": "Bot response here"
}
```

## Customization

You can customize colors, sizes, and animations by modifying the Tailwind classes in the component.
