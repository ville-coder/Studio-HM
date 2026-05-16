import { useState, useCallback } from 'react'
import { useLibrary } from './hooks/useLibrary'
import LibraryScreen from './components/LibraryScreen'
import DetailScreen from './components/DetailScreen'
import AddScreen from './components/AddScreen'
import { t, Toast } from './components/ui'

function BottomNav({ active, onTab }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#111', borderTop: `1px solid ${t.border}`,
      display: 'flex', zIndex: 50,
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      {[
        { id: 'library', label: 'Kirjasto', icon: '⊟' },
        { id: 'add', label: 'Lisää', icon: '⊕' }
      ].map(tab => (
        <button key={tab.id} onClick={() => onTab(tab.id)}
          style={{
            flex: 1, padding: '12px 0 10px', background: 'none', border: 'none',
            cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            borderTop: active === tab.id ? `2px solid ${t.accent}` : '2px solid transparent'
          }}>
          <span style={{ fontSize: 20, color: active === tab.id ? t.accent : t.muted }}>{tab.icon}</span>
          <span style={{ fontSize: 9, letterSpacing: 2, color: active === tab.id ? t.accent : t.muted, fontFamily: t.font, textTransform: 'uppercase' }}>
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  )
}

export default function App() {
  const { library, loading, saving, addDetail, deleteDetail } = useLibrary()
  const [tab, setTab] = useState('library')
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState(null)

  const notify = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const handleSave = async (detail) => {
    const res = await addDetail(detail)
    if (res.success) {
      notify('Detalji tallennettu ✓')
      setTab('library')
    } else {
      notify('Tallennus epäonnistui', 'error')
    }
  }

  const handleDelete = async (id) => {
    const res = await deleteDetail(id)
    if (res.success) notify('Poistettu')
    else notify('Poisto epäonnistui', 'error')
  }

  return (
    <div style={{
      width: '100%', maxWidth: 480, margin: '0 auto',
      minHeight: '100dvh', background: t.bg,
      display: 'flex', flexDirection: 'column',
      fontFamily: t.font, color: t.text
    }}>
      {/* Header */}
      <header style={{
        padding: '14px 16px 12px', background: '#111',
        borderBottom: `1px solid ${t.border}`,
        display: 'flex', alignItems: 'baseline', gap: 10,
        paddingTop: 'calc(14px + env(safe-area-inset-top))'
      }}>
        <span style={{ fontSize: 9, letterSpacing: 4, color: '#555', textTransform: 'uppercase' }}>Studio HM</span>
        <span style={{ color: '#222' }}>|</span>
        <span style={{ fontSize: 11, letterSpacing: 2, color: t.accent, textTransform: 'uppercase' }}>Detaljikirjasto</span>
        {saving && <span style={{ marginLeft: 'auto', fontSize: 9, color: t.faint, letterSpacing: 1 }}>Tallennetaan...</span>}
      </header>

      {/* Screen routing */}
      {selected ? (
        <DetailScreen
          detail={selected}
          onBack={() => setSelected(null)}
          onDelete={async (id) => { await handleDelete(id); setSelected(null) }}
        />
      ) : tab === 'library' ? (
        <LibraryScreen library={library} loading={loading} onSelect={setSelected} />
      ) : (
        <AddScreen onSave={handleSave} />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
      {!selected && <BottomNav active={tab} onTab={setTab} />}
    </div>
  )
}
