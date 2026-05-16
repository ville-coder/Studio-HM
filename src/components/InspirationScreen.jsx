import { useState, useCallback, useEffect } from 'react'
import { t, Spinner } from './ui'

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY

const QUICK_SEARCHES = [
  'modern architecture',
  'scandinavian interior',
  'minimalist home',
  'wood facade',
  'concrete architecture',
  'kitchen design',
  'bathroom design',
  'staircase interior',
]

export default function InspirationScreen() {
  const [query, setQuery] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    search('scandinavian architecture interior')
  }, [])

  const search = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) return
    setLoading(true); setError(null)
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=20&orientation=squarish`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
      )
      if (!res.ok) throw new Error('Haku epäonnistui')
      const data = await res.json()
      setImages(data.results || [])
    } catch (e) { setError('Haku epäonnistui: ' + e.message) }
    setLoading(false)
  }, [])

  const handleSubmit = (e) => { e.preventDefault(); search(query) }

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80, background: t.bg }}>
      <div style={{ padding: '12px 16px', position: 'sticky', top: 0, background: '#fff', zIndex: 10, borderBottom: `1px solid ${t.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Hae inspiraatiokuvia..."
            style={{ flex: 1, background: t.bg, border: `1px solid ${t.border}`, color: t.text, padding: '9px 14px', fontSize: 12, fontFamily: t.font, outline: 'none', letterSpacing: 0.5, WebkitAppearance: 'none', borderRadius: 0 }} />
          <button type="submit"
            style={{ padding: '9px 16px', background: t.accent, border: 'none', color: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: t.font, letterSpacing: 1 }}>Hae</button>
        </form>
        <div style={{ display: 'flex', gap: 6, marginTop: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {QUICK_SEARCHES.map(s => (
            <button key={s} onClick={() => { setQuery(s); search(s) }}
              style={{ padding: '4px 10px', background: 'transparent', border: `1px solid ${t.border}`, color: t.muted, cursor: 'pointer', fontSize: 10, fontFamily: t.font, whiteSpace: 'nowrap', flexShrink: 0 }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading && <Spinner label="Haetaan kuvia..." />}
      {error && <div style={{ padding: 16, fontSize: 11, color: '#c0392b', fontFamily: t.font }}>{error}</div>}

      {images.length > 0 && (
        <div style={{ padding: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {images.map(img => (
            <a key={img.id} href={img.links.html} target="_blank" rel="noreferrer"
              style={{ display: 'block', textDecoration: 'none', background: '#fff', border: `1px solid ${t.border}`, overflow: 'hidden' }}>
              <img src={img.urls.small} alt={img.alt_description}
                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '5px 8px', fontSize: 9, color: t.dim, fontFamily: t.font, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {img.user.name} · Unsplash
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
