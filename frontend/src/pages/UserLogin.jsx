import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { UserContext } from '../context/UserContext';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false)

    const { user, setUser, token, setToken, navigate } = useContext(UserContext);

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            setIsDisabled(true);
            let response;
            if (isSignup) {
                const newUser = {
                    name: name,
                    email: email,
                    password: password
                };
                response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, newUser);
                if (response.data.success) {
                    toast.success(response.data.message);
                    setToken(response.data.token);
                    localStorage.setItem('token', response.data.token);
                } else {
                    toast.error(response.data.message);
                    setIsDisabled(false);
                }
            } else {
                const user = {
                    email: email,
                    password: password
                };
                response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, user);
                if (response.data.success) {
                    toast.success(response.data.message);
                    setToken(response.data.token);
                    localStorage.setItem('token', response.data.token);
                } else {
                    toast.error(response.data.message);
                    setIsDisabled(false);
                }
            }

            setUser(response.data);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            setIsDisabled(false);
        }
    };

    useEffect(() => {
        if (token) {
            navigate('/userhome');
        }
    }, [token]);

    return (
        <div className='p-8 h-screen flex flex-col justify-between'>
            <div>
                <img className='w-16 mb-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />

                <form onSubmit={submitHandler}>
                    {isSignup ? (
                        <>
                            <h3 className='text-lg font-medium mb-2'>What's your Full Name</h3>
                            <input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className='bg-[#eeeeee] border-none mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                                type="text"
                                placeholder='Full Name'
                            />
                        </>
                    ) : null}

                    <h3 className='text-lg font-medium mb-2'>What's your Email</h3>
                    <input
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='bg-[#eeeeee] border-none mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                        type="email"
                        placeholder='email@example.com'
                    />

                    <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
                    <input
                        className='bg-[#eeeeee] border-none mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        type="password"
                        placeholder='Password'
                    />

                    <button
                        className={`bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        disabled={isDisabled}
                    >
                        {isSignup ? (isDisabled ? 'Create Account...' : 'Create Account') : (isDisabled ? 'Login...' : 'Login')}
                    </button>
                </form>
                <p className='text-center'>
                    {isSignup ? (
                        <>Already have an account? <button className='text-blue-600 cursor-pointer hover:underline' onClick={() => setIsSignup(false)}>Log In</button></>
                    ) : (
                        <>New here? <button className='text-blue-600 cursor-pointer hover:underline' onClick={() => setIsSignup(true)}>Create new Account</button></>
                    )}
                </p>
            </div>
            <div>
                {isSignup ? (
                    <p className='text-xs text-center'>
                        This site is protected by reCAPTCHA and the Google <Link to='https://policies.google.com/privacy' className='text-blue-600 cursor-pointer'>Privacy Policy</Link> and <Link to='https://policies.google.com/terms' className='text-blue-600 cursor-pointer'>Terms of Service</Link> apply.
                    </p>
                ) : (
                    <Link
                        to='/captainlogin'
                        className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
                    >Sign in as Captain</Link>
                )}
            </div>
        </div>
    );
};

export default UserLogin;
