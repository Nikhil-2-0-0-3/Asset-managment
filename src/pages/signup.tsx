import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
  
      // Validation
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
  
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
  
      try {
        setLoading(true);
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/'); // Redirect to home after successful signup
      } catch (err) {
        setError(getFirebaseError(err));
      } finally {
        setLoading(false);
      }
    };
  
    const getFirebaseError = (error: any) => {
      switch (error.code) {
        case 'auth/email-already-in-use':
          return 'Email already in use';
        case 'auth/invalid-email':
          return 'Invalid email address';
        case 'auth/weak-password':
          return 'Password is too weak';
        default:
          return 'Signup failed. Please try again.';
      }
    };
  
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Sign Up</h2>
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
  
          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
  
          <button 
            type="submit" 
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
          <p
          onClick={()=>{navigate('/login')}}
          >Already a user?</p>
        </form>
      </div>
    );
  };

// Styles
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
    },
    ':disabled': {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed'
    }
  },
  error: {
    color: 'red',
    textAlign: 'center' as const,
    marginBottom: '15px'
  }
};

export default SignupPage;