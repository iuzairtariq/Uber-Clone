import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CaptainContext } from '../context/CaptainContext';

const CaptainHome = () => {
    const [isDisabled, setIsDisabled] = useState(false)
    const { navigate, token, setToken, setCaptain } = useContext(CaptainContext);

    const handleLogout = async () => {
        try {
            setIsDisabled(true);
            let response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captain/logout`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                localStorage.removeItem('token');
                setToken(null);
                setCaptain(null);
                navigate('/userlogin');
            } else {
                toast.error(response.data.message);
                setIsDisabled(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            setIsDisabled(false);
        }
    };

    useEffect(() => {
        if (!token) navigate('/captainlogin');
    }, [token]);

    return (
        <div>
            Captain Home
            <div>
                <button
                    onClick={handleLogout}
                    className={`bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 text-lg placeholder:text-base ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    disabled={isDisabled}
                >
                    {isDisabled ? 'Logout...' : 'Logout'}
                </button>
            </div>
        </div>
    );
}

export default CaptainHome;
