import { useState, useCallback } from 'react'
import { t, Spinner } from './ui'

const YT_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

const QUICK_SEARCHES = [
  'ikkunaliittymä asennus',
  'alapohja eristys',
  'vesikatto rakenne',
  'lämmöneristys seinä',
  'palokatko asennus',
  'viemäri asennus',
  'ilmanvaihto rakentaminen',
  'perustus anturat',
]

export default function VideoScreen() {
  const [query, setQuery] = useState('')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  const search = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) return
    setLoading(true); setError(null); setVideos([]); setSearched(true)
    try {
      const params = new URLSearchParams({
        part: 'snippet', q: searchQuery + ' rakentaminen',
        type: 'video', maxResults: 12, relevanceLanguage: 'fi', key: YT_KEY
      })
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`)
      if (!res.ok) throw new Error('Haku epäonnistui')
      const data = await res.json()
      setVideos(data.items || [])
    } catch (e) { setError('Haku epäonnistui: ' + e.message) }
    setLoading(false)
  }, [])

  const handleSubmit = (e) => { e.preventDefault(); search(query) }

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80, background: t.bg }}>
      <div style={{ padding: '12px 16px', position: 'sticky', top: 0, background: '#fff', zIndex: 10, borderBottom: `1px solid ${t.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Hae rakennusvideoita..."
            style={{ flex: 1, background: t.bg, border: `1px solid ${t.border}`, color: t.text, padding: '9px 14px', fontSize: 12, fontFamily: t.font, outline: 'none', letterSpacing: 0.5, WebkitAppearance: 'none', borderRadius: 0 }} />
          <button type="submit"
            style={{ padding: '9px 16px', background: t.accent, border: 'none', color: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: t.font, letterSpacing: 1 }}>Hae</button>
        </form>
      </div>

      {!searched && (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 9, letterSpacing: 3, color: t.dim, textTransform: 'uppercase', marginBottom: 12, fontFamily: t.font }}>Suositut haut</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {QUICK_SEARCHES.map(s => (
              <button key={s} onClick={() => { setQuery(s); search(s) }}
                style={{ padding: '7px 12px', background: '#fff', border: `1px solid ${t.border}`, color: t.muted, cursor: 'pointer', fontSize: 11, fontFamily: t.font, letterSpacing: 0.5 }}>{s}</button>
            ))}
          </div>
        </div>
      )}

      {loading && <Spinner label="Haetaan videoita..." />}
      {error && <div style={{ padding: 16, fontSize: 11, color: '#c0392b', fontFamily: t.font }}>{error}</div>}
      {!loading && searched && videos.length === 0 && !error && (
        <div style={{ textAlign: 'center', marginTop: 40, color: t.dim, fontFamily: t.font, fontSize: 12 }}>Ei tuloksia.</div>
      )}

      {videos.length > 0 && (
        <div style={{ padding: '12px 16px 0' }}>
          <div style={{ fontSize: 10, color: t.dim, letterSpacing: 2, marginBottom: 12, fontFamily: t.font }}>{videos.length} videota</div>
          {videos.map(v => (
            <a key={v.id.videoId} href={`https://www.youtube.com/watch?v=${v.id.videoId}`} target="_blank" rel="noreferrer"
              style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: `1px solid ${t.borderLight}`, textDecoration: 'none', alignItems: 'flex-start' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img src={v.snippet.thumbnails.medium?.url} alt={v.snippet.title} style={{ width: 120, height: 68, objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)' }}>
                  <span s
