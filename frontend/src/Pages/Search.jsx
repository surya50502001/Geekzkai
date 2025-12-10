import React, { useState, useEffect } from 'react'
import { Search as SearchIcon, TrendingUp, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import API_BASE_URL from '../apiConfig'
import FollowButton from '../Components/FollowButton'
import ChatButton from '../Components/ChatButton'

function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [allPosts, setAllPosts] = useState([])
  const [trendingPosts, setTrendingPosts] = useState([])
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    fetchAllPosts()
    fetchTrendingPosts()
  }, [])

  const fetchAllPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`)
      if (response.ok) {
        const data = await response.json()
        setAllPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const fetchTrendingPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/trending`)
      if (response.ok) {
        const data = await response.json()
        setTrendingPosts(data)
      }
    } catch (error) {
      console.error('Error fetching trending posts:', error)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    // Filter posts based on query
    const filtered = allPosts.filter(post => 
      post.question.toLowerCase().includes(query.toLowerCase()) ||
      post.description.toLowerCase().includes(query.toLowerCase()) ||
      post.user?.username.toLowerCase().includes(query.toLowerCase())
    )
    setResults(filtered)
    setLoading(false)
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

      {!loading && query && results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4" style={{color: 'var(--text-primary)'}}>Search Results</h2>
          <div className="space-y-4">
            {results.map((post) => (
              <div key={post.id} className="rounded-xl shadow-lg border p-6" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                    {post.user?.username?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <h4 className="font-semibold" style={{color: 'var(--text-primary)'}}>{post.user?.username || 'Anonymous'}</h4>
                    <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <h3 className="font-semibold mb-2" style={{color: 'var(--text-primary)'}}>{post.question}</h3>
                <p className="mb-4" style={{color: 'var(--text-secondary)'}}>{post.description}</p>
                {post.user && (
                  <div className="flex gap-2">
                    <FollowButton userId={post.user.id} username={post.user.username} />
                    <ChatButton userId={post.user.id} username={post.user.username} onChatOpen={(user) => console.log('Open chat with:', user)} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!query && (
        <div>
          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6 border-b" style={{borderColor: 'var(--border-color)'}}>
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-2 px-1 font-medium transition-colors ${
                activeTab === 'all' ? 'border-b-2 border-purple-500' : ''
              }`}
              style={{color: activeTab === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)'}}
            >
              <div className="flex items-center gap-2">
                <Globe size={16} />
                All Posts
              </div>
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`pb-2 px-1 font-medium transition-colors ${
                activeTab === 'trending' ? 'border-b-2 border-purple-500' : ''
              }`}
              style={{color: activeTab === 'trending' ? 'var(--text-primary)' : 'var(--text-secondary)'}}
            >
              <div className="flex items-center gap-2">
                <TrendingUp size={16} />
                Trending
              </div>
            </button>
          </div>

          {/* Posts Display */}
          <div className="space-y-4">
            {(activeTab === 'all' ? allPosts : trendingPosts).map((post) => (
              <div key={post.id} className="rounded-xl shadow-lg border p-6" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                    {post.user?.username?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <h4 className="font-semibold" style={{color: 'var(--text-primary)'}}>{post.user?.username || 'Anonymous'}</h4>
                    <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <h3 className="font-semibold mb-2" style={{color: 'var(--text-primary)'}}>{post.question}</h3>
                <p className="mb-4" style={{color: 'var(--text-secondary)'}}>{post.description}</p>
                {post.user && (
                  <div className="flex gap-2">
                    <FollowButton userId={post.user.id} username={post.user.username} />
                    <ChatButton userId={post.user.id} username={post.user.username} onChatOpen={(user) => console.log('Open chat with:', user)} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Search