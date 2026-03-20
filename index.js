import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

const distPath = path.join(__dirname, 'dist');

// Auto-build logic: Only runs if 'dist' is missing
if (!fs.existsSync(distPath)) {
  console.log('🚀 No build found. Generating production files...');
  try {
    // Just run 'npm run build' once. 
    // It's cleaner and uses your package.json definition.
    execSync('npm run build', { stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Build failed! Check your React code for errors.');
    process.exit(1);
  }
}

// Serve static files
app.use(express.static(distPath));

// SPA Routing Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server is live at http://localhost:${PORT}`);
});