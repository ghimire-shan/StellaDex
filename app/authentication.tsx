import Auth from '../screens/Auth';
import Account from '../screens/Account';
import { useAuth } from '../contexts/AuthContext';

export default function AuthenticationRoute() {
    const { session } = useAuth();
    
    return session? <Account session={session} /> :<Auth />;
}