import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {Navigate} from "react-router-dom";

const ProtectedRoute = ({children})=>{
    const { isAuthenticated, loading } = useContext(AuthContext);
    
    console.log("isAuthenticated:", isAuthenticated, "loading:", loading);

    if (loading) {
        return <div>Loading...</div>; // Or a spinner/loading component
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default ProtectedRoute;