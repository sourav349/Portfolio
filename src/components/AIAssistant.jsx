import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiArrowRight, FiAward, FiBookOpen, FiBriefcase, FiCheck,
  FiCode, FiCopy, FiExternalLink, FiGithub, FiMail, FiMessageCircle,
  FiRotateCcw, FiSend, FiShield, FiStar, FiUser, FiX,
} from 'react-icons/fi';
import './AIAssistant.css';

const API = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');
const INITIAL = [{ role: 'assistant', text: "Hi! 👋 I'm Sourav's AI assistant. Ask me about his projects, skills, internships, education or achievements. I'll stick to what his resume actually supports.", mode: 'welcome' }];
const MENU = [
  { name: 'About', icon: FiUser, question: 'Tell me about Sourav' },
  { name: 'Skills', icon: FiCode, question: 'Which technologies does Sourav know?' },
  { name: 'Projects', icon: FiBriefcase, question: 'What projects has Sourav built?' },
  { name: 'Education', icon: FiBookOpen, question: "Tell me about Sourav's education" },
  { name: 'Awards', icon: FiAward, question: "What are Sourav's achievements?" },
  { name: 'Contact', icon: FiMail, question: 'How can I contact Sourav?' },
];
const SUGGESTIONS = [
  'What projects has Sourav built?',
  'Where has Sourav interned?',
  'Which AI/ML tools does he know?',
];

// Keep the animated 3D mascot from the existing Portfolio repository.
function Visor({ position = [0, 0.5, 0.6] }) {
  return <mesh position={position}>
    <sphereGeometry args={[0.42, 48, 48]} />
    <meshStandardMaterial color="#06061a" metalness={0.2} roughness={0.1} emissive="#0a1228" emissiveIntensity={0.7}/>
  </mesh>;
}
function BodyPiece({ args = [0.66, 48, 48], position = [0, -0.7, 0], color = '#c2f6ff', emissive }) {
  return <mesh position={position} castShadow receiveShadow>
    <sphereGeometry args={args}/>
    <meshStandardMaterial color={color} metalness={0.2} roughness={0.45} emissive={emissive || '#000000'} emissiveIntensity={0.5}/>
  </mesh>;
}
function FloatingBot() {
  const root = useRef();
  const leftHand = useRef();
  const rightHand = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (root.current) {
      root.current.position.y = Math.sin(t * 1.2) * 0.06;
      root.current.rotation.y = Math.sin(t / 4) * 0.08;
    }
    if (leftHand.current) {
      leftHand.current.rotation.z = Math.sin(t * 2.4) * 0.35;
      leftHand.current.position.x = 0.85 + Math.sin(t * 1.5) * 0.02;
    }
    if (rightHand.current) {
      rightHand.current.rotation.z = -Math.sin(t * 1.8) * 0.22;
      rightHand.current.position.x = -0.85 + Math.cos(t * 1.2) * 0.02;
    }
  });
  return <Float floatIntensity={0.6} rotationIntensity={0.8} speed={1.2}>
    <group ref={root} scale={0.64}>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.82, 64, 64]} />
        <meshStandardMaterial color="#dff9ff" metalness={0.15} roughness={0.35} emissive="#0b3b44" emissiveIntensity={0.06}/>
      </mesh>
      <Visor />
      <BodyPiece position={[0, -0.2, 0]} args={[0.68, 64, 64]} color="#e9feff" emissive="#0f2430"/>
      <group ref={leftHand} position={[0.9, -0.25, 0]}>
        <mesh><sphereGeometry args={[0.23, 32, 32]}/><meshStandardMaterial color="#00f0f0" emissive="#00f0f0" emissiveIntensity={0.9} metalness={0.25} roughness={0.2}/></mesh>
      </group>
      <group ref={rightHand} position={[-0.9, -0.25, 0]}>
        <mesh><sphereGeometry args={[0.23, 32, 32]}/><meshStandardMaterial color="#854ce6" emissive="#854ce6" emissiveIntensity={0.9} metalness={0.25} roughness={0.2}/></mesh>
      </group>
      <mesh position={[0, -0.18, 0.48]}>
        <circleGeometry args={[0.14, 32]}/>
        <meshStandardMaterial color="#0b1636" emissive="#b16ef6" emissiveIntensity={0.7}/>
      </mesh>
    </group>
  </Float>;
}

class RobotErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <FiMessageCircle size={33}/> : this.props.children; }
}

function FormattedText({ text }) {
  // Small, safe subset of Markdown: bold spans; no HTML or arbitrary links.
  return <>{String(text || '').split(/(\*\*[^*]+\*\*)/g).map((chunk, index) =>
    chunk.startsWith('**') && chunk.endsWith('**')
      ? <strong key={index}>{chunk.slice(2, -2)}</strong>
      : <React.Fragment key={index}>{chunk}</React.Fragment>
  )}</>;
}

function ChatBubble({ message }) {
  const [copied, setCopied] = useState(false);
  async function copyAnswer() {
    try { await navigator.clipboard.writeText(message.text); setCopied(true); setTimeout(() => setCopied(false), 1600); }
    catch { /* Clipboard unavailable; leave message unchanged. */ }
  }
  return <div className={`spai-line ${message.role === 'user' ? 'spai-line-user' : ''}`}>
    {message.role === 'assistant' && <span className="spai-avatar"><FiStar size={15}/></span>}
    <div className="spai-bubble-wrap">
      <div className={`spai-bubble spai-bubble-${message.role}`}><FormattedText text={message.text}/></div>
      {message.role === 'assistant' && message.mode !== 'welcome' && message.mode !== 'error' && <div className="spai-source">
        <FiShield size={12}/><span>{message.mode === 'offline' ? 'Resume lookup' : 'Grounded in resume'}</span>
        {message.sources?.length > 0 && <span className="spai-source-names">· {message.sources.slice(0, 2).join(' / ')}</span>}
        <button type="button" onClick={copyAnswer} title="Copy answer" aria-label="Copy answer">{copied ? <FiCheck/> : <FiCopy/>}</button>
      </div>}
    </div>
  </div>;
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [profile, setProfile] = useState(null);
  const listEnd = useRef(null);
  const inputEl = useRef(null);
  const sending = useRef(false);
  const history = useRef([]);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      fetch(`${API}/api/health`).then(r => { if (!r.ok) throw new Error('offline'); return r.json(); }),
      fetch(`${API}/api/profile`).then(r => { if (!r.ok) throw new Error('offline'); return r.json(); }),
    ]).then(([health, data]) => {
      if (!active) return;
      setConnected(health.status === 'fulfilled' && health.value.status === 'ok');
      if (data.status === 'fulfilled') setProfile(data.value);
    });
    return () => { active = false; };
  }, []);
  useEffect(() => { if (open) listEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, loading, open]);
  useEffect(() => { if (open) inputEl.current?.focus(); }, [open]);
  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  async function ask(value) {
    const question = String(value || '').trim();
    if (question.length < 2 || sending.current) return;
    sending.current = true;
    setOpen(true);
    setInput('');
    setLoading(true);
    setMessages(previous => [...previous, { role: 'user', text: question }]);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history: history.current.slice(-6) }),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'The AI service is currently unavailable.');
      const answer = typeof data.answer === 'string' ? data.answer : 'No answer was returned.';
      setMessages(previous => [...previous, { role: 'assistant', text: answer, sources: data.sources || [], mode: data.mode || 'grounded' }]);
      history.current = [...history.current, { role: 'user', content: question }, { role: 'assistant', content: answer }].slice(-8);
      setConnected(true);
    } catch (error) {
      setMessages(previous => [...previous, { role: 'assistant', mode: 'error', text:
        error.name === 'AbortError' ? 'The request timed out. Please try again.'
          : error instanceof TypeError ? 'The portfolio AI server is not reachable right now. Please try again later.'
          : error.message,
      }]);
    } finally {
      clearTimeout(timer);
      sending.current = false;
      setLoading(false);
    }
  }
  function reset() { history.current = []; setMessages(INITIAL); setInput(''); inputEl.current?.focus(); }

  return <div className="spai-root">
    <AnimatePresence>
      {open && <motion.section className="spai-panel" role="dialog" aria-modal="false" aria-label="Sourav AI portfolio assistant"
        initial={{ opacity: 0, y: 24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.96 }} transition={{ duration: 0.24 }}>
        <div className="spai-header">
          <div className="spai-header-icon"><FiStar size={22}/></div>
          <div className="spai-header-text"><h2>Ask Sourav AI <span>BETA</span></h2><p>Explore my work, projects &amp; experience</p></div>
          <div className="spai-header-actions">
            <button type="button" onClick={reset} title="New conversation" aria-label="New conversation"><FiRotateCcw/></button>
            <button type="button" onClick={() => setOpen(false)} title="Close assistant" aria-label="Close assistant"><FiX/></button>
          </div>
        </div>
        <div className="spai-status"><span className={connected ? 'spai-dot spai-dot-on' : 'spai-dot'}/>{connected ? 'Assistant connected' : 'Assistant connection unavailable'} <span className="spai-status-detail">· Resume-based answers</span></div>
        <div className="spai-quick-nav" aria-label="Quick questions">
          {MENU.map(({ name, icon: Icon, question }) => <button key={name} type="button" disabled={loading} onClick={() => ask(question)}><Icon size={14}/>{name}</button>)}
        </div>
        <div className="spai-chat-scroll" role="log" aria-live="polite" aria-relevant="additions">
          <div className="spai-intro"><span>✦ Your personal guide to Sourav's portfolio</span></div>
          {messages.map((m, index) => <ChatBubble key={index} message={m}/>)}
          {loading && <div className="spai-line"><span className="spai-avatar"><FiStar/></span><div className="spai-typing" aria-label="Assistant is responding"><i/><i/><i/></div></div>}
          {messages.length === 1 && profile?.projects?.length > 0 && <div className="spai-featured">
            <div className="spai-featured-title">FEATURED PROJECTS</div>
            {profile.projects.slice(0, 2).map(p => <button key={p.id} type="button" onClick={() => ask(`Explain ${p.title}`)}><span><strong>{p.title}</strong><small>{p.subtitle}</small></span><FiArrowRight/></button>)}
          </div>}
          <div ref={listEnd}/>
        </div>
        <div className="spai-bottom">
          {messages.length === 1 && <div className="spai-suggestions">
            {SUGGESTIONS.map(q => <button key={q} type="button" onClick={() => ask(q)} disabled={loading}>{q} <FiArrowRight size={13}/></button>)}
          </div>}
          <form onSubmit={event => { event.preventDefault(); ask(input); }} className="spai-input-row">
            <input ref={inputEl} maxLength={1000} disabled={loading} value={input} onChange={event => setInput(event.target.value)} placeholder="Ask anything about Sourav..." aria-label="Ask Sourav's AI assistant"/>
            <button disabled={!input.trim() || loading} type="submit" aria-label="Send question"><FiSend size={17}/></button>
          </form>
          <div className="spai-footer"><span><FiShield/> Answers only from documented experience</span><a href="https://github.com/sourav349/Portfolio" target="_blank" rel="noreferrer"><FiGithub/> Code <FiExternalLink size={11}/></a></div>
        </div>
      </motion.section>}
    </AnimatePresence>
    <button type="button" onClick={() => setOpen(v => !v)} className={`spai-launcher ${open ? 'spai-launcher-open' : ''}`} aria-label={open ? 'Close AI assistant' : 'Open AI assistant'} aria-expanded={open}>
      <span className="spai-launcher-label">{open ? 'Close chat' : 'Ask me anything'} <FiArrowRight size={14}/></span>
      <span className="spai-robot" aria-hidden="true"><RobotErrorBoundary><Canvas camera={{ position: [0, 0, 3.2], fov: 50 }} dpr={[1, 1.5]} style={{ pointerEvents: 'none' }}>
        <ambientLight intensity={0.6}/><pointLight position={[3, 4, 3]} intensity={1.2} color="#00f7f0"/><pointLight position={[-3, -3, -2]} intensity={0.8} color="#8b49f0"/>
        <FloatingBot/>
      </Canvas></RobotErrorBoundary></span>
      <span className="spai-bot-online"/>
    </button>
  </div>;
}
