import { useEffect, useState } from "react";
import { Card, Button, Typography } from '@material-tailwind/react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import bg from '../../assets/img/p.jpg';
import logo from '../../assets/img/logo.jpg';

export function ModuleLanding() {
    const navigate = useNavigate();
    const [hoveredModule, setHoveredModule] = useState(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const modules = [
        {
            id: 'fleet',
            title: 'Fleet Management System',
            description: 'Efficiently manage vehicle allocation, monitoring, maintenance scheduling, and driver assignment for the Nigeria Customs Service fleet.',
            icon: '🚗',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50',
            hoverColor: 'hover:border-blue-400',
            path: '/fleet-sign-in',
            features: [
                
                'Driver Assignment',
                'Allocation Management',
                
        
            ]
        },
        {
            id: 'asset',
            title: 'Asset Management System',
            description: 'Track and manage all organizational assets including equipment, machinery, and office resources with complete lifecycle management.',
            icon: '💼',
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50',
            hoverColor: 'hover:border-green-400',
            path: '/asset-sign-in',
            features:[
                'Maintenance records',
                'Asset Reports'
            ]
        },
        {
            id: 'store',
            title: 'Store Management System',
            description: 'Streamline inventory control, stock monitoring, procurement, and supply chain operations for all store items and materials.',
            icon: '📦',
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-50',
            hoverColor: 'hover:border-purple-400',
            path: '/store-sign-in',
            features: [
                'Inventory Management',
                'Procurement Tracking',

            ]
        },
        {
            id: 'accommodation',
            title: 'Accommodation Management System',
            description: 'Manage housing allocations, maintenance requests, and facility bookings for NCS personnel.',
            icon: '🏠',
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-50',
            hoverColor: 'hover:border-orange-400',
            path: '/accommodation-sign-in',
            features: [
                'Barack allocation',
                'Maintenance requests',
                
                
        
            ]
        }
    ];

   

    const handleModuleClick = (modulePath) => {
        // Check if user is authenticated
            navigate(modulePath);
       
    };

    return (
        <div className="relative min-h-screen overflow-x-hidden">
            {/* Background Image */}
            <div 
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            />
            
            {/* Dark Overlay */}
            <div className="fixed inset-0 z-1 bg-black/60" />
            
            {/* Animated Gradient Overlay */}
            <div className="fixed inset-0 z-1 bg-gradient-to-br from-teal-900/20 via-transparent to-blue-900/20" />

            {/* Navigation Bar */}
            <motion.nav 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg' : 'bg-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-3">
                            <motion.img 
                                src={logo} 
                                alt="Logo" 
                                className="h-12 w-12 rounded-full border-2 border-green-500"
                                whileHover={{ scale: 1.05, rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            />
                            <div>
                                <h1 className={`font-bold text-xl ${scrolled ? 'text-gray-800' : 'text-white'}`}>
                                    FATS INTEGRATED MANAGEMENT SOLUTIONS
                                </h1>
                                <p className={`text-xs ${scrolled ? 'text-gray-500' : 'text-gray-200'}`}>
                                    Nigeria Customs Service
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <Button
                                variant="text"
                                className={`${scrolled ? 'text-gray-600' : 'text-white'} font-medium`}
                                onClick={() => navigate('/')}
                            >
                                Home
                            </Button>
                            
                           
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Main Content */}
            <div className="relative z-10 pt-60 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <motion.h1 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="text-5xl md:text-7xl font-bold mb-6 text-white"
                        >
                           FATS Integrated Management 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500"> Solutions</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-gray-200 max-w-3xl mx-auto"
                        >
                            Comprehensive management systems for FATS Department Under Nigeria Customs Service operations
                        </motion.p>
                    </motion.div>

                    

                    {/* Modules Grid */}
                    <div className="grid lg:grid-cols-2 gap-8 mb-20">
                        {modules.map((module, index) => (
                            <motion.div
                                key={module.id}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                                onMouseEnter={() => setHoveredModule(module.id)}
                                onMouseLeave={() => setHoveredModule(null)}
                            >
                                <Card 
                                    className={`relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-2xl border-2 transition-all duration-500 cursor-pointer ${
                                        hoveredModule === module.id 
                                            ? `border-${module.color.split('to')[1].trim()}-400 shadow-2xl transform scale-[1.02]` 
                                            : 'border-white/30'
                                    }`}
                                    onClick={() => handleModuleClick(module.path)}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 transition-opacity duration-500 ${
                                        hoveredModule === module.id ? 'opacity-5' : ''
                                    }`} />
                                    
                                    <div className="relative p-8">
                                        <div className="flex items-start gap-6">
                                            <motion.div 
                                                className="text-6xl"
                                                animate={{ 
                                                    scale: hoveredModule === module.id ? 1.1 : 1,
                                                    rotate: hoveredModule === module.id ? 5 : 0
                                                }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {module.icon}
                                            </motion.div>
                                            
                                            <div className="flex-1">
                                                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                                                    {module.title}
                                                </h2>
                                                <p className="text-gray-600 mb-4 leading-relaxed">
                                                    {module.description}
                                                </p>
                                                
                                                {/* Features List */}
                                                <div className="grid grid-cols-2 gap-2 mb-6">
                                                    {module.features.map((feature, idx) => (
                                                        <motion.div 
                                                            key={idx}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ 
                                                                opacity: hoveredModule === module.id ? 1 : 0.6,
                                                                x: hoveredModule === module.id ? 0 : -5
                                                            }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            className="flex items-center gap-2 text-sm text-gray-600"
                                                        >
                                                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            {feature}
                                                        </motion.div>
                                                    ))}
                                                </div>
                                                
                                                <Button
                                                    className={`bg-gradient-to-r ${module.color} text-white shadow-lg hover:shadow-xl transition-all`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleModuleClick(module.path);
                                                    }}
                                                >
                                                    Access Module →
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Animated Border */}
                                    <AnimatePresence>
                                        {hoveredModule === module.id && (
                                            <motion.div
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                exit={{ scaleX: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${module.color}`}
                                            />
                                        )}
                                    </AnimatePresence>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    
                    {/* Footer */}
                    <motion.footer
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-16 pt-8 border-t border-white/20 text-center"
                    >
                        <Typography variant="small" className="text-white/80">
                            © {new Date().getFullYear()} Nigeria Customs Service - Integrated Management Systems. All rights reserved.
                        </Typography>
                    </motion.footer>
                </div>
            </div>
        </div>
    );
}

export default ModuleLanding;