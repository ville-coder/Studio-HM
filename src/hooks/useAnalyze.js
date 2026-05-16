import { useState } from 'react'

const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

export function useAnalyze() {
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState(null)

  const analyze = async (imageData, mediaType, fileName, context = '') => {
    setAnalyzing(true)
    setError(null)

    try {
      const base64 = imageData.split(',')[1]
      const isPDF = mediaType === 'application/pdf'

      const imageContent = isPDF
        ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } }
        : { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } }

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 1500,
          system: 'Olet suomalainen rakennustekniikan asiantuntija (LVIS + arkkitehtuuri). Analysoi rakennusdetalji ja palauta VAIN JSON ilman markdown-koodiblokeja.',
          messages: [{
            role: 'user',
            content: [
              imageContent,
              {
                type: 'text',
                text: `${context ? `Käyttäjän konteksti ja tavoite: "${context}"\n\n` : ''}Analysoi tämä rakennusdetalji ja palauta JSON-objekti:
{
  "nimi": "Detaljin lyhyt nimi suomeksi",
  "kuvaus": "1-2 lauseen kuvaus",
  "jarjestelma": "Yksi seuraavista: Rakenne / Vaippa / Perustukset / LVI / Sähkö / Paloturvallisuus",
  "alaluokka": "Sopiva alaluokka järjestelmälle",
  "rtKortit": ["RT XX-XXXXX"],
  "sfsStandardit": ["SFS-EN XXXX"],
  "valmistajat": [{"nimi": "...", "tuote": "...", "url": "...", "puhelin": "..."}],
  "asennusohjeet": [{"lahde": "...", "url": "..."}],
  "videot": [{"otsikko": "...", "url": "...", "alusta": "YouTube/Web"}],
  "avainsanat": ["...", "..."]
}`
              }
            ]
          }],
          tools: [{ type: 'web_search_20250305', name: 'web_search' }]
        })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || `HTTP ${res.status}`)
      }

      const data = await res.json()
      const text = data.content?.find(b => b.type === 'text')?.text || ''
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())

      return {
        success: true,
        detail: {
          ...parsed,
          tiedosto_nimi: fileName,
          lisatty: new Date().toISOString(),
          kuva: imageData
        }
      }
    } catch (e) {
      setError('Analyysi epäonnistui: ' + e.message)
      return { success: false, error: e.message }
    } finally {
      setAnalyzing(false)
    }
  }

  return { analyze, analyzing, error }
}
