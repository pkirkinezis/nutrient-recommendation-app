# 🌿 NutriCompass - Smart Supplement & Nutrition Guide

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind">
</p>

NutriCompass is a comprehensive, evidence-based nutrition and supplement recommendation application. It helps users understand what nutrients, vitamins, minerals, herbs, and Ayurvedic plants might support their health goals — and how to use them responsibly.

**⚠️ Disclaimer:** This app does not diagnose or treat disease. It exists to educate and guide smarter supplement choices using scientific evidence and traditional knowledge — without replacing a doctor.

---

## 📋 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Prerequisites](#-prerequisites)
- [Quick Start (Local Development)](#-quick-start-local-development)
- [Project Structure](#-project-structure)
- [Building for Production](#-building-for-production)
- [Deployment Options](#-deployment-options)
  - [Static File Server (Nginx)](#option-1-static-file-server-nginx)
  - [Apache Server](#option-2-apache-server)
  - [Node.js Express Server](#option-3-nodejs-express-server)
  - [Docker](#option-4-docker)
  - [Vercel (Recommended for Easy Deployment)](#option-5-vercel-recommended)
  - [Netlify](#option-6-netlify)
  - [GitHub Pages](#option-7-github-pages)
  - [AWS S3 + CloudFront](#option-8-aws-s3--cloudfront)
  - [DigitalOcean App Platform](#option-9-digitalocean-app-platform)
- [Environment Variables](#-environment-variables)
- [Customization](#-customization)
- [API Integration (Future)](#-api-integration-future)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Intelligent Goal Analysis
- Describe your health goals in natural language
- App interprets and identifies relevant body systems
- Smart matching to appropriate supplements

### 📚 Comprehensive Database (60+ Supplements)
- **Vitamins**: A, B-Complex, C, D3, E, K2
- **Minerals**: Magnesium, Zinc, Iron, Selenium, Calcium
- **Ayurvedic Herbs**: Ashwagandha, Brahmi, Tulsi, Shatavari, Triphala, Guduchi, Shilajit
- **Western Herbs**: Rhodiola, Valerian, St. John's Wort, Milk Thistle
- **Medicinal Mushrooms**: Lion's Mane, Reishi, Cordyceps
- **Amino Acids**: L-Theanine, Glycine, NAC, Creatine, L-Citrulline
- **Performance**: Beta-Alanine, HMB, Beetroot Extract, BCAAs

### 🔬 Evidence-Based Transparency
- **Strong Evidence**: Multiple human clinical trials
- **Moderate Evidence**: Some clinical research
- **Limited/Traditional**: Primarily traditional use

### 💊 Form Intelligence
- Compare forms (e.g., Magnesium Glycinate vs Citrate vs Oxide)
- Bioavailability ratings
- Absorption enhancers and blockers
- Best timing recommendations

### 🔍 Advanced Browse Engine
- Smart search across all fields
- Quick filter presets (Beginner Essentials, Sleep Stack, Nootropics, etc.)
- Multi-dimensional filtering (type, evidence, goals, body systems)
- Three view modes (List, Grid, Compact)
- Personalized recommendations based on profile

### 🧭 Nutrient Targets & Priority Flags
- Personalized nutrient targets built from NIH Dietary Reference Intakes
- Priority indicators based on diet, age, and lifestyle
- Food-first guidance with supplement tie-ins

### 🥗 Food Source Intelligence
- Food-source tables with % NRV for vitamins and minerals (EU reference values)
- CIQUAL + EuroFIR food composition sources
- Research-based reference doses for non‑NRV compounds (e.g., melatonin, creatine, CoQ10)

### 🧪 Stack Builder
- Build custom supplement stacks
- Automatic interaction/conflict detection
- Timing optimization
- Morning/Afternoon/Evening organization
- Curated stacks for common goals with synergy notes

### 📈 Progress & Lab Tracking
- Daily check-ins for sleep, energy, mood, focus, and recovery
- Log supplements taken with notes and side-effect tracking
- Lab result tracking with smart insights for common markers
- Rolling summaries for adherence and average scores

### 👤 Personalization
- Optional user profile (age, diet, training style, health conditions)
- Tailored recommendations
- Lifestyle-aware suggestions

### 📖 Learn Section
- "Why This, Not That?" comparisons
- Misinformation alerts
- Form guidance
- Safety education

### 🛡️ Safety First
- Drug interaction warnings
- Pregnancy/breastfeeding cautions
- Condition-specific warnings
- Cycling recommendations

---

## 📸 Screenshots

*The application features a clean, modern interface with:*
- Natural language goal input
- Evidence-graded supplement cards
- Interactive stack builder
- Advanced filtering system

---

## 📋 Prerequisites

Before running NutriCompass, ensure you have the following installed:

### Required
- **Node.js** (v18.0.0 or higher)
  ```bash
  # Check version
  node --version
  
  # Install via nvm (recommended)
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  nvm install 18
  nvm use 18
  ```

- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
  ```bash
  # Check npm version
  npm --version
  
  # Or install yarn
  npm install -g yarn
  ```

### Optional (for deployment)
- **Docker** (for containerized deployment)
- **Nginx** or **Apache** (for static file serving)
- **Git** (for version control)

---

## 🚀 Quick Start (Local Development)

### 1. Clone or Download the Project

```bash
# If using git
git clone https://github.com/yourusername/nutricompass.git
cd nutricompass

# Or download and extract the ZIP file
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### 3. Start Development Server

```bash
# Using npm
npm run dev

# Or using yarn
yarn dev
```

### 4. Open in Browser

The app will be available at:
```
http://localhost:5173
```

The development server features:
- ⚡ Hot Module Replacement (HMR)
- 🔄 Auto-refresh on file changes
- 📝 TypeScript error reporting
- 🎨 Tailwind CSS JIT compilation

### 5. Run Linting & Type Checking (Optional)

```bash
# Run ESLint to check for code quality issues
npm run lint

# Run ESLint and auto-fix issues
npm run lint:fix

# TypeScript type checking
npm run typecheck
```

---

## 📁 Project Structure

```
nutricompass/
├── public/                       # Static assets
├── src/
│   ├── components/
│   │   ├── AdvancedBrowse.tsx    # Advanced browse engine
│   │   └── EducationalGuide.tsx  # Educational content
│   ├── constants/
│   │   └── taxonomy.ts           # Centralized goal/system taxonomy
│   ├── data/
│   │   ├── curatedStacks.ts       # Curated goal-based stacks
│   │   ├── nutrientRequirements.ts # Nutrient target guidance
│   │   ├── nutrientFoodSources.ts # Nutrient → food source helpers
│   │   └── supplements.ts        # Supplement database + nutrient food data
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── utils/
│   │   ├── analyzer.ts           # NLP goal analysis with negation handling
│   │   ├── normalization.ts      # Text normalization helpers
│   │   └── cn.ts                 # Class name helper
│   ├── App.tsx                   # Main application
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles + Tailwind
├── index.html                    # HTML template
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript config
├── vite.config.ts                # Vite config
├── server.js                     # Express server for production
├── Dockerfile                    # Docker configuration
├── docker-compose.yml            # Docker Compose configuration
├── nginx.conf                    # Nginx configuration
├── vercel.json                   # Vercel deployment config
├── netlify.toml                  # Netlify deployment config
└── README.md                     # This file
```

---

## 🏗️ Building for Production

### Build the Application

```bash
# Using npm
npm run build

# Or using yarn
yarn build
```

This creates an optimized production build in the `dist/` folder:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      # Bundled JavaScript
│   └── index-[hash].css     # Bundled CSS
└── ...
```

### Preview Production Build Locally

```bash
# Using npm
npm run preview

# Or using yarn
yarn preview
```

This starts a local server at `http://localhost:4173` serving the production build.

---

## 🌐 Deployment Options

### Option 1: Static File Server (Nginx)

Nginx is excellent for serving static files with high performance.

#### Install Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx

# macOS
brew install nginx
```

#### Configure Nginx

Create a configuration file `/etc/nginx/sites-available/nutricompass`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Root directory (adjust path as needed)
    root /var/www/nutricompass/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA fallback - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### Deploy

```bash
# Build the project
npm run build

# Copy dist to server
sudo mkdir -p /var/www/nutricompass
sudo cp -r dist/* /var/www/nutricompass/

# Enable site
sudo ln -s /etc/nginx/sites-available/nutricompass /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### Enable HTTPS with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is configured automatically
```

---

### Option 2: Apache Server

#### Install Apache

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install apache2

# Enable required modules
sudo a2enmod rewrite
sudo a2enmod headers
```

#### Configure Apache

Create `/etc/apache2/sites-available/nutricompass.conf`:

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    DocumentRoot /var/www/nutricompass/dist
    
    <Directory /var/www/nutricompass/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # SPA fallback
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
    </IfModule>
    
    # Caching
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType text/css "access plus 1 year"
        ExpiresByType application/javascript "access plus 1 year"
        ExpiresByType image/png "access plus 1 year"
        ExpiresByType image/jpeg "access plus 1 year"
        ExpiresByType image/svg+xml "access plus 1 year"
    </IfModule>
    
    # Security headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
</VirtualHost>
```

#### Deploy

```bash
# Build and copy
npm run build
sudo mkdir -p /var/www/nutricompass
sudo cp -r dist/* /var/www/nutricompass/

# Enable site
sudo a2ensite nutricompass.conf
sudo systemctl restart apache2
```

---

### Option 3: Node.js Express Server

For environments where you want a Node.js server.

#### Create Server File

Create `server.js` in the project root:

```javascript
const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable gzip compression
app.use(compression());

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',
  etag: false
}));

// SPA fallback - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌿 NutriCompass running at http://localhost:${PORT}`);
});
```

#### Install Dependencies and Run

```bash
# Install production dependencies
npm install express compression

# Build the app
npm run build

# Start the server
node server.js

# Or use PM2 for production
npm install -g pm2
pm2 start server.js --name nutricompass
pm2 save
pm2 startup
```

---

### Option 4: Docker

#### Create Dockerfile

Create `Dockerfile` in the project root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### Create nginx.conf

Create `nginx.conf` in the project root:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Create docker-compose.yml (Optional)

```yaml
version: '3.8'

services:
  nutricompass:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
```

#### Build and Run

```bash
# Build Docker image
docker build -t nutricompass .

# Run container
docker run -d -p 80:80 --name nutricompass nutricompass

# Or use docker-compose
docker-compose up -d

# View logs
docker logs -f nutricompass

# Stop container
docker stop nutricompass
```

---

### Option 5: Vercel (Recommended)

Vercel offers the easiest deployment with automatic CI/CD.

#### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# Deploy to production
vercel --prod
```

#### Method 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Vite and configures everything
6. Click "Deploy"

#### vercel.json (Optional)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### Option 6: Netlify

#### Method 1: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build the project
npm run build

# Deploy draft
netlify deploy --dir=dist

# Deploy to production
netlify deploy --dir=dist --prod
```

#### Method 2: GitHub Integration

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Set build command: `npm run build`
6. Set publish directory: `dist`
7. Click "Deploy site"

#### netlify.toml

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

### Option 7: GitHub Pages

#### Configure Vite for Subdirectory

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/nutricompass/', // Your repo name
})
```

#### Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### Enable GitHub Pages

1. Go to your repository Settings
2. Navigate to Pages
3. Source: "GitHub Actions"
4. Push to main branch to trigger deployment

---

### Option 8: AWS S3 + CloudFront

#### Create S3 Bucket

```bash
# Create bucket
aws s3 mb s3://nutricompass-app --region us-east-1

# Enable static website hosting
aws s3 website s3://nutricompass-app --index-document index.html --error-document index.html

# Build and sync
npm run build
aws s3 sync dist/ s3://nutricompass-app --delete
```

#### Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::nutricompass-app/*"
    }
  ]
}
```

#### CloudFront Distribution

1. Create CloudFront distribution
2. Origin: S3 bucket website endpoint
3. Create custom error response: 404 → /index.html (200)
4. Enable HTTPS with AWS Certificate Manager

---

### Option 9: DigitalOcean App Platform

1. Push code to GitHub
2. Go to DigitalOcean App Platform
3. Create new app from GitHub
4. Select your repository
5. Configure:
   - Type: Static Site
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Deploy"

---

## 🔧 Environment Variables

Currently, NutriCompass doesn't require environment variables. However, for future API integration:

### Create `.env` file

```env
# API Configuration (future use)
VITE_API_URL=https://api.nutricompass.com
VITE_API_KEY=your-api-key

# Feature Flags
VITE_ENABLE_TRACKING=false
VITE_ENABLE_ANALYTICS=false
```

### Access in Code

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Production Environment

For production deployments, set these in your hosting platform's environment settings.

---

## 🎨 Customization

### Adding New Supplements

Edit `src/data/supplements.ts`:

```typescript
export const supplements: Supplement[] = [
  // ... existing supplements
  {
    id: 'new-supplement',
    name: 'New Supplement Name',
    type: 'herb', // vitamin, mineral, herb, amino-acid, etc.
    category: 'Adaptogen',
    description: 'Description here...',
    benefits: ['Benefit 1', 'Benefit 2'],
    dosage: '500mg daily',
    timing: 'Morning with food',
    evidence: 'moderate',
    goals: ['energy', 'stress'],
    bodySystems: ['nervous', 'endocrine'],
    // ... other fields
  }
];
```

### Updating Nutrient Food Data

Food-source data lives in `src/data/supplements.ts`:
- `nutrientFoodMapping` stores NRV/AI reference values and sources
- `nutrientFoodSources` lists foods, amounts, and % NRV/Reference

If you add a new nutrient with food data, also ensure the supplement ID maps to the nutrient ID in `src/data/nutrientFoodSources.ts`.

### Modifying Goal Analysis

Edit `src/utils/goalAnalyzer.ts` to add new goal keywords and body system mappings.

### Styling Changes

- Global styles: `src/index.css`
- Tailwind config: `tailwind.config.js`
- Component-specific: Inline Tailwind classes

---

## 🔌 API Integration (Future)

The app is designed to support future API integration:

```typescript
// Example API service
const SupplementAPI = {
  async getRecommendations(goals: string[], profile: UserProfile) {
    const response = await fetch(`${API_URL}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({ goals, profile })
    });
    return response.json();
  },
  
  async trackProgress(supplementId: string, metrics: TrackingData) {
    // Track user progress with a supplement
  }
};
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run linting: `npm run lint`
5. Run type checking: `npm run typecheck`
6. Build to verify: `npm run build`
7. Commit: `git commit -m 'Add amazing feature'`
8. Push: `git push origin feature/amazing-feature`
9. Open a Pull Request

### Guidelines

- Follow existing code style
- Add TypeScript types for new data
- Ensure evidence ratings are accurate
- Include safety information for supplements
- Test on multiple browsers

### Areas for Contribution

- [ ] Add more supplements to database
- [ ] Improve goal analysis NLP
- [ ] Add more form guidance data
- [ ] Translations/internationalization
- [ ] Accessibility improvements
- [ ] Mobile app version
- [ ] Backend API development
- [ ] User tracking system

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Nutritional data compiled from peer-reviewed research
- Food composition references: CIQUAL and EuroFIR (for vitamins/minerals)
- Ayurvedic knowledge from traditional texts and modern research
- Built with React, Vite, TypeScript, and Tailwind CSS

---

## ⚠️ Important Disclaimer

**NutriCompass is for educational purposes only.**

- This app does not provide medical advice
- Always consult a healthcare professional before starting supplements
- Individual results may vary
- Not intended to diagnose, treat, cure, or prevent any disease
- Check for drug interactions with your doctor or pharmacist

---

<p align="center">
  Made with 💚 for better health education
</p>
