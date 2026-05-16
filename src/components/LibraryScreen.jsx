import { useState } from 'react'
import { t, Spinner } from './ui'

const CATEGORIES = ['Rakenne', 'Vaippa', 'Perustukset', 'LVI', 'Sähkö', 'Paloturvallisuus']

export default function LibraryScreen({ library, loading, onSelect }) {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState(null)
  const [showFilter, setShowFilter] = useState(false)

  const filtered = library.filter(d => {
    const matchCat = !cat || d.jarjestelma === cat
    const matchSearch = !search ||
      [d.nimi, d.kuvaus, ...(d.avainsanat || [])].join(' ').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
      <div style={{ padding: '12px 16px', position: 'sticky', top: 0, background: '#fff', zIndex: 10, borderBottom: `1px solid ${t.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            placeholder="Hae detaljeja..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, background: t.bg, border: `1px solid ${t.border}`,
              color: t.text, padding: '9px 14px', fontSize: 12,
              fontFamily: t.font, outline: 'none', letterSpacing: 0.5,
              WebkitAppearance: 'none', borderRadius: 0
            }}
          />
          <button onClick={() => setShowFilter(!showFilter)}
            style={{
              padding: '9px 14px', background: showFilter ? t.accent : 'transparent',
              border: `1px solid ${showFilter ? t.accent : t.border}`,
              color: showFilter ? '#fff' : t.muted, cursor: 'pointer', fontSize: 14
            }}>≡</button>
        </div>

        {showFilter && (
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {[null, ...CATEGORIES].map(c => (
              <button key={c || 'all'} onClick={() => setCat(cat === c ? null : c)}
                style={{
                  padding: '5px 10px', fontSize: 9, letterSpacing: 1,
                  background: cat === c ? t.accent : 'transparent',
                  color: cat === c ? '#fff' : t.muted,
                  border: `1px solid ${cat === c ? t.accent : t.border}`,
                  cursor: 'pointer', fontFamily: t.font
                }}>{c || 'Kaikki'}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '10px 16px', fontSize: 10, color: t.dim, letterSpacing: 2, fontFamily: t.font }}>
        {filtered.length} detalji{filtered.length !== 1 ? 'a' : ''}
      </div>

      {loading ? <Spinner label="Ladataan kirjastoa..." /> : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 60, color: t.dim }}>
          <div style={{ fontSize: 32, marginBottom: 12, color: t.faint }}>∅</div>
          <div style={{ fontSize: 11, letterSpacing: 2, fontFamily: t.font }}>
            {library.length === 0 ? 'Kirjasto on tyhjä. Lisää ensimmäinen detalji.' : 'Ei hakutuloksia.'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filtered.map(detail => (
            <div key={detail.id} onClick={() => onSelect(detail)}
              style={{
                background: '#fff', borderBottom: `1px solid ${t.borderLight}`,
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                cursor: 'pointer', WebkitTapHighlightColor: 'transparent', transition: 'background 0.1s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = t.bg}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              onTouchStart={e => e.currentTarget.style.background = t.bg}
              onTouchEnd={e => e.currentTarget.style.background = '#fff'}
            >
              {detail.kuva
                ? <img src={detail.kuva} alt={detail.nimi} style={{ width: 64, height: 64, objectFit: 'cover', flexShrink: 0 }} />
                : <div style={{ width: 64, height: 64, background: t.bg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: t.faint, border: `1px solid ${t.border}` }}>⊟</div>
              }
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: t.accent, marginBottom: 3, textTransform: 'uppercase', fontFamily: t.font }}>
                  {detail.jarjestelma} › {detail.alaluokka}
                </div>
                <div style={{ fontSize: 13, color: t.text, marginBottom: 3, fontFamily: t.font }}>{detail.nimi}</div>
                <div style={{ fontSize: 11, color: t.muted, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: t.font }}>
                  {detail.kuvaus}
                </div>
              </div>
              <div style={{ color: t.dim, fontSize: 18 }}>›</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
