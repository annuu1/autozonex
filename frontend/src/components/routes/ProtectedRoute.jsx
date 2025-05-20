import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {Navigate} from "react-router-dom";

const ProtectedRoute = ({children})=>{
    const isLoggedIn = useContext(AuthContext).isAuthenticated;
    
    if (!isLoggedIn){
        return <Navigate to="/login" replace/>
    }
    return children;
}

export default ProtectedRoute;