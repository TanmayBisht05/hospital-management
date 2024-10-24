import { createContext, useState, useEffect, useRef } from 'react';
const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
    let [pdashboardState, setPdashboardState] = useState(0);
    let contextData = {
        pdashboardState,
        setPdashboardState
    };
    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}