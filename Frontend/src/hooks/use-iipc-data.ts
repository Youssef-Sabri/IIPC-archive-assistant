import { useState, useEffect } from 'react'
import { supabase, IIPCData } from '@/lib/supabase'

export const useIIPCData = () => {
  const [data, setData] = useState<IIPCData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { data: iipcData, error: fetchError } = await supabase
          .from('iipc_data')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100) // Limit to prevent overwhelming the UI

        if (fetchError) {
          throw fetchError
        }

        setData(iipcData || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
        console.error('Error fetching IIPC data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

// Hook for getting statistics
export const useIIPCStats = () => {
  const [stats, setStats] = useState({
    totalMaterials: 0,
    uniqueAuthors: 0,
    yearsOfArchives: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get total count
        const { count: totalCount, error: countError } = await supabase
          .from('iipc_data')
          .select('*', { count: 'exact', head: true })

        if (countError) throw countError

        // Get unique creators
        const { data: creators, error: creatorsError } = await supabase
          .from('iipc_data')
          .select('creator')
          .not('creator', 'is', null)

        if (creatorsError) throw creatorsError

        const uniqueCreators = new Set(creators?.map(item => item.creator).filter(Boolean)).size

        // Calculate years of archives (simplified)
        const { data: dates, error: datesError } = await supabase
          .from('iipc_data')
          .select('date')
          .not('date', 'is', null)

        if (datesError) throw datesError

        const years = new Set(dates?.map(item => {
          const year = item.date?.split('-')[0]
          return year && !isNaN(Number(year)) ? year : null
        }).filter(Boolean)).size

        setStats({
          totalMaterials: totalCount || 0,
          uniqueAuthors: uniqueCreators,
          yearsOfArchives: years
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats')
        console.error('Error fetching IIPC stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}

// Hook for getting recent materials
export const useRecentMaterials = (limit = 6) => {
  const [materials, setMaterials] = useState<IIPCData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentMaterials = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data: recentData, error: fetchError } = await supabase
          .from('iipc_data')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit)

        if (fetchError) throw fetchError

        setMaterials(recentData || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recent materials')
        console.error('Error fetching recent materials:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentMaterials()
  }, [limit])

  return { materials, loading, error }
}

// Hook for getting item types and their counts
export const useItemTypes = () => {
  const [itemTypes, setItemTypes] = useState<{ type: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchItemTypes = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get all item types
        const { data: items, error: fetchError } = await supabase
          .from('iipc_data')
          .select('item_type')
          .not('item_type', 'is', null)

        if (fetchError) throw fetchError

        // Count occurrences of each item type
        const typeCounts = new Map<string, number>()
        items?.forEach(item => {
          const type = item.item_type?.toLowerCase() || 'unknown'
          typeCounts.set(type, (typeCounts.get(type) || 0) + 1)
        })

        // Convert to array and sort by count (descending)
        const sortedTypes = Array.from(typeCounts.entries())
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count)

        setItemTypes(sortedTypes)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch item types')
        console.error('Error fetching item types:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchItemTypes()
  }, [])

  return { itemTypes, loading, error }
} 