import React, { useState } from 'react'
import { Search as SearchIcon, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    // TODO: Implement actual search API call
    setTimeout(() => {
      setResults([])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
      <h1 className="text-2xl font-bold mb-6" style={{color: 'var(--text-primary)'}}>Search</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <SearchIcon 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2" 
            style={{color: 'var(--text-secondary)'}} 
          />
          <input
            type="text"
            placeholder="Search discussions, users, topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)'}}
          />
        </div>
      </form>

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

      {!query && (
        <div>
          {/* Trending Section */}
          <div className="mb-8">
            <Link to="/trending" className="block p-4 rounded-lg border hover:bg-opacity-80 transition-colors" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp size={20} style={{color: 'var(--text-primary)'}} />
                  <div>
                    <h3 className="font-medium" style={{color: 'var(--text-primary)'}}>Trending</h3>
                    <p className="text-sm" style={{color: 'var(--text-secondary)'}}>See what's popular right now</p>
                  </div>
                </div>
                <span style={{color: 'var(--text-secondary)'}}>→</span>
              </div>
            </Link>
          </div>
          
          <div className="text-center py-8">
            <SearchIcon size={48} className="mx-auto mb-4" style={{color: 'var(--text-secondary)'}} />
            <p style={{color: 'var(--text-secondary)'}}>Start typing to search for discussions, users, and topics</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search