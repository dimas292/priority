import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const userInfo = { name, email, password };

        try {
            await register(userInfo);
            navigate('/');
        } catch (error) {
            console.error(error);
            alert("Registration failed!");
        }
    };

    return (
        <div className="register-page-container">
            <div className="register-card">
                <h1 className="register-title">REGISTER</h1>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label>name</label>
                        <input type="text" ref={nameRef} required className="sketch-input" />
                    </div>
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
                    <button type="submit" className="sketch-button">register</button>
                </form>
                <p className="footer-text">
                    already have an account?, <Link to="/login" className="login-link">login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
