export const t = {
  bg: '#f5f2ed',
  surface: '#ffffff',
  surfaceAlt: '#ede9e2',
  border: '#d8d2c8',
  borderLight: '#e8e3db',
  accent: '#8b7355',
  accentLight: '#c4a882',
  text: '#1a1a1a',
  muted: '#666',
  dim: '#999',
  faint: '#bbb',
  error: '#c0392b',
  success: '#2d6a4f',
  font: "'DM Mono', 'Courier New', monospace",
}

export function Tag({ children, accent }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 9px',
      background: accent ? '#f5efe6' : '#f0ece5',
      border: `1px solid ${accent ? '#c4a882' : '#d8d2c8'}`,
      fontSize: 10, letterSpacing: 1,
      color: accent ? t.accent : t.muted,
      marginRight: 4, marginBottom: 4, fontFamily: t.font
    }}>{children}</span>
  )
}

export function Section({ title, children }) {
  return (
    <div style={{ borderTop: `1px solid ${t.borderLight}`, paddingTop: 14, marginBottom: 4 }}>
      <div style={{ fontSize: 9, letterSpacing: 3, color: t.dim, textTransform: 'uppercase', marginBottom: 10, fontFamily: t.font }}>
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
      <div style={{ fontSize: 28, marginBottom: 12, animation: 'spin 2s linear infinite', display: 'inline-block', color: t.accent }}>◌</div>
      {label && <div style={{ fontSize: 11, letterSpacing: 2, color: t.dim, fontFamily: t.font }}>{label}</div>}
    </div>
  )
}

export function Toast({ msg, type }) {
  return (
    <div style={{
      position: 'fixed', bottom: 88, left: '50%', transform: 'translateX(-50%)',
      zIndex: 999, whiteSpace: 'nowrap',
      background: type === 'error' ? '#fdf0ef' : '#f0f7f4',
      border: `1px solid ${type === 'error' ? '#e8b4b0' : '#a8d5bc'}`,
      color: type === 'error' ? t.error : t.success,
      padding: '10px 20px', fontSize: 11, letterSpacing: 1, fontFamily: t.font,
      boxShadow: '0 4px 24px rgba(0,0,0,0.12)'
    }}>{msg}</div>
  )
}

export function Btn({ onClick, children, variant = 'primary', disabled, style = {} }) {
  const base = {
    width: '100%', padding: '14px', cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontFamily: t.font,
    opacity: disabled ? 0.5 : 1, transition: 'all 0.15s', borderRadius: 0
  }
  const variants = {
    primary: { background: t.accent, color: '#fff', border: 'none' },
    ghost: { background: 'transparent', border: `1px solid ${t.border}`, color: t.muted, letterSpacing: 1 }
  }
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  )
}
