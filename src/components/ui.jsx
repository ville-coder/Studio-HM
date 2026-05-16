export const t = {
  bg: '#0f0f0f',
  surface: '#141414',
  surfaceAlt: '#0d0d0d',
  border: '#1e1e1e',
  accent: '#a8997e',
  text: '#e8e4dc',
  muted: '#666',
  dim: '#444',
  faint: '#333',
  font: "'DM Mono', 'Courier New', monospace",
}

export function Tag({ children, accent }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 8px',
      background: accent ? '#1a1a14' : '#141414',
      border: `1px solid ${accent ? '#3a3a20' : '#222'}`,
      fontSize: 10, letterSpacing: 1,
      color: accent ? t.accent : '#555',
      marginRight: 4, marginBottom: 4
    }}>{children}</span>
  )
}

export function Section({ title, children }) {
  return (
    <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 14, marginBottom: 4 }}>
      <div style={{ fontSize: 9, letterSpacing: 3, color: t.dim, textTransform: 'uppercase', marginBottom: 10 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

export function Spinner({ label = 'Ladataan...' }) {
  return (
    <div style={{ textAlign: 'center', padding: 48, color: t.muted }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ fontSize: 28, marginBottom: 12, animation: 'spin 2s linear infinite', display: 'inline-block' }}>◌</div>
      {label && <div style={{ fontSize: 11, letterSpacing: 2, color: t.dim }}>{label}</div>}
    </div>
  )
}

export function Toast({ msg, type }) {
  return (
    <div style={{
      position: 'fixed', bottom: 88, left: '50%', transform: 'translateX(-50%)',
      zIndex: 999, whiteSpace: 'nowrap',
      background: type === 'error' ? '#3a1a1a' : '#1a2e1a',
      border: `1px solid ${type === 'error' ? '#8b3a3a' : '#3a7a3a'}`,
      color: type === 'error' ? '#f08080' : '#80c080',
      padding: '10px 20px', fontSize: 11, letterSpacing: 1,
      boxShadow: '0 4px 24px rgba(0,0,0,0.6)'
    }}>{msg}</div>
  )
}

export function Btn({ onClick, children, variant = 'primary', disabled, style = {} }) {
  const base = {
    width: '100%', padding: '14px', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontFamily: t.font,
    opacity: disabled ? 0.5 : 1, transition: 'opacity 0.2s', ...style
  }
  const variants = {
    primary: { background: t.accent, color: '#111' },
    ghost: { background: 'transparent', border: '1px solid #222', color: t.muted, letterSpacing: 1 }
  }
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  )
}
