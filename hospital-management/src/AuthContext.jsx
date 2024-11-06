import { createContext, useState, useEffect, useRef } from 'react';
const AuthContext = createContext();
import Cookies from 'js-cookie';
export default AuthContext;

export const AuthProvider = ({ children }) => {
    let [pdashboardState, setPdashboardState] = useState(0);
    let [cdashboardState, setCdashboardState] = useState(0);
    let [adashboardState, setAdashboardState] = useState(0);
    const backend_url = 'http://localhost:8080';
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState('');
    const [userId, setUserId] = useState(-1);
    const [userEmail, setUserEmail] = useState('');

    const shouldSetAuthenticated = useRef(true);
    useEffect(() => {
        if (shouldSetAuthenticated.current) {
            shouldSetAuthenticated.current = false;
            if (Cookies.get('token')) {
                setIsAuthenticated(true);
                setUserType(Cookies.get('userType'));
                setUserId(Cookies.get('id'));
                setUserEmail(Cookies.get('email'));
            }
        }
    }, []);
    const checkAuthenticated = () => {
        if(Cookies.get('token')) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }

    const login = async (reqData) => {
        const response = await fetch(`${backend_url}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: reqData.toString(),
        });
        const data = await response.json();
        console.log(data, response);
        if(response.status === 200) {
            Cookies.set('token', data.token);
            Cookies.set('userType', data.userType);
            Cookies.set('id', data.id);
            Cookies.set('email', data.email);
            setUserType(data.userType);
            setUserId(data.id);
            setUserEmail(data.email);
            setIsAuthenticated(true);
            return true;
        }
        else {
            return false;
        }
    }
    const signup = async (reqData, type) => {
        const response = await fetch(`${backend_url}/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqData),
        })
        const data = await response.json();
        console.log(data, response);
        if(response.status === 201) {
            return true;
        } else {
            return false;
        }
    }
    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('userType');
        Cookies.remove('id');
        Cookies.remove('email');
        setUserType('');
        setUserId(-1);
        setUserEmail('');
        setIsAuthenticated(false);
    }
    let [animate, setAnimate] = useState(true);
    const should_set_animate = useRef(true);
    if(should_set_animate.current) {
        if(sessionStorage.getItem('animate')) {
            setAnimate(sessionStorage.getItem('animate') === 'true');
        } else {
            sessionStorage.setItem('animate', 'true');
        }
        should_set_animate.current = false;
    }
    const should_animate = useRef(true);
    const formattedDate = (today) => { return today.getFullYear() + '-' + 
    String(today.getMonth() + 1).padStart(2, '0') + '-' + 
    String(today.getDate()).padStart(2, '0');
    }
    let contextData = {
        backend_url,
        pdashboardState,
        setPdashboardState,
        cdashboardState,
        setCdashboardState,
        adashboardState,
        setAdashboardState,
        isAuthenticated,
        checkAuthenticated,
        login,
        logout,
        signup,
        userType,
        userId,
        userEmail,
        animate,
        setAnimate,
        should_animate,
        formattedDate,
    };
    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}