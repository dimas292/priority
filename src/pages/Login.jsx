import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const { user, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);


    return (
        <div className="login-page-container">
            <div className="login-card">
                <h1 className="login-title">LOGIN</h1>

                <div className="login-form" style={{ alignItems: 'center' }}>
                    <p style={{ marginBottom: '20px', fontSize: '1.2rem', textAlign: 'center' }}>
                        Welcome to PRIORITY. <br /> Please login to continue.
                    </p>

                    <button
                        type="button"
                        className="sketch-button"
                        style={{ backgroundColor: '#fff', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}
                        onClick={loginWithGoogle}
                    >
                        <img src="google (1).png" alt="G" style={{ width: '24px', height: '24px' }} />
                        Login with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;