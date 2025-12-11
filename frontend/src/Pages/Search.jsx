import React, { useState, useEffect } from 'react'
import { Search as SearchIcon, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import API_BASE_URL from '../apiConfig'

function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`${API_BASE_URL}/user/search?query=${encodeURIComponent(query)}`)
        if (response.ok) {
          const users = await response.json()
          setResults(users)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(searchUsers, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
      <h1 className="text-2xl font-bold mb-6" style={{color: 'var(--text-primary)'}}>Search</h1>
      
      <div className="mb-8">
        <div className="relative">
          <SearchIcon 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2" 
            style={{color: 'var(--text-secondary)'}} 
          />
          <input
            type="text"
            placeholder="Search by email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)'}}
          />
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2" style={{color: 'var(--text-secondary)'}}>Searching...</p>
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="text-center py-8">
          <p style={{color: 'var(--text-secondary)'}}>No results found for "{query}"</p>
        </div>
      )}

      {!loading && query && results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4" style={{color: 'var(--text-primary)'}}>People</h2>
          <div className="space-y-4">
            {results.map((user) => (
              <button
                key={user.id}
                onClick={() => navigate(`/user/${user.id}`)}
                className="w-full rounded-xl shadow-lg border p-6 hover:shadow-xl transition-shadow text-left"
                style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {user.profilePictureUrl ? (
                      <img src={user.profilePictureUrl} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <User size={24} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg" style={{color: 'var(--text-primary)'}}>{user.username}</h3>
                    {user.bio && (
                      <p className="text-sm mt-1" style={{color: 'var(--text-secondary)'}}>{user.bio}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {!query && (
        <div className="text-center py-12">
          <SearchIcon size={48} className="mx-auto mb-4" style={{color: 'var(--text-secondary)'}} />
          <h2 className="text-xl font-semibold mb-2" style={{color: 'var(--text-primary)'}}>Find People</h2>
          <p style={{color: 'var(--text-secondary)'}}>Search for people by their email</p>
        </div>
      )}
    </div>
  )
}

export default Search