import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Make sure to create this CSS file

const Login = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const emailRef = useRef();
    const passwordRef = useRef();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            console.error(error);
            alert("Login failed!");
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-card">
                <h1 className="login-title">LOGIN</h1>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>email</label>
                        <input type="email" ref={emailRef} required className="sketch-input" />
                    </div>

                    <div className="form-group">
                        <label>password</label>
                        <div className="input-wrapper">
                            <input type="password" ref={passwordRef} required className="sketch-input" />
                            <span className="password-icon">◆</span>
                        </div>
                    </div>

                    <button type="submit" className="sketch-button">login</button>
                </form>

                <p className="footer-text">
                    dont have an account?, <Link to="/register" className="register-link">register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;