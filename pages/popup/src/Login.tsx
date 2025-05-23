import { useAuthActions } from '@convex-dev/auth/react';
import { useState } from 'react';

interface LoginFormData {
  email: string;
  password: string;
  flow: 'signIn' | 'signUp';
}

export const Login = () => {
  const { signIn } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    flow: 'signIn',
  });
  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await signIn('password', formData as any);
    } catch {
      setError(`Failed to ${formData.flow === 'signIn' ? 'sign in' : 'sign up'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Toggle sign in/up
  const toggleFlow = () => {
    setFormData(prev => ({ ...prev, flow: prev.flow === 'sign  signIn' ? 'signUp' : 'signIn' }));
  };

  // Check site when user changes

  return (
    <div className="min-w-[300px] p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            disabled={isLoading}
            required
          />
        </div>
        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            disabled={isLoading}
            required
          />
        </div>
        <input name="flow" type="hidden" value={formData.flow} />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isLoading}>
            {formData.flow === 'signIn' ? 'Sign In' : 'Sign Up'}
          </button>
          <button
            type="button"
            onClick={toggleFlow}
            className="flex-1 bg-gray-200 p-2 rounded hover:bg-gray-300"
            disabled={isLoading}>
            {formData.flow === 'signIn' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </form>
    </div>
  );
};
