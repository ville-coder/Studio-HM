import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase'

export function useLibrary() {
  const [library, setLibrary] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('detaljit')
        .select('*')
        .order('lisatty', { ascending: false })
      if (error) throw error
      setLibrary(data || [])
    } catch (e) {
      setError('Kirjaston lataus epäonnistui: ' + e.message)
      console.error(e)
    }
    setLoading(false)
  }, [])

  const addDetail = useCallback(async (detail) => {
    setSaving(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('detaljit')
        .insert([detail])
        .select()
        .single()
      if (error) throw error
      setLibrary(prev => [data, ...prev])
      return { success: true }
    } catch (e) {
      setError('Tallennus epäonnistui: ' + e.message)
      return { success: false, error: e.message }
    } finally {
      setSaving(false)
    }
  }, [])

  const deleteDetail = useCallback(async (id) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('detaljit')
        .delete()
        .eq('id', id)
      if (error) throw error
      setLibrary(prev => prev.filter(d => d.id !== id))
      return { success: true }
    } catch (e) {
      setError('Poisto epäonnistui: ' + e.message)
      return { success: false }
    } finally {
      setSaving(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // Realtime subscription – päivittyy automaattisesti jos toinen laite lisää detaljin
  useEffect(() => {
    const channel = supabase
      .channel('detaljit-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'detaljit' }, (payload) => {
        setLibrary(prev => {
          if (prev.find(d => d.id === payload.new.id)) return prev
          return [payload.new, ...prev]
        })
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'detaljit' }, (payload) => {
        setLibrary(prev => prev.filter(d => d.id !== payload.old.id))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return { library, loading, saving, error, addDetail, deleteDetail, reload: load }
}
