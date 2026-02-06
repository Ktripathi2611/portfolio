# Kushal Tripathi - Developer Portfolio

A cinematic, ultra-premium, animated developer portfolio built with Next.js, Three.js, and Framer Motion.

## 🚀 Features

- **5 Unique Pages** - Home, About, Projects, Experience, Contact
- **3D Particle Background** - Three.js powered interactive particles
- **Smooth Animations** - Framer Motion for page transitions and scroll effects
- **Glassmorphism Design** - Modern glass-like UI components
- **SEO Optimized** - Full metadata, JSON-LD schemas, sitemap
- **Responsive Design** - Mobile-first approach
- **Performance Optimized** - Lazy loading, dynamic imports

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, GSAP
- **3D Graphics**: Three.js, React Three Fiber
- **TypeScript**: Full type safety
- **SEO**: next-sitemap, JSON-LD

## 📁 Project Structure

```
portfolio/
├── public/
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with SEO
│   │   ├── page.tsx         # Home page
│   │   ├── globals.css      # Global styles
│   │   ├── about/
│   │   ├── projects/
│   │   ├── experience/
│   │   └── contact/
│   ├── components/
│   │   ├── layout/          # Navbar, Footer, etc.
│   │   ├── hero/            # Hero section components
│   │   └── ui/              # Reusable UI components
│   ├── lib/
│   │   ├── animations.ts    # Animation variants
│   │   └── jsonld.ts        # SEO schemas
│   └── data/
│       ├── projects.ts
│       ├── experience.ts
│       └── skills.ts
├── tailwind.config.ts
├── next-sitemap.config.js
└── package.json
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Ktripathi2611/portfolio.git

# Navigate to project
cd portfolio

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Connect your GitHub repository
4. Deploy (automatic builds on push)

### Custom Domain Setup

1. In Vercel dashboard, go to **Settings → Domains**
2. Add your domain (e.g., `kushaltripathi.dev`)
3. Update DNS records at your registrar:
   - Add `A` record: `76.76.19.61`
   - Add `CNAME` record: `cname.vercel-dns.com`

### Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property with your domain
3. Verify ownership (DNS or HTML file)
4. Submit sitemap: `https://yourdomain.com/sitemap.xml`

## ⚡ Performance

Target Lighthouse scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### Optimization Features

- Dynamic imports for Three.js
- Image optimization with `next/image`
- Font optimization with `next/font`
- Code splitting per route

## 📧 Contact

**Kushal Tripathi**
- Email: tripathikushal522@gmail.com
- Phone: +91 8097077787
- GitHub: [Ktripathi2611](https://github.com/Ktripathi2611)
- Location: Andheri, Mumbai, Maharashtra, India

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
