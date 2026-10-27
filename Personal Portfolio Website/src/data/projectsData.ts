export interface CaseStudy {
  slug: string;
  num: string;
  title: string;
  subtitle: string;
  category: "Web Platforms" | "E-Commerce & RTL" | "3D & Interactive" | "Creative Tech & Tools";
  role: string;
  year: string;
  status: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  coverImage: string;
  galleryImages: string[];
  techStack: string[];
  overview: string;
  challenge: string;
  solution: string;
  keyDecisions: {
    title: string;
    description: string;
  }[];
  verifiableMetrics: string[];
  nextSlug: string;
  prevSlug: string;
}

export const PROJECTS: CaseStudy[] = [
  {
    slug: "codesystem",
    num: "01",
    title: "Code Systems SW",
    subtitle: "Enterprise Programming Academy Platform (Ages 5–17)",
    category: "Web Platforms",
    role: "Lead Frontend Architect & Motion Designer",
    year: "2026",
    status: "Live Production Platform",
    liveUrl: "https://codesystemssw.com",
    featured: true,
    coverImage: "/projects/codesystem_live.png",
    galleryImages: [
      "/projects/codesystem_courses.png",
      "/projects/codesystem_curriculum.png",
    ],
    techStack: [
      "Next.js App Router",
      "TypeScript",
      "Tailwind CSS",
      "GSAP ScrollTrigger",
      "WhatsApp Direct API",
    ],
    overview:
      "Code Systems is a high-impact digital educational platform in Alexandria, Egypt (Sidi Besher), providing hands-on programming courses for kids and teenagers aged 5 to 17 across Scratch Jr, Scratch, and Python. The web platform was designed and built from scratch to turn technical education into an engaging, tactile experience for parents and prospective students.",
    challenge:
      "Educational academy websites in the region often suffer from visual noise, cluttered tables, and slow mobile load times. The challenge was to communicate a progressive multi-tier curriculum (ages 5–17) with clarity, instant booking conversions, zero-jank interactive vector physics, and seamless performance across mobile devices.",
    solution:
      "Architected a Next.js App Router solution with modular interactive course drawers, direct instant WhatsApp booking intake, and micro-animated UI states. Replaced heavy external libraries with bespoke CSS and lightweight GSAP timelines to maintain instant page responses and 99+ Lighthouse performance.",
    keyDecisions: [
      {
        title: "Tiered Age-Bracket Navigation",
        description:
          "Engineered interactive category selectors for Scratch Jr (5–7), Scratch (8–11), and Python (12–17) with instant content swaps without page reloads.",
      },
      {
        title: "Microsecond WhatsApp Direct Intake",
        description:
          "Integrated pre-filled structured WhatsApp message payloads matching the parent's chosen curriculum track directly from the booking checklist.",
      },
      {
        title: "Asset Optimization & Fluid Geometry",
        description:
          "Implemented Next.js modern image compression and responsive typography grids to keep layout shifts (CLS) strictly at 0.00.",
      },
    ],
    verifiableMetrics: [
      "100% Custom Frontend Architecture",
      "Live Production Platform in Alexandria, EG",
      "Sub-second Navigation & Zero Layout Shift",
    ],
    nextSlug: "retone",
    prevSlug: "appexy",
  },
  {
    slug: "retone",
    num: "02",
    title: "Retone",
    subtitle: "Live Material You Dynamic Theming Engine",
    category: "Creative Tech & Tools",
    role: "Frontend & Color Science Developer",
    year: "2026",
    status: "Live Web Engine",
    liveUrl: "https://retone-two.vercel.app/",
    githubUrl: "https://github.com/Lander2007",
    featured: true,
    coverImage: "/projects/Retone.png",
    galleryImages: ["/projects/Retone.png"],
    techStack: [
      "JavaScript",
      "Material Color Utilities",
      "HCT Color Engine",
      "Material 3 Expressive",
      "CSS3",
    ],
    overview:
      "Retone is an interactive demonstration of Material You's dynamic color system, rebuilt for the modern web. Pick a seed color, drop a photo, or sample your screen—the HCT (Hue-Chroma-Tone) engine generates a full tonal palette and retones every surface, button, and shape on the page live in real time.",
    challenge:
      "Replicating Google's HCT color algorithm in a real-time browser environment without causing lag or perceptible delay during live color wheel scrubbing.",
    solution:
      "Integrated Material Color Utilities with pure CSS custom properties and hardware-accelerated transforms. Built with Material 3 Expressive's shape-morphing motion and responsive typography tokens.",
    keyDecisions: [
      {
        title: "Real-Time HCT Algorithmic Quantization",
        description:
          "Processed image pixel data using fast octree quantization to extract dominant chromatic seeds and generate 13 dynamic tonal roles.",
      },
      {
        title: "CSS Custom Property Mapping",
        description:
          "Mapped computed HCT tonal swatches directly to CSS variables, triggering instantaneous, reflow-free UI theme transitions.",
      },
    ],
    verifiableMetrics: [
      "Sub-16ms Real-Time Theming Loop",
      "Accurate Google HCT Color Science",
      "Zero External CSS Framework Dependencies",
    ],
    nextSlug: "el3almia-leather",
    prevSlug: "codesystem",
  },
  {
    slug: "el3almia-leather",
    num: "03",
    title: "El Almia Leather (العالمية)",
    subtitle: "Production Bilingual Luxury Storefront & RTL Engine",
    category: "E-Commerce & RTL",
    role: "Frontend Engineer & RTL Architect",
    year: "2026",
    status: "Production E-Commerce",
    liveUrl: "https://el3almialeather.com/ar",
    featured: true,
    coverImage: "/projects/el3almialeather.png",
    galleryImages: ["/projects/el3almialeather.png"],
    techStack: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "RTL Architecture",
      "REST API",
    ],
    overview:
      "El Almia Leather is a bespoke Egyptian luxury handcrafted genuine leather storefront. Engineered for high conversion with fluid bilingual Arabic (RTL) and English (LTR) switching, real-time product filtration, and an optimized mobile checkout experience.",
    challenge:
      "Supporting bi-directional design without breaking typographic hierarchy or layout rhythm is a notorious pitfall. Arabic typography requires distinct optical sizing, leading adjustments, and reversed spatial choreography compared to Latin scripts.",
    solution:
      "Built a unified bi-directional layout system with logical CSS properties and dynamic font switching. Implemented instant client-side catalog filtering, fluid image magnification for leather grain textures, and friction-free multi-step order checkout.",
    keyDecisions: [
      {
        title: "Native RTL/LTR Logical Properties",
        description:
          "Eliminated duplicate directional stylesheets by strictly adopting CSS logical properties (inline-start, margin-inline) paired with custom Arabic font metrics.",
      },
      {
        title: "Zero-Jank Texture Inspection",
        description:
          "Crafted a high-resolution zoom viewport for fine leather textures that maintains 60 FPS performance during cursor and touch drag.",
      },
    ],
    verifiableMetrics: [
      "Dual Language Production Deployment",
      "Sub-150ms Instant Catalog Filtering",
      "Mobile-First Touch Architecture",
    ],
    nextSlug: "portal",
    prevSlug: "retone",
  },
  {
    slug: "portal",
    num: "04",
    title: "Portal",
    subtitle: "Interactive 3D Narrative & Valve Fan Tribute",
    category: "3D & Interactive",
    role: "3D Web Developer & Motion Designer",
    year: "2026",
    status: "Interactive 3D Tribute",
    liveUrl: "https://portal-psi-eight-43.vercel.app/",
    githubUrl: "https://github.com/Lander2007",
    featured: true,
    coverImage: "/projects/Portal.png",
    galleryImages: ["/projects/Portal.png"],
    techStack: [
      "React 19",
      "Three.js",
      "GSAP ScrollTrigger",
      "Tailwind CSS",
      "Vite",
    ],
    overview:
      "An original, Portal-inspired interactive 3D website—a fan tribute to Valve's legendary Portal series, built as a single-scroll narrative experience with an interactive portal device, scroll-driven 3D, and reimagined signature quantum aperture mechanics.",
    challenge:
      "Orchestrating complex 3D camera transitions tied to scroll triggers while rendering realistic blue/orange portal apertures with performant stencil buffers.",
    solution:
      "Leveraged Three.js paired with GSAP ScrollTrigger to interpolate camera splines smoothly through testing chambers. Custom fragment shaders generate the swirling portal horizon without heavy render passes.",
    keyDecisions: [
      {
        title: "Scroll-Tethered Camera Splines",
        description:
          "Constructed Catmull-Rom cubic splines for cinematic camera paths that respond smoothly to wheel and touch velocity.",
      },
      {
        title: "Shader-Based Portal Vortices",
        description:
          "Wrote lightweight GLSL shaders for portal rims with animated noise displacement to mimic Aperture Science aesthetics.",
      },
    ],
    verifiableMetrics: [
      "Continuous 60 FPS Camera Choreography",
      "Fully Custom GLSL Shaders",
      "Single-Scroll Narrative Flow",
    ],
    nextSlug: "monolith",
    prevSlug: "el3almia-leather",
  },
  {
    slug: "monolith",
    num: "05",
    title: "Monolith",
    subtitle: "Scroll-Driven 3D Digital Art Installation",
    category: "3D & Interactive",
    role: "Experimental Frontend Developer & Shader Artist",
    year: "2026",
    status: "Interactive Art Installation",
    liveUrl: "https://monolith-two.vercel.app/",
    githubUrl: "https://github.com/Lander2007",
    featured: false,
    coverImage: "/projects/Monolith.png",
    galleryImages: ["/projects/Monolith.png"],
    techStack: [
      "React 19",
      "Three.js",
      "GLSL Shaders",
      "GSAP",
      "Tailwind CSS",
    ],
    overview:
      "Monolith is a scroll-driven 3D web experience engineered as an interactive digital art installation. It features a central obsidian monolith that deforms via custom vertex shaders and fractures across four narrative states based on user scroll velocity and cursor vector fields.",
    challenge:
      "Simulating brutalist stone fracturing and surface displacement without exceeding mobile GPU thermal budgets.",
    solution:
      "Implemented procedural vertex distortion inside vertex shaders, modifying normals on the GPU rather than manipulating CPU geometry arrays.",
    keyDecisions: [
      {
        title: "Custom Vertex Shader Deformation",
        description:
          "Calculated dynamic Simplex 3D noise directly inside the vertex shader pipeline for real-time monolithic surface ripple.",
      },
      {
        title: "Four Narrative State Triggers",
        description:
          "Bound ScrollTrigger checkpoints to scene lighting and shader parameters to communicate an emotional descent into brutalist architecture.",
      },
    ],
    verifiableMetrics: [
      "60 FPS GPU-Accelerated Shaders",
      "Zero Main-Thread Layout Thrashing",
      "Responsive 3D Viewport",
    ],
    nextSlug: "chronos-engine",
    prevSlug: "portal",
  },
  {
    slug: "chronos-engine",
    num: "06",
    title: "Chronos Engine",
    subtitle: "Interactive 3D WebGL Time-Dilation Engine",
    category: "3D & Interactive",
    role: "Creative Technologist & WebGL Developer",
    year: "2026",
    status: "Interactive WebGL Engine",
    liveUrl: "https://chronos-engine.vercel.app",
    githubUrl: "https://github.com/Lander2007/Chronos-Engine",
    featured: false,
    coverImage: "/projects/chronos-engine real.png",
    galleryImages: ["/projects/chronos-engine real.png"],
    techStack: [
      "React.js",
      "Three.js",
      "GSAP ScrollTrigger",
      "GLSL Shaders",
      "Tailwind CSS",
    ],
    overview:
      "Chronos Engine is an experimental, scroll-driven 3D web application featuring smooth WebGL model rotation, custom shaders, and an unconventional editorial layout. User scroll velocity directly modulates time dilation, procedural geometry twist, and chromatic aberration.",
    challenge:
      "Harmonizing heavy 3D GLTF asset rendering with fluid scroll velocity physics across diverse screen resolutions.",
    solution:
      "Applied Draco geometry compression to reduce 3D payload by 80% and clamped requestAnimationFrame delta timers to prevent physics explosion during rapid scroll flings.",
    keyDecisions: [
      {
        title: "Draco Mesh Compression",
        description:
          "Compressed complex mechanical geometry to sub-500KB while preserving high-fidelity normal vectors.",
      },
      {
        title: "Velocity-Tethered Fragment Distortion",
        description:
          "Fed normalized scroll acceleration directly into fragment shader uniforms to generate organic chromatic aberration.",
      },
    ],
    verifiableMetrics: [
      "Consistent 60 FPS on Standard Hardware",
      "Draco GLTF Mesh Optimization",
      "Published GitHub Open Source Code",
    ],
    nextSlug: "spaceedu",
    prevSlug: "monolith",
  },
  {
    slug: "spaceedu",
    num: "07",
    title: "SpaceEdu",
    subtitle: "Interactive 3D Web & EduTech Planetary Experience",
    category: "3D & Interactive",
    role: "3D Frontend Developer",
    year: "2026",
    status: "Interactive 3D Platform",
    liveUrl: "https://space-edu-drab.vercel.app/",
    githubUrl: "https://github.com/Lander2007/SpaceEdu",
    featured: false,
    coverImage: "/projects/spaceedu.png",
    galleryImages: ["/projects/spaceedu.png"],
    techStack: [
      "React",
      "Three.js",
      "Tailwind CSS",
      "Vite",
      "GSAP",
    ],
    overview:
      "An interactive 3D space education web platform featuring real-time orbital visualizations and astronomical data modules built with a futuristic glassmorphic aesthetic. Transforms astrophysics and planetary models into accessible interactive 3D simulations with fluid camera orbit controls.",
    challenge:
      "Representing scale differences between planetary bodies while keeping navigation intuitive and readable for students.",
    solution:
      "Engineered an exponential zoom camera system with hierarchical scene graphs for planetary orbits and interactive info overlays that reveal astrophysical data upon focal click.",
    keyDecisions: [
      {
        title: "Hierarchical Orbital Math",
        description:
          "Implemented Keplerian elliptical approximation algorithms to animate planetary orbits accurately without frame dips.",
      },
      {
        title: "Glassmorphic HUD Overlays",
        description:
          "Designed non-obtrusive telemetry overlays showing mass, gravity, and distance using CSS backdrop filters.",
      },
    ],
    verifiableMetrics: [
      "Interactive 3D Orbit Simulator",
      "Sub-200ms Orbital Target Transitions",
      "Full Mobile Touch Orbit Support",
    ],
    nextSlug: "aura",
    prevSlug: "chronos-engine",
  },
  {
    slug: "aura",
    num: "08",
    title: "Aura Activewear",
    subtitle: "Modern Activewear & High-Performance Sportswear Storefront",
    category: "E-Commerce & RTL",
    role: "Frontend UI/UX Developer",
    year: "2026",
    status: "Production E-Commerce Showcase",
    liveUrl: "https://aura-brown-mu.vercel.app/",
    githubUrl: "https://github.com/Lander2007/AURA",
    featured: false,
    coverImage: "/projects/aura.png",
    galleryImages: ["/projects/aura.png"],
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Lucide Icons",
    ],
    overview:
      "A sleek, high-performance e-commerce platform designed for premium athletic apparel. Aura combines modern UI aesthetics with a seamless shopping experience, featuring dynamic product filtering, responsive collection showcases, and an athletic design language emphasizing mobility and performance.",
    challenge:
      "Balancing high-resolution apparel imagery with lightning-fast catalog filtration and mobile responsiveness.",
    solution:
      "Implemented Next.js modern WebP image loaders and client-side memory-cached filter matrices for instant zero-reload inventory searching.",
    keyDecisions: [
      {
        title: "Multi-Facet Attribute Filtering",
        description:
          "Engineered instant client-side filtering across sizes, colors, and activity types with sub-10ms response times.",
      },
      {
        title: "Mobile Quick-Add Drawer",
        description:
          "Designed a frictionless slide-over checkout cart drawer tailored for thumb navigation on mobile viewports.",
      },
    ],
    verifiableMetrics: [
      "Sub-10ms Client-Side Filtering",
      "Zero Layout Shift Responsive Cards",
      "Production Vercel Deployment",
    ],
    nextSlug: "el-king1",
    prevSlug: "spaceedu",
  },
  {
    slug: "el-king1",
    num: "09",
    title: "King Store",
    subtitle: "Mobile Accessories & Gadget E-Commerce Store",
    category: "E-Commerce & RTL",
    role: "Frontend Engineer",
    year: "2026",
    status: "Production Storefront",
    liveUrl: "https://el-king1.vercel.app/",
    githubUrl: "https://github.com/Lander2007/el-king1",
    featured: false,
    coverImage: "/projects/el-king1.png",
    galleryImages: ["/projects/el-king1.png"],
    techStack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Figma",
    ],
    overview:
      "A modern mobile accessories store interface featuring dynamic search indexing, category filters, and custom promotional banner layouts. High-fidelity dark-mode design with glassmorphic UI components, bilingual search interface, and responsive product grids.",
    challenge:
      "Organizing large inventories of mobile accessories (cables, chargers, cases, audio) into intuitive, scannable categories.",
    solution:
      "Created structured grid layouts with sticky category navigators and instant search suggestion debouncing for rapid product discovery.",
    keyDecisions: [
      {
        title: "Debounced Live Search Index",
        description:
          "Implemented 150ms debounced input listeners matching product titles, SKU tags, and compatibility models.",
      },
      {
        title: "High-Contrast Dark Aesthetic",
        description:
          "Used deep obsidian backgrounds with cyan/amber accents to create an energetic, consumer-tech visual tone.",
      },
    ],
    verifiableMetrics: [
      "Instant Debounced Search Indexing",
      "Mobile-Optimized Touch Grids",
      "Live Vercel Production Deployment",
    ],
    nextSlug: "maison",
    prevSlug: "aura",
  },
  {
    slug: "maison",
    num: "10",
    title: "Maison",
    subtitle: "Minimalist & Classic Luxury Fashion House",
    category: "E-Commerce & RTL",
    role: "Creative Frontend Developer",
    year: "2026",
    status: "Luxury Storefront Showcase",
    liveUrl: "https://maison-nine-wheat.vercel.app/",
    githubUrl: "https://github.com/Lander2007/Maison",
    featured: false,
    coverImage: "/projects/maison.png",
    galleryImages: ["/projects/maison.png"],
    techStack: [
      "React",
      "Tailwind CSS",
      "Framer Motion",
      "Vite",
    ],
    overview:
      "A refined, minimalist fashion e-commerce experience tailored for modern and classic wardrobe staples. Maison Nine focuses on clean visual hierarchy, sophisticated typography, and effortless navigation, offering fashion-conscious shoppers an elegant interface to explore curated collections of timeless apparel.",
    challenge:
      "Creating an understated, high-end editorial feel that lets the garment photography speak for itself without cluttering the interface with aggressive sales badges.",
    solution:
      "Adopted generous whitespace, delicate border rules, serif headings, and gentle staggered fade-ins for newly loaded collections using Framer Motion.",
    keyDecisions: [
      {
        title: "Editorial Asymmetric Lookbook",
        description:
          "Choreographed magazine-style photo spreads that break the monotony of standard e-commerce box grids.",
      },
      {
        title: "Restrained Micro-Transitions",
        description:
          "Tuned easing curves to power3.out with 0.4s durations for subtle hover feedback on apparel cards.",
      },
    ],
    verifiableMetrics: [
      "Editorial Lookbook Layout",
      "Subtle Spring Micro-Animations",
      "Production Vercel Hosting",
    ],
    nextSlug: "pharoh-view",
    prevSlug: "el-king1",
  },
  {
    slug: "pharoh-view",
    num: "11",
    title: "PHAROVIEW",
    subtitle: "Augmented Reality Spatial Commerce App",
    category: "3D & Interactive",
    role: "AR & Spatial Frontend Developer",
    year: "2025",
    status: "WebXR & AR Platform",
    liveUrl: "https://pharoh-view.vercel.app/",
    githubUrl: "https://github.com/Lander2007/Pharoh-view",
    featured: false,
    coverImage: "/projects/pharoh-view.png",
    galleryImages: ["/projects/pharoh-view.png"],
    techStack: [
      "React",
      "WebXR",
      "Three.js",
      "Tailwind CSS",
      "Vite",
    ],
    overview:
      "A cutting-edge mobile AR application designed to eliminate spatial uncertainty in online furniture shopping. PHAROVIEW leverages real-time plane detection, 360° model rotation, dynamic lighting simulation, and precise dimension tracking to let users visualize products directly in their home environment—boosting buyer confidence while reducing return rates.",
    challenge:
      "Running real-time surface anchoring and lighting estimation directly in the browser across diverse Android and iOS hardware without app store installs.",
    solution:
      "Built on WebXR Device API with graceful 3D canvas fallback for browsers lacking native camera depth sensors.",
    keyDecisions: [
      {
        title: "WebXR Hit-Test Integration",
        description:
          "Implemented real-time floor and wall plane raycasting for automatic furniture alignment in physical rooms.",
      },
      {
        title: "Automatic Lighting Estimation",
        description:
          "Adjusted 3D model directional lighting to match ambient room lumens captured via device sensors.",
      },
    ],
    verifiableMetrics: [
      "Browser-Based Zero-Install AR",
      "Sub-millimeter Dimension Tracking",
      "Live Vercel Production Build",
    ],
    nextSlug: "02health",
    prevSlug: "maison",
  },
  {
    slug: "02health",
    num: "12",
    title: "02 Health",
    subtitle: "Smart IoT Air Quality & Predictive Safety Portal",
    category: "Web Platforms",
    role: "HealthTech Frontend Architect",
    year: "2025",
    status: "IoT HealthTech Platform",
    liveUrl: "https://02-health.vercel.app/",
    githubUrl: "https://github.com/Lander2007/02Health",
    featured: false,
    coverImage: "/projects/02health.png",
    galleryImages: ["/projects/02health.png"],
    techStack: [
      "React",
      "Tailwind CSS",
      "TypeScript",
      "Chart.js",
      "IoT REST API",
    ],
    overview:
      "An advanced health tech web portal integrating real-time IoT monitoring with intelligent safety alerts. Engineered primarily to protect vulnerable populations, 02 Health tracks indoor air quality metrics and deploys predictive fire safety algorithms, delivering instant hazard detection, environmental insights, and automated emergency coordination.",
    challenge:
      "Streaming continuous sensor telemetry (PM2.5, CO2, temperature) into real-time charts without causing memory leaks or UI frame drops.",
    solution:
      "Implemented a circular data ring buffer in TypeScript and utilized Chart.js canvas streaming with downsampled historical curves.",
    keyDecisions: [
      {
        title: "Circular Telemetry Buffer",
        description:
          "Capped live telemetry history in memory, preventing garbage collection stutter over hours of continuous monitoring.",
      },
      {
        title: "High-Contrast Emergency Alert Protocol",
        description:
          "Designed instant full-screen visual and audible hazard states when sensor readings exceed critical safety thresholds.",
      },
    ],
    verifiableMetrics: [
      "Real-Time Multi-Sensor Telemetry",
      "Sub-50ms Emergency Alert Dispatch",
      "Production Vercel Platform",
    ],
    nextSlug: "savior",
    prevSlug: "pharoh-view",
  },
  {
    slug: "savior",
    num: "13",
    title: "Saviora",
    subtitle: "Fine Dining & Luxury Culinary Experience",
    category: "Web Platforms",
    role: "Frontend Designer & Developer",
    year: "2026",
    status: "Hospitality Web Platform",
    liveUrl: "https://savior-rosy.vercel.app/",
    githubUrl: "https://github.com/Lander2007/Savior",
    featured: false,
    coverImage: "/projects/savior.png",
    galleryImages: ["/projects/savior.png"],
    techStack: [
      "React",
      "Tailwind CSS",
      "JavaScript",
      "REST API",
    ],
    overview:
      "An immersive, upscale digital destination crafted for a luxury culinary experience. Saviora pairs rich visual storytelling with elegant layout architecture, allowing guests to explore seasonal gourmet menus, reserve private dining tables, and experience the restaurant's sophisticated atmosphere online.",
    challenge:
      "Translating the sensory richness of an upscale physical dining venue into a digital medium with smooth table booking workflows.",
    solution:
      "Structured an experiential landing narrative with culinary photography, interactive course menus, and a multi-step table reservation widget.",
    keyDecisions: [
      {
        title: "Interactive Course Menu Tabs",
        description:
          "Engineered category selectors for Appetizers, Main Courses, Desserts, and Sommelier pairings with dietary badge filters.",
      },
      {
        title: "Seamless Reservation Flow",
        description:
          "Created an instant booking modal with date, guest count, and seating area selectors with instant confirmation feedback.",
      },
    ],
    verifiableMetrics: [
      "Hospitality Booking Architecture",
      "Interactive Multi-Course Menu",
      "Production Vercel Deployment",
    ],
    nextSlug: "furni",
    prevSlug: "02health",
  },
  {
    slug: "furni",
    num: "14",
    title: "Furni Living Store",
    subtitle: "Interior E-Commerce & Responsive Furniture Catalog",
    category: "E-Commerce & RTL",
    role: "Frontend Developer",
    year: "2026",
    status: "Production Catalog Showcase",
    liveUrl: "https://lander2007.github.io/Furni/",
    githubUrl: "https://github.com/Lander2007/Furni",
    featured: false,
    coverImage: "/projects/furni.png",
    galleryImages: ["/projects/furni.png"],
    techStack: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Tailwind CSS",
    ],
    overview:
      "A lightweight, responsive furniture catalog featuring interactive cart states, user ratings, and effortless grid filtering across all viewport sizes. Delivers a smooth shopping experience with optimized performance and intuitive product discovery features.",
    challenge:
      "Building a fully functioning shopping cart and catalog filtering experience using lightweight vanilla frontend tools without bulky framework dependencies.",
    solution:
      "Engineered clean vanilla JavaScript state machines for cart quantity adjustments, persistent localStorage cart storage, and instant tag filtering.",
    keyDecisions: [
      {
        title: "Zero-Dependency Cart State",
        description:
          "Built persistent client-side cart mechanics synced with browser localStorage across reloads.",
      },
      {
        title: "Fluid Responsive Grid",
        description:
          "Designed dynamic CSS grid auto-fit layouts that transition seamlessly from 1 column on mobile to 4 columns on desktop.",
      },
    ],
    verifiableMetrics: [
      "Zero Framework Overhead",
      "Instant Cart State Synchronization",
      "GitHub Pages Production Build",
    ],
    nextSlug: "appexy",
    prevSlug: "savior",
  },
  {
    slug: "appexy",
    num: "15",
    title: "Appexy",
    subtitle: "SaaS Product Showcase & Conversion Landing Page",
    category: "Creative Tech & Tools",
    role: "Landing Page & Conversion Engineer",
    year: "2023",
    status: "Production Landing Page",
    liveUrl: "https://lander2007.github.io/Appexy/",
    githubUrl: "https://github.com/Lander2007/Appexy",
    featured: false,
    coverImage: "/projects/appexy.png",
    galleryImages: ["/projects/appexy.png"],
    techStack: [
      "React",
      "Tailwind CSS",
      "Framer Motion",
      "Vite",
    ],
    overview:
      "A conversion-focused landing page designed for SaaS products with feature comparison matrices, interactive pricing sliders, and user review carousels. Optimized for maximum conversion rates with strategic CTAs, social proof elements, and responsive design.",
    challenge:
      "Engaging visitors within the first 3 seconds while clearly explaining a multi-feature software product.",
    solution:
      "Constructed a structured hero with floating feature callouts, an interactive billing cycle toggle (monthly/annual), and fluid testimonial carousels.",
    keyDecisions: [
      {
        title: "Interactive Tier Pricing Calculator",
        description:
          "Implemented dynamic pricing calculations with visual savings badges when toggling annual billing plans.",
      },
      {
        title: "Micro-Interaction Feedback",
        description:
          "Added magnetic hover buttons and animated FAQ accordions with smooth height transitions.",
      },
    ],
    verifiableMetrics: [
      "Optimized Conversion Architecture",
      "Interactive Pricing Engine",
      "Live Production GitHub Pages",
    ],
    nextSlug: "codesystem",
    prevSlug: "furni",
  },
];

export const PERSONAL_DETAILS = {
  name: "Khaled Amr",
  role: "Lead Frontend Architect & Creative Motion Engineer",
  location: "Alexandria, Egypt (31.2001° N)",
  email: "kaled.amr0210@gmail.com",
  github: "https://github.com/Lander2007",
  linkedin: "https://www.linkedin.com/in/khaled-amr",
  twitter: "https://x.com/KhaledA33912144",
  stats: [
    { label: "VERIFIED PROJECTS", value: "15" },
    { label: "PRIMARY STACK", value: "NEXT.JS & REACT" },
    { label: "MOTION ENGINE", value: "GSAP & WEBGL" },
    { label: "BILINGUAL LOCALES", value: "EN / AR (RTL)" },
  ],
};
