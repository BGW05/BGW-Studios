import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowRight, ArrowUpRight, Camera, Code2, Download, ExternalLink, Github, Instagram, Mail, MapPin, Menu, Monitor, Palette, Sparkles, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type ProjectItem = {
  type: string;
  title: string;
  description: string;
  className: string;
  detail: string;
  tags?: string[];
  icon?: 'art' | 'web' | 'code' | 'media';
};

const portfolioCategories: ProjectItem[] = [
  {
    type: 'ART & ILLUSTRATION',
    title: 'Art & Illustration',
    description: 'A selection of digital and traditional artwork, character designs, and illustrations that showcase creativity and attention to detail.',
    className: 'portfolio-floral',
    icon: 'art',
    tags: ['Digital Art', 'Illustration', 'Procreate', 'Photoshop'],
    detail: 'A collection of visual studies built around color, character, and close observation. The work moves between digital and traditional tools while keeping a handmade sense of gesture.',
  },
  {
    type: 'WEB DESIGN & DEVELOPMENT',
    title: 'Web Design & Development',
    description: 'Responsive websites and landing pages designed with clean layouts, intuitive user experiences, and modern design principles.',
    className: 'portfolio-web',
    icon: 'web',
    tags: ['HTML', 'CSS', 'JavaScript', 'React'],
    detail: 'Thoughtful digital spaces designed from the first wireframe through the final interaction. Each build pairs a clear visual system with useful, accessible behavior.',
  },
  {
    type: 'CODING & TECHNICAL PROJECTS',
    title: 'Coding & Technical Projects',
    description: 'Practical projects that highlight problem-solving skills, logic, and the ability to build efficient, scalable solutions.',
    className: 'portfolio-code',
    icon: 'code',
    tags: ['Python', 'Java', 'JavaScript', 'SQL'],
    detail: 'Small, focused software projects that turn questions into working systems. The goal is always the same: clear logic, reliable behavior, and a calm experience for the person using it.',
  },
  {
    type: 'CREATIVE MEDIA',
    title: 'Creative Media',
    description: 'Video edits, motion graphics, photo editing, and multimedia projects that bring ideas and stories to life.',
    className: 'portfolio-media',
    icon: 'media',
    tags: ['Premiere Pro', 'After Effects', 'Photoshop', 'Canva'],
    detail: 'A growing collection of edits and visual experiments where timing, texture, and story work together. Every frame is treated as part of a larger feeling.',
  },
];

const navItems = [
  ['home', 'HOME'],
  ['about', 'ABOUT'],
  ['projects', 'PORTFOLIO'],
  ['notes', 'DOCUMENTATION'],
  ['contact', 'CONTACT'],
] as const;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function LeafMark() {
  return (
    <svg className="mini-leaf" viewBox="0 0 30 42" fill="none" aria-hidden="true">
      <path d="M15 42V8" stroke="currentColor" strokeWidth="1" />
      <path d="M15 13C15 13 7 11 5 4" stroke="currentColor" strokeWidth="1" />
      <path d="M15 20C15 20 24 18 26 8" stroke="currentColor" strokeWidth="1" />
      <path d="M15 29C15 29 8 27 6 21" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function Header({ activeSection }: { activeSection: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = (id: string) => {
    scrollToId(id);
    setIsOpen(false);
  };
  return (
    <header className="site-header">
      <button className="brand-lockup" onClick={() => navigate('home')} aria-label="Back to home">
        <span className="brand-mark">BGW</span>
        <span className="brand-divider" />
        <span className="brand-name">BGW STUDIOS</span>
      </button>
      <nav className="site-nav" aria-label="Primary navigation">
        {navItems.map(([id, label]) => (
          <button key={id} className={activeSection === id ? 'active' : ''} onClick={() => navigate(id)}>{label}</button>
        ))}
      </nav>
      <div className="header-note">
        <LeafMark />
        <span />
        <em>Create · Build · Inspire</em>
      </div>
      <button className="mobile-menu-button" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Close menu' : 'Open menu'}>
        {isOpen ? <X size={24} strokeWidth={1.4} /> : <Menu size={24} strokeWidth={1.4} />}
      </button>
      {isOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map(([id, label]) => <button key={id} onClick={() => navigate(id)}>{label}</button>)}
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <div className="eyebrow">Welcome to BGW Studios</div>
        <h1>Where creativity<br />meets <em>intention.</em></h1>
        <p className="hero-description">
          Thoughtful craftsmanship, a sharp eye for detail, and a passion for creativity.
          I bring together design, coding, and documentation to turn ideas into meaningful, lasting work.
        </p>
        <button className="button-primary" onClick={() => scrollToId('projects')}>
          EXPLORE MY WORK <ArrowRight size={15} strokeWidth={1.5} />
        </button>
      </div>
      <div className="hero-art" aria-label="Abstract studio still life">
        <div className="art-canvas">
          <span className="art-caption">peonies · candle · books / studio still life</span>
        </div>
        <div className="art-side"><p>Big dreams,<br />thoughtful work.</p></div>
      </div>
    </section>
  );
}

function ProjectModal({ project, onClose }: { project: ProjectItem; onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="project-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={project.title}>
        <button className="modal-close" onClick={onClose} aria-label="Close project note"><X size={20} strokeWidth={1.3} /></button>
        <div className="project-type">{project.type}</div>
        <h2>{project.title}</h2>
        <p>{project.detail}</p>
        <div className="modal-rule" />
        <div className="modal-note"><Sparkles size={13} /> CASE NOTE · BGW STUDIOS / 2024</div>
      </div>
    </div>
  );
}

function CategoryIcon({ kind }: { kind: ProjectItem['icon'] }) {
  if (kind === 'web') return <Monitor size={23} strokeWidth={1.2} />;
  if (kind === 'code') return <Code2 size={23} strokeWidth={1.2} />;
  if (kind === 'media') return <Camera size={23} strokeWidth={1.2} />;
  return <Palette size={23} strokeWidth={1.2} />;
}

function Projects() {
  const [selected, setSelected] = useState<ProjectItem | null>(null);
  return (
    <>
      <section className="portfolio-section section-wrap" id="projects">
        <div className="portfolio-hero">
          <div className="portfolio-hero-accent" aria-hidden="true" />
          <div className="portfolio-hero-copy">
            <p className="portfolio-eyebrow">WELCOME TO BGW STUDIOS</p>
            <h2>Projects &amp;<br /><em>Portfolio</em></h2>
            <div className="portfolio-rule"><span /></div>
            <p>A collection of creative work, technical skills, and passion projects. Each piece represents a step in the journey of learning, building, and bringing ideas to life.</p>
          </div>
        </div>

        <div className="portfolio-categories">
          <div className="portfolio-heading">
            <div>
              <p>EXPLORE MY WORK</p>
              <h3>Project Categories</h3>
            </div>
            <span className="portfolio-heading-line" />
            <em>Different skills. One vision.</em>
          </div>
          <div className="portfolio-category-grid">
            {portfolioCategories.map((category, index) => (
              <article className="portfolio-card reveal" key={category.title}>
                <button className={`portfolio-photo ${category.className}`} onClick={() => setSelected(category)} aria-label={`Open case note for ${category.title}`} />
                <div className={`portfolio-icon ${index % 2 === 0 ? 'rose' : 'sage'}`}><CategoryIcon kind={category.icon} /></div>
                <div className="portfolio-card-body">
                  <h4>{category.title}</h4>
                  <p>{category.description}</p>
                  <div className="portfolio-tags">{category.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <button className="portfolio-link" onClick={() => setSelected(category)}>VIEW PROJECT <ArrowRight size={13} /></button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="portfolio-featured">
          <div className="portfolio-featured-label">FEATURED PROJECT</div>
          <div className="portfolio-featured-photo" aria-label="Abstract floral website study" />
          <div className="portfolio-featured-info">
            <p>FEATURED PROJECT</p>
            <h3>Bloom &amp; Co. — Website Redesign</h3>
            <h4>A clean, elegant, and responsive e-commerce site for a modern floral brand.</h4>
            <p className="portfolio-featured-description">This project focused on creating a visually calming, user-friendly website with a seamless shopping experience. I designed the full UI, built responsive layouts, and implemented key interactive features to enhance usability and brand storytelling.</p>
            <div className="portfolio-tags"><span>HTML</span><span>CSS</span><span>JavaScript</span><span>Shopify</span></div>
            <button className="portfolio-case-button" onClick={() => setSelected({
              type: 'FEATURED PROJECT',
              title: 'Bloom & Co. — Website Redesign',
              description: 'A clean, elegant, and responsive e-commerce site for a modern floral brand.',
              className: 'portfolio-featured-photo',
              detail: 'Bloom & Co. needed a calmer, more confident digital storefront. The redesign focused on brand storytelling, an effortless browsing rhythm, and responsive details that keep the floral work at the center.',
            })}>VIEW CASE STUDY <ArrowUpRight size={14} /></button>
          </div>
          <div className="portfolio-stats">
            <div><strong>01</strong><span>WEBSITE</span></div>
            <i /><div><strong>02</strong><span>WEEKS</span></div>
            <i /><div><strong>100%</strong><span>RESPONSIVE</span></div>
          </div>
        </div>

        <div className="portfolio-closing">
          <div>
            <p>Let's create something beautiful.</p>
            <span>I'm always open to new opportunities, collaborations, and creative challenges. If you're interested in working together or would like to learn more about my work, feel free to reach out!</span>
            <button className="portfolio-outline-button" onClick={() => scrollToId('contact')}>GET IN TOUCH <ArrowRight size={14} /></button>
          </div>
        </div>
      </section>
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function About() {
  return (
    <section className="about-section section-wrap" id="about">
      <div className="about-intro">
        <div className="about-intro-copy">
          <p className="about-script">A little about the person behind the work</p>
          <h2>About BGW Studios</h2>
          <div className="about-rule"><span /><span className="about-rule-mark"><LeafMark /></span><span /></div>
          <p className="about-subline">
            A CREATIVE MIND <b>/</b> A CURIOUS HEART <b>/</b> A PURPOSE
          </p>
        </div>
        <div className="about-intro-art" aria-label="Abstract peony and gold ring still life">
          <div className="about-art-frame"><span>peony + gold ring / studio study</span></div>
        </div>
        <blockquote className="about-quote">
          <span className="about-quote-mark">“</span>
          <p>I believe the smallest details can turn a good idea into something memorable.</p>
          <div className="about-quote-rule"><span /><LeafMark /><span /></div>
        </blockquote>
      </div>

      <div className="about-content">
        <div className="about-still-life" aria-label="Abstract books and florals still life">
          <div className="about-still-life-art"><span>books + florals / studio study</span></div>
        </div>

        <div className="about-story">
          <h3>My Story</h3>
          <p>
            I've always been drawn to creativity, problem-solving, and the beauty in the details.
            What started as a love for art and design quickly grew into a passion for building —
            not just beautiful things, but things that work.
          </p>
          <p>
            Over time, I discovered how much I enjoy bringing ideas to life through design, code,
            and storytelling. Every project is a chance to learn, grow, and make a positive impact,
            whether through visual art, web development, or creative content.
          </p>
        </div>

        <div className="about-story about-story-divider">
          <h3>My Mission</h3>
          <p>
            My mission is to create meaningful, high-quality work that inspires, solves problems,
            and makes a difference. I want to use my skills to tell compelling stories, build useful
            tools, and bring beauty and purpose into everything I do.
          </p>
          <h3>How I Work</h3>
          <p>
            I'm intentional, collaborative, and always focused on the details. I value clear
            communication, creative problem-solving, and a steady work ethic. I take pride in
            delivering thoughtful, polished work — and I'm always open to feedback and new ideas.
          </p>
        </div>

        <aside className="about-guides">
          <p className="about-script">What Guides Me</p>
          <div className="guide-row">
            <div className="guide-icon guide-icon-rose"><LeafMark /></div>
            <div><strong>INTENTIONAL</strong><p>I put thought and purpose into everything I do.</p></div>
          </div>
          <div className="guide-row">
            <div className="guide-icon guide-icon-sage"><Sparkles size={24} strokeWidth={1.2} /></div>
            <div><strong>DETAIL-ORIENTED</strong><p>The little things matter — they make the big things better.</p></div>
          </div>
          <div className="guide-row">
            <div className="guide-icon guide-icon-rose"><Download size={22} strokeWidth={1.2} /></div>
            <div><strong>ALWAYS LEARNING</strong><p>I stay curious, open-minded, and excited for what's next.</p></div>
          </div>
        </aside>
      </div>

      <div className="about-cta">
        <p>Let's build something great.</p>
        <span className="about-cta-rule" aria-hidden="true"><i />→</span>
        <button className="button-secondary about-cta-button" onClick={() => scrollToId('projects')}>
          VIEW MY PROJECTS <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}

function Documentation({ onContact }: { onContact: () => void }) {
  return (
    <>
      <section className="notes-section section-wrap" id="notes">
        <div className="notes-heading">
          <h2>Documentation is part of the <em>work.</em></h2>
          <p>Thoughts, process notes, and the useful bits in between.</p>
        </div>
        <div className="notes-layout">
          <div className="note-list">
            <button className="note-item" onClick={() => onContact()}>
              <span className="note-number">NOTE / 01</span>
              <span><h3>Making space for the unfinished</h3><p>On process, permission, and the first draft.</p></span>
              <ArrowUpRight className="note-arrow" size={17} />
            </button>
            <button className="note-item" onClick={() => onContact()}>
              <span className="note-number">NOTE / 02</span>
              <span><h3>Small systems, softer days</h3><p>A task manager that knows when to stay quiet.</p></span>
              <ArrowUpRight className="note-arrow" size={17} />
            </button>
            <button className="note-item" onClick={() => onContact()}>
              <span className="note-number">NOTE / 03</span>
              <span><h3>The beauty of a considered detail</h3><p>Why the last five percent changes the whole thing.</p></span>
              <ArrowUpRight className="note-arrow" size={17} />
            </button>
          </div>
        </div>
      </section>
      <ContactPage />
    </>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  };
  return (
    <section className="contact-section section-wrap" id="contact">
      <div className="contact-hero">
        <p className="contact-script">A note is a good place to start</p>
        <h2>Get In Touch</h2>
        <p className="contact-subline">LET'S CREATE SOMETHING GREAT</p>
        <p>Have a question, collaboration idea, or just want to say hello? I'd love to hear from you.</p>
      </div>

      <div className="contact-main">
        <div className="contact-info">
          <div className="contact-info-item">
            <Mail size={17} strokeWidth={1.3} />
            <div><strong>EMAIL</strong><a href="mailto:brianna@bgwstudios.com">brianna@bgwstudios.com</a></div>
          </div>
          <div className="contact-info-item">
            <MapPin size={17} strokeWidth={1.3} />
            <div><strong>LOCATION</strong><span>United States</span></div>
          </div>
          <div className="contact-info-item">
            <Instagram size={17} strokeWidth={1.3} />
            <div>
              <strong>FOLLOW ME</strong>
              <div className="contact-socials">
                <button type="button" aria-label="Instagram"><Instagram size={13} strokeWidth={1.3} /></button>
                <button type="button" aria-label="GitHub"><Github size={13} strokeWidth={1.3} /></button>
                <button type="button" aria-label="Email" onClick={() => { window.location.href = 'mailto:brianna@bgwstudios.com'; }}><Mail size={13} strokeWidth={1.3} /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-wrap">
          {sent ? (
            <div className="contact-success">
              <Sparkles size={22} strokeWidth={1.2} />
              <p>Thank you — your note is safely in the studio inbox.</p>
              <button type="button" onClick={() => setSent(false)}>SEND ANOTHER NOTE</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <label><span>Name *</span><input required type="text" name="name" /></label>
              <label><span>Email *</span><input required type="email" name="email" /></label>
              <label><span>Message *</span><textarea required name="message" /></label>
              <button className="contact-send-button" type="submit">SEND MESSAGE <ArrowRight size={14} /></button>
            </form>
          )}
        </div>
      </div>

      <div className="contact-thanks">
        <h3>Thanks for stopping by!</h3>
        <p>I can't wait to connect with you.</p>
        <Sparkles size={17} strokeWidth={1.1} />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">BGW STUDIOS</div>
      <div className="footer-copy">© 2024 / MADE WITH CARE IN THE STUDIO</div>
      <div className="footer-links">
        <button aria-label="Instagram"><Instagram size={15} strokeWidth={1.4} /></button>
        <button aria-label="GitHub"><Github size={15} strokeWidth={1.4} /></button>
        <button aria-label="Email" onClick={() => { window.location.href = 'mailto:hello@bgwstudios.com'; }}><ExternalLink size={15} strokeWidth={1.4} /></button>
      </div>
    </footer>
  );
}

function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const observerRef = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) window.setTimeout(() => scrollToId(hash), 0);
  }, []);
  useEffect(() => {
    const sections = navItems.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    observerRef.current = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, .25, .6] });
    sections.forEach((section) => observerRef.current?.observe(section));
    return () => observerRef.current?.disconnect();
  }, []);
  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    }), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
    return () => revealObserver.disconnect();
  }, []);
  return (
    <div className="site-shell">
      <Header activeSection={activeSection} />
      <main>
        <Hero />
        <Projects />
        <About />
        <Documentation onContact={() => scrollToId('contact')} />
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;