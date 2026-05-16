const search = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) return
    setLoading(true); setError(null)
    try {
      const params = new URLSearchParams({
        key: YT_KEY,
        cx: GOOGLE_CX,
        q: searchQuery,
        searchType: 'image',
        num: 10,
        safe: 'active'
      })
      const url = `https://www.googleapis.com/customsearch/v1?${params}`
      console.log('Fetching:', url)
      const res = await fetch(url)
      const data = await res.json()
      console.log('Response:', JSON.stringify(data))
      if (!res.ok) throw new Error(data.error?.message || 'Haku epäonnistui')
      setImages(data.items || [])
    } catch (e) { setError('Haku epäonnistui: ' + e.message) }
    setLoading(false)
  }, [])
