import React, { useEffect, useState } from 'react';

const Trending = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:5131/api' : 'https://geekzkai.onrender.com/api');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/posts/trending`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message || 'Unexpected Error');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 border rounded-xl mb-4" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="p-8 rounded-xl border border-red-500/30" style={{backgroundColor: 'var(--bg-secondary)'}}>
          <p className="text-red-500 text-lg mb-4">Error loading posts: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4" style={{color: 'var(--text-primary)'}}>Trending Posts</h1>
        <div className="p-8 rounded-xl border" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}>
          <p className="text-lg mb-4" style={{color: 'var(--text-primary)'}}>No trending posts yet!</p>
          <p style={{color: 'var(--text-secondary)'}}>Be the first to create engaging content that gets the community talking.</p>
          <div className="mt-6">
            <a href="/create" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all">
              Create First Post
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8" style={{color: 'var(--text-primary)'}}>🔥 Trending Posts</h1>
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="p-6 border rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}>
            <h2 className="text-xl font-semibold mb-3" style={{color: 'var(--text-primary)'}}>{post.question || post.title}</h2>
            <div className="flex items-center gap-4 text-sm mb-3" style={{color: 'var(--text-secondary)'}}>
              <span>By {post.user?.username || 'Anonymous'}</span>
              <span>•</span>
              <span>{post.comments?.length || 0} comments</span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="leading-relaxed" style={{color: 'var(--text-primary)'}}>
              {(post.description || post.content)?.slice(0, 200)}
              {(post.description || post.content)?.length > 200 ? '...' : ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trending;
