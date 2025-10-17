import React from 'react'
import { useAuth } from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const { userAuth, checkAuth } = useAuth();
    const navigate = useNavigate();
    const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);

    React.useEffect(() => {
        const verifyAuth = async () => {
            await checkAuth(); // Wait for auth check to complete
            setIsCheckingAuth(false);
        };

        verifyAuth();
    }, [checkAuth]);

    React.useEffect(() => {
        if (!isCheckingAuth && !userAuth) {
            return navigate('/login');
        }
    }, [userAuth, isCheckingAuth, navigate]);

    if (isCheckingAuth) {
        return <div>Loading...</div>
    }

    return children;
}

export default ProtectedRoute