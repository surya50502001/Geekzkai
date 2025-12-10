import React from 'react'
import UpdateProfile from '../Components/UpdateProfile'
import { useTheme } from '../Context/ThemeContext'
import { useAuth } from '../Context/AuthContext'
import { User } from 'lucide-react'
import { Link } from 'react-router-dom'

function Settings() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-8" style={{color: 'var(--text-primary)'}}>Settings</h1>
      
      <div className="space-y-6">
        {/* Theme */}
        <div className="p-4 rounded-lg border" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium" style={{color: 'var(--text-primary)'}}>Theme</h3>
              <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Choose light or dark mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg border transition-colors"
              style={{backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)'}}
            >
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>

        {/* Profile - Only for logged in users */}
        {user && (
          <Link to="/profile" className="block p-4 rounded-lg border hover:bg-opacity-80 transition-colors" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User size={20} style={{color: 'var(--text-primary)'}} />
                <div>
                  <h3 className="font-medium" style={{color: 'var(--text-primary)'}}>Profile</h3>
                  <p className="text-sm" style={{color: 'var(--text-secondary)'}}>View and edit your profile</p>
                </div>
              </div>
              <span style={{color: 'var(--text-secondary)'}}>→</span>
            </div>
          </Link>
        )}

        {/* Sign in prompt */}
        {!user && (
          <div className="p-6 rounded-lg border text-center" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}>
            <p className="mb-4" style={{color: 'var(--text-secondary)'}}>
              Sign in to access profile settings and more options
            </p>
            <a 
              href="/login" 
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings