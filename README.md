# EZHUDHU

A simple HTML game that helps people start typing Tamil. Play it live at [www.tamilpazhagu.com](https://www.tamilpazhagu.com).

## Project Structure

```
├── index.html          # HTML structure
├── css/styles.css      # All styles
├── js/data.js          # Word lists (WORDS, HARD_WORDS)
├── js/game.js          # Game logic (syllable splitting, daily word selection)
├── js/ui.js            # DOM manipulation, modals, keyboard, event listeners
├── js/main.js          # Entry point (initializes the game)
└── scripts.js          # Legacy monolithic script (deprecated)
```

## How to Run Locally

This is a static HTML app with no build step. Serve it with any HTTP server:

### Python (built-in)

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

### Node.js

```bash
npx -y serve .
```

### VS Code

Use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension — right-click `index.html` → "Open with Live Server".

## Deployment

The app is deployed via GitHub Pages with the custom domain configured in the `CNAME` file.
