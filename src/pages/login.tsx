import { useState } from 'react';
import { signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth } from '../../config';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/addusers');
    } catch (err) {
      const error = err as AuthError;
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Try again later.');
          break;
        default:
          setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      {error && <p style={styles.error}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={loading ? {...styles.button, ...styles.disabledButton} : styles.button}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <p style={styles.linkText} onClick={() => navigate('/signup')}>
          Don't have an account? Sign up
        </p>
      </form>
    </div>
  );
};

// Styles (consistent with SignupPage)
const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    textAlign: 'center' as const,
    color: '#333',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '5px'
  },
  label: {
    fontSize: '14px',
    color: '#555'
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px'
  },
  button: {
    padding: '12px',
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
    ':hover': {
      backgroundColor: '#3367d6'
    }
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed'
  },
  error: {
    color: 'red',
    textAlign: 'center' as const,
    marginBottom: '15px'
  },
  linkText: {
    textAlign: 'center' as const,
    color: '#4285f4',
    cursor: 'pointer',
    marginTop: '10px',
    ':hover': {
      textDecoration: 'underline'
    }
  }
};

export default LoginPage;