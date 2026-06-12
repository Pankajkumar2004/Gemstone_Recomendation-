import React, { useState } from 'react';
import { Lock } from 'lucide-react';

function AdminAuth({ onAuthenticate }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple hardcoded password for demo
    if (password === 'admin123') {
      onAuthenticate();
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-100 dark:bg-primary-900 p-4 rounded-full">
              <Lock className="h-12 w-12 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
            Admin Access
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            Enter admin password to continue
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="input-field"
                required
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
            )}
            <button type="submit" className="w-full btn-primary">
              Access Admin Panel
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Demo password: admin123
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminAuth;
