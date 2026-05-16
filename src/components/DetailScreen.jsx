import { useState } from 'react'
import { t, Tag, Section } from './ui'

export default function DetailScreen({ detail, onBack, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80, background: t.bg }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${t.border}`, position: 'sticky', top: 0, background: '#fff', zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: t.muted, fontSize: 11, letterSpacing: 2, cursor: 'pointer', fontFamily: t.font, textTransform: 'uppercase' }}>
          ← Takaisin
        </button>
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} style={{ background: 'none', border: 'none', color: t.dim, fontSize: 11, cursor: 'pointer', fontFamily: t.font }}>Poista</button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { onDelete(detail.id); onBack() }}
              style={{ padding: '5px 12px', background: '#c0392b', border: 'none', color: '#fff', fontSize: 10, cursor: 'pointer', fontFamily: t.font }}>Vahvista</button>
            <button onClick={() => setConfirmDelete(false)}
              style={{ padding: '5px 12px', background: 'transparent', border: `1px solid ${t.border}`, color: t.muted, fontSize: 10, cursor: 'pointer', fontFamily: t.font }}>Peru</button>
          </div>
        )}
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: t.accent, marginBottom: 6, textTransform: 'uppercase', fontFamily: t.font }}>
          {detail.jarjestelma} › {detail.alaluokka}
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 6, color: t.text, fontFamily: t.font }}>{detail.nimi}</h2>
        <p style={{ color: t.muted, fontSize: 12, marginBottom: 20, lineHeight: 1.7, fontFamily: t.font }}>{detail.kuvaus}</p>

        {detail.kuva && (
          <img src={detail.kuva} alt={detail.nimi}
            style={{ width: '100%', maxHeight: 300, objectFit: 'contain', background: '#f8f6f2', marginBottom: 20, display: 'block', border: `1px solid ${t.border}` }} />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(detail.rt_kortit?.length > 0 || detail.sfs_standardit?.length > 0) && (
            <Section title="Viitteet">
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {detail.rt_kortit?.map(r => <Tag key={r}>{r}</Tag>)}
                {detail.sfs_standardit?.map(s => <Tag key={s} accent>{s}</Tag>)}
              </div>
            </Section>
          )}

          {detail.valmistajat?.length > 0 && (
            <Section title="Valmistajat">
              {detail.valmistajat.map((v, i) => (
                <div key={i} style={{ padding: '10px 12px', background: '#fff', border: `1px solid ${t.border}`, marginBottom: 8 }}>
                  <div style={{ fontSize: 12, marginBottom: 4, fontFamily: t.font }}>{v.nimi} — <span style={{ color: t.accent }}>{v.tuote}</span></div>
                  {v.url && <a href={v.url} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: t.dim, textDecoration: 'none', display: 'block', wordBreak: 'break-all', fontFamily: t.font }}>{v.url}</a>}
                  {v.puhelin && <a href={`tel:${v.puhelin}`} style={{ fontSize: 12, color: t.accent, textDecoration: 'none', display: 'block', marginTop: 6, fontFamily: t.font }}>📞 {v.puhelin}</a>}
                </div>
              ))}
            </Section>
          )}

          {detail.asennusohjeet?.length > 0 && (
            <Section title="Asennusohjeet">
              {detail.asennusohjeet.map((a, i) => (
                <a key={i} href={a.url} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', borderBottom: `1px solid ${t.borderLight}`, textDecoration: 'none' }}>
                  <span style={{ fontSize: 14, color: t.accent }}>↗</span>
                  <span style={{ fontSize: 12, color: t.accent, fontFamily: t.font }}>{a.lahde}</span>
                </a>
              ))}
            </Section>
          )}

          {detail.videot?.length > 0 && (
            <Section title="Videot">
              {detail.videot.map((v, i) => (
                <a key={i} href={v.url} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#fff', border: `1px solid ${t.border}`, marginBottom: 6, textDecoration: 'none' }}>
                  <span style={{ fontSize: 18, color: t.accent }}>▶</span>
                  <div>
                    <div style={{ fontSize: 9, color: t.dim, letterSpacing: 1, fontFamily: t.font }}>{v.alusta}</div>
                    <div style={{ fontSize: 12, color: t.accent, fontFamily: t.font }}>{v.otsikko}</div>
                  </div>
                </a>
              ))}
            </Section>
          )}
        </div>

        <div style={{ marginTop: 24, fontSize: 10, color: t.faint, fontFamily: t.font }}>
          Lisätty {new Date(detail.lisatty).toLocaleDateString('fi-FI')} · {detail.tiedosto_nimi}
        </div>
      </div>
    </div>
  )
}
