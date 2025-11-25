import React, { useEffect, useState } from 'react';

const Trending = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts/trending');
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
    return <div>Loading trending posts...</div>;
  }

  if (error) {
    return <div>Error loading posts: {error}</div>;
  }

  if (posts.length === 0) {
    return <div>No trending posts available.</div>;
  }

  return (
    <div className="trending-container">
      <h1 className="text-2xl font-bold mb-4">Trending Posts</h1>
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.id} className="p-4 border rounded shadow-sm">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600">
              By {post.user?.username || 'Unknown'} | {post.comments?.length || 0} comments
            </p>
            <p className="text-gray-500 text-sm">Posted on {new Date(post.createdAt).toLocaleDateString()}</p>
            <p className="mt-2">{post.content?.slice(0, 150)}{post.content?.length > 150 ? '...' : ''}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Trending;
