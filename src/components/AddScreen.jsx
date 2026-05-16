import { useState, useRef } from 'react'
import { t, Tag, Btn, Spinner } from './ui'
import { useAnalyze } from '../hooks/useAnalyze'

export default function AddScreen({ onSave }) {
  const [step, setStep] = useState('capture') // capture | preview | result
  const [imageData, setImageData] = useState(null)
  const [mediaType, setMediaType] = useState('image/jpeg')
  const [fileName, setFileName] = useState('')
  const [result, setResult] = useState(null)
  const fileRef = useRef()
  const cameraRef = useRef()
  const { analyze, analyzing, error } = useAnalyze()

  const handleFile = (file) => {
    if (!file) return
    setFileName(file.name)
    setMediaType(file.type || 'image/jpeg')
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImageData(ev.target.result)
      setStep('preview')
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    const res = await analyze(imageData, mediaType, fileName)
    if (res.success) {
      setResult(res.detail)
      setStep('result')
    }
  }

  const reset = () => {
    setStep('capture')
    setImageData(null)
    setResult(null)
    setFileName('')
    if (fileRef.current) fileRef.current.value = ''
    if (cameraRef.current) cameraRef.current.value = ''
  }

  if (step === 'capture') return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, paddingBottom: 80 }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: t.dim, textTransform: 'uppercase', marginBottom: 8 }}>Uusi Detalji</div>

      <button onClick={() => cameraRef.current?.click()}
        style={{ width: '100%', maxWidth: 360, padding: '28px 20px', background: t.surface, border: '1px solid #2a2a2a', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <input ref={cameraRef} type="file" accept="image/*" capture="environment"
          onChange={e => handleFile(e.target.files[0])} style={{ display: 'none' }} />
        <span style={{ fontSize: 36 }}>📷</span>
        <span style={{ fontSize: 11, color: t.muted, letterSpacing: 2, textTransform: 'uppercase' }}>Kameralla</span>
        <span style={{ fontSize: 10, color: t.faint }}>Kuvaa detalji suoraan</span>
      </button>

      <button onClick={() => fileRef.current?.click()}
        style={{ width: '100%', maxWidth: 360, padding: 20, background: 'transparent', border: '1px dashed #2a2a2a', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <input ref={fileRef} type="file" accept="image/*,.pdf"
          onChange={e => handleFile(e.target.files[0])} style={{ display: 'none' }} />
        <span style={{ fontSize: 24, color: t.faint }}>⊕</span>
        <span style={{ fontSize: 11, color: t.muted, letterSpacing: 1 }}>Valitse tiedosto</span>
        <span style={{ fontSize: 10, color: t.faint }}>JPG · PNG · PDF</span>
      </button>
    </div>
  )

  if (step === 'preview') return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80, padding: 16 }}>
      <div style={{ fontSize: 9, letterSpacing: 3, color: t.dim, textTransform: 'uppercase', marginBottom: 16 }}>Esikatselu</div>
      <img src={imageData} alt="preview"
        style={{ width: '100%', maxHeight: 340, objectFit: 'contain', background: '#0a0a0a', display: 'block', marginBottom: 12 }} />
      <div style={{ fontSize: 10, color: t.faint, marginBottom: 20 }}>{fileName}</div>

      {analyzing
        ? <Spinner label="Analysoidaan... Haetaan RT-kortit, valmistajat & videot" />
        : <>
            <Btn onClick={handleAnalyze}>Analysoi Detalji</Btn>
            {error && <div style={{ marginTop: 10, fontSize: 11, color: '#f08080' }}>{error}</div>}
            <div style={{ height: 10 }} />
            <Btn onClick={reset} variant="ghost">Vaihda tiedosto</Btn>
          </>
      }
    </div>
  )

  if (step === 'result' && result) return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: t.dim, textTransform: 'uppercase', marginBottom: 16 }}>Analyysin tulos</div>

        <div style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: t.accent, marginBottom: 6, textTransform: 'uppercase' }}>
            {result.jarjestelma} › {result.alaluokka}
          </div>
          <div style={{ fontSize: 15, color: t.text, marginBottom: 6 }}>{result.nimi}</div>
          <div style={{ fontSize: 11, color: t.muted, lineHeight: 1.5, marginBottom: 12 }}>{result.kuvaus}</div>

          <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 10 }}>
            {result.rtKortit?.map(r => <Tag key={r}>{r}</Tag>)}
            {result.sfsStandardit?.map(s => <Tag key={s} accent>{s}</Tag>)}
          </div>

          <div style={{ fontSize: 10, color: t.faint }}>
            {result.valmistajat?.length || 0} valmistajaa · {result.asennusohjeet?.length || 0} asennusohjetta · {result.videot?.length || 0} videota
          </div>
        </div>

        <img src={imageData} alt="" style={{ width: '100%', maxHeight: 180, objectFit: 'contain', background: '#0a0a0a', display: 'block', marginBottom: 16 }} />

        <Btn onClick={() => onSave({
          nimi: result.nimi,
          kuvaus: result.kuvaus,
          jarjestelma: result.jarjestelma,
          alaluokka: result.alaluokka,
          rt_kortit: result.rtKortit || [],
          sfs_standardit: result.sfsStandardit || [],
          valmistajat: result.valmistajat || [],
          asennusohjeet: result.asennusohjeet || [],
          videot: result.videot || [],
          avainsanat: result.avainsanat || [],
          tiedosto_nimi: result.tiedosto_nimi,
          lisatty: result.lisatty,
          kuva: result.kuva
        })}>Tallenna Kirjastoon →</Btn>
        <div style={{ height: 10 }} />
        <Btn onClick={reset} variant="ghost">Hylkää</Btn>
      </div>
    </div>
  )

  return null
}
