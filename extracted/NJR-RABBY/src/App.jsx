import { lazy, Suspense, useEffect, useRef, useState, Component } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUp, Zap, Sparkles, Rocket, Palette, Plus, Minus, ChevronDown } from 'lucide-react'
const CanScene = lazy(() => import('./three/CanScene.jsx'))

const FLAVORS = [
  { id: 'violet', name: 'VIOLET STORM', main: '#6d28d9', dark: '#1e0a3c', glow: '#a855f7', desc: 'Deep violet, sharp edges and a stormy futuristic mood. Placeholder description for your first flavor.' },
  { id: 'neon', name: 'NEON PULSE', main: '#c026d3', dark: '#3b0a3a', glow: '#f0abfc', desc: 'Electric magenta with a bright, high-voltage look. Placeholder description for your second flavor.' },
  { id: 'ice', name: 'CYBER ICE', main: '#2563eb', dark: '#0b1530', glow: '#60a5fa', desc: 'Cool electric blue with silver highlights. Placeholder description for your third flavor.' },
]
const NAV = [['home', 'HOME'], ['collection', 'COLLECTION'], ['story', 'OUR STORY'], ['experience', 'EXPERIENCE'], ['contact', 'CONTACT']]
const FAQ = [
  ['What is NJR RABBY?', 'NJR RABBY is a fictional premium energy drink brand built around bold, futuristic design. Replace this text with your real brand description.'],
  ['What flavors are available?', 'Three concept flavors: Violet Storm, Neon Pulse and Cyber Ice.'],
  ['Where can I find NJR RABBY?', 'Availability details will be announced here. Add your real stockists or online store when ready.'],
  ['Will more products be launched?', 'New concepts are planned. Add your real launch plans here.'],
]
const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
const rise = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.7 } }

class Boundary extends Component {
  state = { bad: false }
  static getDerivedStateFromError() { return { bad: true } }
  render() { return this.state.bad ? this.props.fallback : this.props.children }
}
const hasGL = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false } }
const StaticCan = ({ f }) => (
  <div className="static-can" role="img" aria-label="NJR RABBY energy drink can" style={{ '--m': f.main, '--g': f.glow, '--d': f.dark }}>
    <div className="sc-body"><b>NJR<br />RABBY</b><span>{f.name}</span></div>
  </div>
)

export default function App() {
  const [fi, setFi] = useState(0); const f = FLAVORS[fi]
  const [open, setOpen] = useState(false); const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home'); const [gl] = useState(hasGL)
  const [loading, setLoading] = useState(true)
  const still = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches).current
  const mobile = window.innerWidth < 768
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t) }, [])
  useEffect(() => {
    const onS = () => setScrolled(window.scrollY > 40); onS()
    window.addEventListener('scroll', onS, { passive: true })
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    NAV.forEach(([id]) => { const el = document.getElementById(id); el && io.observe(el) })
    return () => { window.removeEventListener('scroll', onS); io.disconnect() }
  }, [])
  useEffect(() => { const s = document.documentElement.style; s.setProperty('--glow', f.glow); s.setProperty('--main', f.main); s.setProperty('--dark', f.dark) }, [f])
  const nav = (id) => { setOpen(false); go(id) }
  const onMove = (e) => { mouse.current = { x: e.clientX / innerWidth - 0.5, y: e.clientY / innerHeight - 0.5 } }

  return (
    <>
      <AnimatePresence>{loading && <motion.div className="loader" exit={{ opacity: 0 }} role="status" aria-label="Loading"><Zap size={48} /><span>NJR RABBY</span></motion.div>}</AnimatePresence>
      <header className={`nav ${scrolled ? 'solid' : ''}`}>
        <button className="logo" onClick={() => nav('home')}>NJR RABBY</button>
        <nav className={open ? 'open' : ''} aria-label="Main">
          {NAV.map(([id, l]) => <button key={id} className={active === id ? 'on' : ''} onClick={() => nav(id)}>{l}</button>)}
        </nav>
        <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </header>

      <main>
        <section id="home" className="hero" onMouseMove={onMove}>
          <div className="aurora" />
          <div className="hero-text">
            <p className="eyebrow">ENERGY BEYOND LIMITS.</p>
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>OWN YOUR <span className="neon">VOLTAGE.</span></motion.h1>
            <p className="lead">Unleash a new level of energy. Experience the future of performance with NJR RABBY.</p>
            <div className="btns"><button className="btn primary" onClick={() => nav('collection')}>EXPLORE THE ENERGY</button><button className="btn ghost" onClick={() => nav('story')}>DISCOVER THE BRAND</button></div>
          </div>
          <div className="hero-can">
            {gl ? <Boundary fallback={<StaticCan f={f} />}><Suspense fallback={<StaticCan f={f} />}><CanScene flavor={f} still={still} mobile={mobile} mouse={mouse} /></Suspense></Boundary> : <StaticCan f={f} />}
            <div className="chips" role="group" aria-label="Choose flavor">
              {FLAVORS.map((x, i) => <button key={x.id} className={i === fi ? 'chip on' : 'chip'} style={{ '--c': x.glow }} onClick={() => setFi(i)} aria-pressed={i === fi}>{x.name}</button>)}
            </div>
          </div>
          <div className="scroll-ind" aria-hidden="true"><ChevronDown /></div>
        </section>

        <section id="collection" className="sec">
          <motion.h2 {...rise}>THE <span className="neon">COLLECTION</span></motion.h2>
          <div className="grid3">
            {FLAVORS.map((x, i) => (
              <motion.button {...rise} key={x.id} className={`flavor glass ${i === fi ? 'sel' : ''}`} style={{ '--c': x.glow, '--m': x.main }} onClick={() => { setFi(i); go('home') }}>
                <div className="swatch" /><h3>{x.name}</h3><p>{x.desc}</p><span className="link">VIEW IN 3D →</span>
              </motion.button>
            ))}
          </div>
        </section>

        <section id="story" className="sec">
          <motion.h2 {...rise}>NOT JUST ENERGY.<br /><span className="neon">AN EXPERIENCE.</span></motion.h2>
          <div className="grid4">
            {[['Built for ambition.', 'A brand for people who aim higher.'], ['Designed for bold minds.', 'Every detail made to be noticed.'], ['Inspired by the future.', 'Neon, metal and motion.'], ['Made to stand out.', 'Never blend in.']].map(([t, d], i) => (
              <motion.div key={t} {...rise} transition={{ duration: 0.7, delay: i * 0.1 }} className="story-item"><h3>{t}</h3><p>{d}</p></motion.div>
            ))}
          </div>
        </section>

        <section id="experience" className="sec">
          <div className="banner" aria-hidden="true"><div className="marquee">{Array(8).fill('OWN YOUR VOLTAGE ✦ ENERGY BEYOND LIMITS ✦ ').join('')}</div></div>
          <div className="grid4">
            {[[Zap, 'BOLD IDENTITY', 'A loud, unmistakable visual presence.'], [Sparkles, 'FUTURISTIC DESIGN', 'Neon light on brushed metal.'], [Rocket, 'NEXT-GEN EXPERIENCE', 'Interactive and immersive from first look.'], [Palette, 'UNLEASH YOUR STYLE', 'Pick the flavor that fits your mood.']].map(([I, t, d], i) => (
              <motion.div key={t} {...rise} transition={{ duration: 0.7, delay: i * 0.1 }} className="card glass"><I className="ico" size={36} /><h3>{t}</h3><p>{d}</p></motion.div>
            ))}
          </div>
        </section>

        <FaqSection />
        <Newsletter />
        <Contact />
      </main>

      <footer>
        <button className="logo" onClick={() => nav('home')}>NJR RABBY</button>
        <p>A bold concept brand for those who want to stand out.</p>
        <div className="flinks">{NAV.map(([id, l]) => <button key={id} onClick={() => nav(id)}>{l}</button>)}</div>
        <div className="flinks">{['Instagram', 'TikTok', 'YouTube'].map((s) => <span key={s} title="Placeholder: add your real link">{s} (placeholder)</span>)}</div>
        <p className="neon">OWN YOUR VOLTAGE. — NJR RABBY</p>
        <small>© {new Date().getFullYear()} NJR RABBY. All rights reserved.</small>
      </footer>
      {scrolled && <button className="totop" aria-label="Back to top" onClick={() => go('home')}><ArrowUp /></button>}
    </>
  )
}

function FaqSection() {
  const [o, setO] = useState(0)
  return (
    <section id="faq" className="sec narrow">
      <motion.h2 {...rise}>FAQ</motion.h2>
      {FAQ.map(([q, a], i) => (
        <div key={q} className="faq glass">
          <button aria-expanded={o === i} onClick={() => setO(o === i ? -1 : i)}>{q}{o === i ? <Minus /> : <Plus />}</button>
          <AnimatePresence initial={false}>{o === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>{a}</motion.p>}</AnimatePresence>
        </div>
      ))}
    </section>
  )
}

const okEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
function Newsletter() {
  const [e, setE] = useState(''); const [m, setM] = useState('')
  const submit = (ev) => { ev.preventDefault(); setM(okEmail(e) ? 'Thanks! (Demo only: nothing was stored or sent.)' : 'Please enter a valid email address.') }
  return (
    <section className="sec narrow">
      <h2>STAY <span className="neon">CHARGED</span></h2>
      <form onSubmit={submit} noValidate className="row">
        <label htmlFor="nl" className="sr">Email</label>
        <input id="nl" type="email" placeholder="you@example.com" value={e} onChange={(x) => setE(x.target.value)} />
        <button className="btn primary">SUBSCRIBE</button>
      </form>
      <p className="note" role="status">{m || 'Demo form: no backend is connected, submissions are not saved.'}</p>
    </section>
  )
}

function Contact() {
  const [v, setV] = useState({ name: '', email: '', message: '' }); const [err, setErr] = useState({}); const [done, setDone] = useState(false)
  const submit = (ev) => {
    ev.preventDefault(); const x = {}
    if (v.name.trim().length < 2) x.name = 'Enter your name.'
    if (!okEmail(v.email)) x.email = 'Enter a valid email.'
    if (v.message.trim().length < 10) x.message = 'Message must be at least 10 characters.'
    setErr(x); setDone(!Object.keys(x).length)
  }
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value })
  return (
    <section id="contact" className="sec narrow">
      <motion.h2 {...rise}>GET IN <span className="neon">TOUCH</span></motion.h2>
      <form onSubmit={submit} noValidate className="glass form">
        {['name', 'email'].map((k) => <div key={k}><label htmlFor={k}>{k.toUpperCase()}</label><input id={k} value={v[k]} onChange={set(k)} />{err[k] && <em>{err[k]}</em>}</div>)}
        <div><label htmlFor="message">MESSAGE</label><textarea id="message" rows="5" value={v.message} onChange={set('message')} />{err.message && <em>{err.message}</em>}</div>
        <button className="btn primary">SEND MESSAGE</button>
        <p className="note" role="status">{done ? 'Validated! (Demo only: no backend is connected, nothing was sent.)' : 'Demo form: no backend connected.'}</p>
      </form>
    </section>
  )
}
