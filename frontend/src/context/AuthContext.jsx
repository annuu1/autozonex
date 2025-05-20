import {createContext, useEffect, useState } from "react";
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //on appload check for token and fetch user
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            axios.get(`${import.meta.env.VITE_API_URL || ""}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res)=>{
                setUser(res.data.user);
                setIsAuthenticated(true);
            })
            .catch(()=>{
                localStorage.removeItem('token')
                setIsAuthenticated(false)
            })
            .finally(()=>{
                setLoading(false);
            })
        }
        else{
            setLoading(false);
        }
    }, [])

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        setUser(userData);
        setIsAuthenticated(true);
      };
    
      const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      };

      return <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
        {children}
        </AuthContext.Provider>
}