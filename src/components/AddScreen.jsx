import { useState, useRef } from 'react'
import { t, Tag, Btn, Spinner } from './ui'
import { useAnalyze } from '../hooks/useAnalyze'

function VoiceInput({ value, onChange }) {
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const recognitionRef = useRef(null)
  const finalRef = useRef('')

  const toggleListen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { alert('Selaimesi ei tue puheentunnistusta. Kirjoita teksti kenttään.'); return }
    if (listening) { recognitionRef.current?.stop(); setListening(false); setInterim(''); return }
    finalRef.current = value || ''
    const recognition = new SpeechRecognition()
    recognition.lang = 'fi-FI'
    recognition.continuous = true
    recognition.interimResults = true
    recognitionRef.current = recognition
    recognition.onresult = (e) => {
      let interimText = '', newFinal = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const tr = e.results[i][0].transcript
        if (e.results[i].isFinal) { newFinal += tr + ' ' } else { interimText += tr }
      }
      if (newFinal) { finalRef.current = (finalRef.current + newFinal).trim(); onChange(finalRef.current) }
      setInterim(interimText)
    }
    recognition.onend = () => { setListening(false); setInterim('') }
    recognition.onerror = () => { setListening(false); setInterim('') }
    recognition.start()
    setListening(true)
  }

  const displayValue = value + (interim ? (value ? ' ' : '') + interim : '')

  const handleTextChange = (e) => {
    finalRef.current = e.target.value
    onChange(e.target.value)
    setInterim('')
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 9, letterSpacing: 3, color: t.dim, textTransform: 'uppercase', marginBottom: 8, fontFamily: t.font }}>
        Konteksti (valinnainen)
      </div>
      <div style={{ position: 'relative' }}>
        <textarea
          value={displayValue}
          onChange={handleTextChange}
          placeholder={listening ? 'Kuuntelee – puhu nyt...' : 'Kirjoita tai puhu selitys tähän...'}
          rows={4}
          style={{
            width: '100%', background: '#fff',
            border: `1px solid ${listening ? t.accentLight : t.border}`,
            color: t.text, padding: '10px 48px 10px 12px', fontSize: 12,
            fontFamily: t.font, outline: 'none', resize: 'none',
            lineHeight: 1.6, letterSpacing: 0.3, transition: 'border-color 0.2s',
            boxSizing: 'border-box', WebkitAppearance: 'none', borderRadius: 0
          }}
        />
        <button onClick={toggleListen}
          style={{
            position: 'absolute', right: 8, top: 8, width: 32, height: 32, borderRadius: '50%',
            background: listening ? t.accent : t.bg,
            border: `1px solid ${listening ? t.accent : t.border}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
          }}
          title={listening ? 'Lopeta puhuminen' : 'Puhu selitys'}
        >{listening ? '⏹' : '🎤'}</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', background: t.bg, border: `1px solid ${t.border}`, borderTop: 'none' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: listening ? '#c0392b' : t.faint, animation: listening ? 'blink 1s infinite' : 'none' }} />
        <span style={{ fontSize: 9, color: listening ? '#c0392b' : t.dim, letterSpacing: 1, fontFamily: t.font }}>
          {listening ? 'KUUNTELEE – PUHU TAI KIRJOITA' : 'PAINA 🎤 TAI KIRJOITA'}
        </span>
        {value && <button onClick={() => { onChange(''); finalRef.current = ''; setInterim('') }}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: t.dim, cursor: 'pointer', fontSize: 10, fontFamily: t.font }}>Tyhjennä</button>}
      </div>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  )
}

export default function AddScreen({ onSave }) {
  const [step, setStep] = useState('capture')
  const [imageData, setImageData] = useState(null)
  const [mediaType, setMediaType] = useState('image/jpeg')
  const [fileName, setFileName] = useState('')
  const [context, setContext] = useState('')
  const [result, setResult] = useState(null)
  const fileRef = useRef()
  const cameraRef = useRef()
  const { analyze, analyzing, error } = useAnalyze()

  const handleFile = (file) => {
    if (!file) return
    setFileName(file.name); setMediaType(file.type || 'image/jpeg')
    const reader = new FileReader()
    reader.onload = (ev) => { setImageData(ev.target.result); setStep('preview') }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    const res = await analyze(imageData, mediaType, fileName, context)
    if (res.success) { setResult(res.detail); setStep('result') }
  }

  const reset = () => {
    setStep('capture'); setImageData(null); setResult(null); setFileName(''); setContext('')
    if (fileRef.current) fileRef.current.value = ''
    if (cameraRef.current) cameraRef.current.value = ''
  }

  if (step === 'capture') return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, paddingBottom: 80, background: t.bg }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: t.dim, textTransform: 'uppercase', marginBottom: 8, fontFamily: t.font }}>Uusi Detalji</div>
      <button onClick={() => cameraRef.current?.click()}
        style={{ width: '100%', maxWidth: 360, padding: '28px 20px', background: '#fff', border: `1px solid ${t.border}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={e => handleFile(e.target.files[0])} style={{ display: 'none' }} />
        <span style={{ fontSize: 36 }}>📷</span>
        <span style={{ fontSize: 11, color: t.text, letterSpacing: 2, textTransform: 'uppercase', fontFamily: t.font }}>Kameralla</span>
        <span style={{ fontSize: 10, color: t.muted, fontFamily: t.font }}>Kuvaa detalji suoraan</span>
      </button>
      <button onClick={() => fileRef.current?.click()}
        style={{ width: '100%', maxWidth: 360, padding: 20, background: 'transparent', border: `1px dashed ${t.border}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={e => handleFile(e.target.files[0])} style={{ display: 'none' }} />
        <span style={{ fontSize: 24, color: t.dim }}>⊕</span>
        <span style={{ fontSize: 11, color: t.muted, letterSpacing: 1, fontFamily: t.font }}>Valitse tiedosto</span>
        <span style={{ fontSize: 10, color: t.faint, fontFamily: t.font }}>JPG · PNG · PDF</span>
      </button>
    </div>
  )

  if (step === 'preview') return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80, padding: 16, background: t.bg }}>
      <div style={{ fontSize: 9, letterSpacing: 3, color: t.dim, textTransform: 'uppercase', marginBottom: 16, fontFamily: t.font }}>Esikatselu</div>
      <img src={imageData} alt="preview" style={{ width: '100%', maxHeight: 260, objectFit: 'contain', background: '#f8f6f2', display: 'block', marginBottom: 16, border: `1px solid ${t.border}` }} />
      <div style={{ fontSize: 10, color: t.dim, marginBottom: 16, fontFamily: t.font }}>{fileName}</div>
      <VoiceInput value={context} onChange={setContext} />
      {analyzing
        ? <Spinner label="Analysoidaan... Haetaan RT-kortit, valmistajat & videot" />
        : <>
            <Btn onClick={handleAnalyze}>Analysoi Detalji</Btn>
            {error && <div style={{ marginTop: 10, fontSize: 11, color: t.error, fontFamily: t.font }}>{error}</div>}
            <div style={{ height: 10 }} />
            <Btn onClick={reset} variant="ghost">Vaihda tiedosto</Btn>
          </>
      }
    </div>
  )

  if (step === 'result' && result) return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80, background: t.bg }}>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: t.dim, textTransform: 'uppercase', marginBottom: 16, fontFamily: t.font }}>Analyysin tulos</div>
        <div style={{ background: '#fff', border: `1px solid ${t.border}`, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: t.accent, marginBottom: 6, textTransform: 'uppercase', fontFamily: t.font }}>{result.jarjestelma} › {result.alaluokka}</div>
          <div style={{ fontSize: 15, color: t.text, marginBottom: 6, fontFamily: t.font }}>{result.nimi}</div>
          <div style={{ fontSize: 11, color: t.muted, lineHeight: 1.6, marginBottom: 12, fontFamily: t.font }}>{result.kuvaus}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 10 }}>
            {result.rtKortit?.map(r => <Tag key={r}>{r}</Tag>)}
            {result.sfsStandardit?.map(s => <Tag key={s} accent>{s}</Tag>)}
          </div>
          <div style={{ fontSize: 10, color: t.dim, fontFamily: t.font }}>
            {result.valmistajat?.length || 0} valmistajaa · {result.asennusohjeet?.length || 0} asennusohjetta · {result.videot?.length || 0} videota
          </div>
        </div>
        {context && (
          <div style={{ padding: '10px 12px', background: '#fff', border: `1px solid ${t.border}`, marginBottom: 16 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: t.dim, textTransform: 'uppercase', marginBottom: 4, fontFamily: t.font }}>Konteksti</div>
            <div style={{ fontSize: 11, color: t.muted, fontStyle: 'italic', fontFamily: t.font }}>{context}</div>
          </div>
        )}
        <img src={imageData} alt="" style={{ width: '100%', maxHeight: 180, objectFit: 'contain', background: '#f8f6f2', display: 'block', marginBottom: 16, border: `1px solid ${t.border}` }} />
        <Btn onClick={() => onSave({
          nimi: result.nimi, kuvaus: result.kuvaus, jarjestelma: result.jarjestelma, alaluokka: result.alaluokka,
          rt_kortit: result.rtKortit || [], sfs_standardit: result.sfsStandardit || [],
          valmistajat: result.valmistajat || [], asennusohjeet: result.asennusohjeet || [],
          videot: result.videot || [], avainsanat: result.avainsanat || [],
          tiedosto_nimi: result.tiedosto_nimi, lisatty: result.lisatty, kuva: result.kuva, konteksti: context || null
        })}>Tallenna Kirjastoon →</Btn>
        <div style={{ height: 10 }} /><Btn onClick={reset} variant="ghost">Hylkää</Btn>
      </div>
    </div>
  )
  return null
}
