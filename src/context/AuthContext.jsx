import { createContext, useState, useEffect, useContext } from 'react';
import { account } from '../lib/appwrite';
import { ID } from 'appwrite';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkUserStatus();
    }, []);

    const checkUserStatus = async () => {
        try {
            const accountDetails = await account.get();
            setUser(accountDetails);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            await account.createEmailPasswordSession(email, password);
            await checkUserStatus();
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userInfo) => {
        setLoading(true);
        try {
            await account.create(ID.unique(), userInfo.email, userInfo.password, userInfo.name);
            await login(userInfo.email, userInfo.password);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const logout = async () => {
        setLoading(true);
        try {
            await account.deleteSession('current');
            setUser(null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        setLoading(true);
        try {
            account.createOAuth2Session(
                'google',
                `${window.location.origin}/`,
                `${window.location.origin}/login`,
            );
        } catch (error) {
            console.error("Google Login Failed:", error);
            setLoading(false);
        }
    };

    const getProviderAccessToken = async () => {
        try {
            const session = await account.getSession('current');
            return session.providerAccessToken;
        } catch (error) {
            return null;
        }
    };

    const contextData = {
        user,
        login,
        register,
        logout,
        loginWithGoogle,
        getProviderAccessToken,
        loading
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', flexDirection: 'column', gap: '20px' }}>
                    <img src="/priority.png" alt="Loading..." style={{ width: '150px', height: 'auto' }} />
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => { return useContext(AuthContext) };

export default AuthContext;
