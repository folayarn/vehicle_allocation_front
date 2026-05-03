import { useEffect, useState } from "react";
import bg from '../../assets/img/y.png';
import { Card, Input, Checkbox, Button, Typography } from '@material-tailwind/react';
import logo from '../../assets/img/logo.jpg';
import bg_p from '../../assets/img/bg-pattern-2.png';
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/slices/PostSlices";
import { LoginThunk } from "../../store/thunks/LoginThunk";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

export function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [focusedField, setFocusedField] = useState(null);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, isLogin, user, error, OtpRequired } = useSelector(state => state.PostSlice);

    const handleLogin = async (event) => {
        event.preventDefault();
        dispatch(setLoading(true));
        dispatch(LoginThunk({ email, password }));
    };

    useEffect(() => {
    if (isLogin) {
        const userToken = user?.user_token;
        const userRole = user?.user_access_level;
        const userRefreshToken = user?.refresh_token; // Always use refresh_token from API
        const userId = user?.id;
        
        if (rememberMe) {
            localStorage.setItem('token', userToken);
            localStorage.setItem('role', userRole);
            localStorage.setItem('refreshToken', userRefreshToken);
            localStorage.setItem('e', userId);
            // Also store in sessionStorage as backup
            sessionStorage.setItem('token', userToken);
            sessionStorage.setItem('refreshToken', userRefreshToken);
        } else {
            sessionStorage.setItem('token', userToken);
            sessionStorage.setItem('role', userRole);
            sessionStorage.setItem('refreshToken', userRefreshToken);
            sessionStorage.setItem('e', userId);
        }
        
        console.log("Tokens saved:", {
            token: userToken,
            refreshToken: userRefreshToken,
            userId: userId
        });
        
        navigate('/dashboard/');
    }
}, [isLogin, rememberMe, user, navigate]);

    // Features data for landing section
    const features = [
        {
            icon: "🚗",
            title: "Vehicle Allocation",
            description: "Vehicle assignment based on real-time availability for Nigeria Customs Service"
        },
        {
            icon: "📍",
            title: "Monitoring",
            description: "Monitor vehicle locations"
        },
       
    ];

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Image */}
            <div 
                className="absolute inset-0 z-0"
               
            />
            
            {/* Dark Overlay for better text visibility */}
            <div className="absolute inset-0 z-1 bg-black/60" />
            
            {/* Animated Gradient Overlay */}
            <div className="absolute inset-0 z-1 bg-gradient-to-br from-teal-900/30 via-transparent to-blue-900/30" />
            
            {/* Content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        {/* Left Side - Brand Section (Hidden on mobile) */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="hidden lg:block"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="mb-8"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                </div>
                                <h1 className="text-5xl font-bold mb-4 leading-tight text-white">
                                    Vehicle Allocation
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500"> Portal</span>
                                </h1>
                            </motion.div>
                            
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl text-gray-200 mb-8 leading-relaxed"
                            >
                                Streamline your Vehicle Allocation within Nigeria Customs Service. 
                                Secure, efficient, and user-friendly fleet management solution.
                            </motion.p>

                            {/* Features Grid */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="grid grid-cols-2 gap-4 mb-8"
                            >
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 + index * 0.1 }}
                                        className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
                                    >
                                        <div className="text-4xl mb-2">{feature.icon}</div>
                                        <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                                        <p className="text-sm text-gray-200">{feature.description}</p>
                                    </motion.div>
                                ))}
                            </motion.div>

                            
                        </motion.div>

                        {/* Right Side - Login Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
                        >
                            <Card 
                                className="relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl"
                                style={{
                                    backgroundImage: `url(${bg_p})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'left',
                                    backgroundRepeat: 'no-repeat',
                                }}
                            >
                                {/* Glass morphism overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30" />
                                
                                <div className="relative p-8">
                                    {/* Header with Logo */}
                                    <div className="text-center mb-8">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200 }}
                                            className="inline-block"
                                        >
                                            <motion.img 
                                                src={logo} 
                                                alt="Logo" 
                                                className="mx-auto h-24 w-24 rounded-full border-4 border-teal-500 shadow-lg"
                                                whileHover={{ scale: 1.05, rotate: 360 }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </motion.div>
                                        <motion.h2 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-2xl font-bold text-gray-800 mt-4"
                                        >
                                            Welcome Back
                                        </motion.h2>
                                        <motion.p 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-gray-600 text-sm"
                                        >
                                            Please enter your credentials to continue
                                        </motion.p>
                                    </div>

                                    <form onSubmit={handleLogin} className="space-y-5">
                                        {/* Email Field */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <Typography variant="small" className="mb-2 font-medium text-gray-700">
                                                Email Address
                                            </Typography>
                                            <div className={`relative transition-all duration-300 ${
                                                focusedField === 'email' ? 'transform scale-[1.02]' : ''
                                            }`}>
                                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <Input
                                                    size="lg"
                                                    type="email"
                                                    variant="outlined"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    onFocus={() => setFocusedField('email')}
                                                    onBlur={() => setFocusedField(null)}
                                                    placeholder="name@example.com"
                                                    className="!border-gray-300 focus:!border-teal-500 pl-10 !bg-white/80"
                                                    containerProps={{ className: "min-w-[100px]" }}
                                                    style={{
                                                        borderColor: focusedField === 'email' ? '#14b8a6' : '#e2e8f0'
                                                    }}
                                                />
                                            </div>
                                        </motion.div>

                                        {/* Password Field */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <Typography variant="small" className="mb-2 font-medium text-gray-700">
                                                Password
                                            </Typography>
                                            <div className={`relative transition-all duration-300 ${
                                                focusedField === 'password' ? 'transform scale-[1.02]' : ''
                                            }`}>
                                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                                <Input
                                                    size="lg"
                                                    type={showPassword ? "text" : "password"}
                                                    variant="outlined"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    onFocus={() => setFocusedField('password')}
                                                    onBlur={() => setFocusedField(null)}
                                                    placeholder="Enter your password"
                                                    className="!border-gray-300 focus:!border-teal-500 pl-10 pr-12 !bg-white/80"
                                                    containerProps={{ className: "min-w-[100px]" }}
                                                    style={{
                                                        borderColor: focusedField === 'password' ? '#14b8a6' : '#e2e8f0'
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-teal-600 transition-colors"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>

                                        {/* OTP Field (Conditional) */}
                                        <AnimatePresence>
                                            {OtpRequired && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <Typography variant="small" className="mb-2 font-medium text-gray-700">
                                                        OTP Code
                                                    </Typography>
                                                    <Input
                                                        size="lg"
                                                        type="text"
                                                        variant="outlined"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        placeholder="Enter OTP"
                                                        className="!border-gray-300 focus:!border-teal-500 !bg-white/80"
                                                        containerProps={{ className: "min-w-[100px]" }}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Remember Me & Forgot Password */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.6 }}
                                            className="flex items-center justify-between"
                                        >
                                            <Checkbox
                                                label="Remember Me"
                                                checked={rememberMe}
                                                onChange={() => setRememberMe(!rememberMe)}
                                                className="!border-gray-300 checked:!bg-teal-500"
                                                labelProps={{ className: "text-gray-700 font-normal" }}
                                            />
                                            <Typography
                                                as="a"
                                                href="#"
                                                variant="small"
                                                className="font-medium text-teal-600 hover:text-teal-800 transition-colors"
                                            >
                                                Forgot password?
                                            </Typography>
                                        </motion.div>

                                        {/* Login Button */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.7 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                size="lg"
                                                className="relative w-full bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden group"
                                                type="submit"
                                                disabled={loading}
                                            >
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    {loading ? (
                                                        <>
                                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                            </svg>
                                                            Log In
                                                        </>
                                                    )}
                                                </span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                            </Button>
                                        </motion.div>

                                        {/* Error Message */}
                                        <AnimatePresence>
                                            {error && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="p-3 bg-red-500/20 backdrop-blur-sm text-red-100 rounded-lg text-sm text-center border border-red-400/50 flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {error}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </form>

                                    {/* Footer */}
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="mt-6 text-center"
                                    >
                                        <Typography variant="small" className="text-gray-600">
                                            Don't have an account?{' '}
                                            <Typography
                                                as="a"
                                                href="#"
                                                variant="small"
                                                className="font-medium text-teal-600 hover:text-teal-800 transition-colors"
                                            >
                                                Contact admin
                                            </Typography>
                                        </Typography>
                                    </motion.div>
                                </div>
                            </Card>

                            {/* Copyright */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9 }}
                                className="mt-8 text-center"
                            >
                                <Typography variant="small" className="text-white/90 font-medium">
                                    © {new Date().getFullYear()} Nigeria Customs Service - Vehicle Allocation Portal. All rights reserved.
                                </Typography>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;