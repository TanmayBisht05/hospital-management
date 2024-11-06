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
    const [pharmacyRequests, setPharmacyRequests] = useState([]);
    const [requestsPharmacy, setRequestsPharmacy] = useState([]);

    const fetchPharmacyRequests = async () => {
        const response = await fetch(`${backend_url}/pharmacy`);
        const data = await response.json();
        setPharmacyRequests(data);
    };
    const fetch_requests_pharmacy = async (patientID) => {
        const response = await fetch (`${backend_url}/pharmacy/${patientID}`);
        const data = await response.json();
        setRequestsPharmacy(data);
    }

    const handleDenyRequest = async (requestId) => {
        // Call the deny request API here (like the existing API to deny the request)
        console.log(`Denying request ${requestId}`);
        // Example of API call to deny the request
        await fetch(`${backend_url}/pharmacy/${requestId}`, { method: 'DELETE' });
        fetchPharmacyRequests(); // Refresh the list after denying
    };

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
        if(response.status === 200) {
            const data = await response.json();
            console.log(data, response);
            Cookies.set('token', data.token);
            Cookies.set('userType', data.userType);
            Cookies.set('id', data.id);
            Cookies.set('email', data.email);
            setUserType(data.userType);
            setUserId(data.id);
            setUserEmail(data.email);
            setIsAuthenticated(true);
            return {success: true, message: ''};
        }
        else {
            const resp  = await response.text();
            return {success: false, resp};
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
    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 30); // Add 30 minutes to the current time
      
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
      
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };
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
        getMinDateTime,
        handleDenyRequest,
        fetchPharmacyRequests,
        pharmacyRequests,
        setPharmacyRequests,
        requestsPharmacy,
        setRequestsPharmacy,
        fetch_requests_pharmacy,
    };
    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}