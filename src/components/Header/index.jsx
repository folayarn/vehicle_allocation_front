import {
  Navbar,
  IconButton,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  Tooltip,
  Badge
} from "@material-tailwind/react";
import logo from "../../assets/img/logo.png";
import { 
  FaCog, 
  FaLock, 
  FaBars, 
  FaBell, 
  FaUserCircle,
  FaQuestionCircle,
  FaMoon,
  FaSun,
  FaSearch,
  FaEnvelope,
  FaUserFriends
} from 'react-icons/fa';
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import Skeleton from "react-loading-skeleton";
import ModalComponent from "../Modal";
import ChangePassword from "../ChangePassword";
import { setHeaderTitle, setSideBarTitle } from "../../utils";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome back!", read: false, time: "Just now" },
    { id: 2, message: "You have a new message", read: false, time: "5 min ago" },
    { id: 3, message: "System update completed", read: true, time: "1 hour ago" }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav } = controller;
  const { user, loading } = useContext(UserContext);
  
  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem('sidebarCollapsed');
    localStorage.removeItem('sidebarFavorites');
    localStorage.removeItem('recentPages');
    window.location.href = "/";
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(!showSearch);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showSearch]);

  return (
    <>
      <Navbar
      color="black"
        className={`sticky top-0 z-50 h-max max-w-full rounded-none border-0 p-2 md:p-4 transition-colors duration-300 
          bg-black
        `}
        
      >
        <div className="flex items-center justify-between">
          {/* Logo and Sidebar Toggle */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <img 
                src={logo} 
                alt="logo" 
                className="h-10 md:h-12 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity" 
                onClick={() => window.location.href = "/dashboard"}
              />
              <IconButton
                variant="text"
                className="ml-1 md:ml-2 h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent xl:hidden"
                ripple={false}
                onClick={() => setOpenSidenav(dispatch, !openSidenav)}
              >
                <FaBars className="h-5 w-5 text-white" />
              </IconButton>
            </div>

            {/* System Title with Responsive Truncation */}
            <Tooltip content={setHeaderTitle(user?.type)} placement="bottom">
              <Typography 
                className={`text-center text-sm md:text-xl font-bold 
                  truncate italic max-w-[120px] sm:max-w-[180px] md:max-w-none px-2 transition-colors ${
                  isDarkMode ? 'text-gray-100' : 'text-white'
                }`}
              >
                {setHeaderTitle(user?.type)}
              </Typography>
            </Tooltip>
          </div>

          {/* Right Section - Actions & User Menu */}
          <div className="flex items-center gap-1 md:gap-3">
            
           

           

            
                   
            {/* Help Button */}
            <Tooltip content="Help & Support">
              <IconButton
                variant="text"
                className="hidden sm:flex text-white hover:bg-white/10"
                onClick={() => window.open('/help', '_blank')}
              >
                <FaQuestionCircle className="h-4 w-4 md:h-5 md:w-5" />
              </IconButton>
            </Tooltip>

            {/* User Menu */}
            <Menu placement="bottom-end">
              <MenuHandler>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Skeleton width={120} height={30} />
                  </div>
                ) : (
                  <Button
                    variant="text"
                    className={`flex items-center gap-1 md:gap-2 rounded-full py-1 px-2 md:py-1.5 md:pl-2 md:pr-3 capitalize shadow-none hover:shadow-none ${
                      isDarkMode ? 'text-white hover:bg-gray-800' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="hidden sm:flex flex-col items-end">
                      <Typography 
                        variant="small" 
                        className="font-semibold truncate max-w-[80px] md:max-w-[120px]"
                      >
                        {user?.fullname || user?.username}
                      </Typography>
                      <Typography 
                        variant="small" 
                        className="text-xs opacity-70 truncate max-w-[80px] md:max-w-[120px]"
                      >
                        {setSideBarTitle(user?.role)}
                      </Typography>
                    </div>
                    <div className="sm:hidden">
                      <Typography 
                        variant="small" 
                        className="font-semibold truncate max-w-[40px]"
                      >
                        {user?.fullname?.split(' ')[0] || user?.username?.charAt(0)}
                      </Typography>
                    </div>
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm`}>
                      {user?.fullname?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </div>
                  </Button>
                )}
              </MenuHandler>

              <MenuList className={`p-1 min-w-[200px] ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
               
               
                <MenuItem 
                  onClick={() => setOpen(true)}
                  className={`flex items-center gap-2 
                     text-gray-900 hover:bg-blue-gray-50/50
                  `}
                >
                  <FaCog className="h-4 w-4" />
                  <Typography variant="small" className="font-normal">
                    Change Password
                  </Typography>
                </MenuItem>
                <hr className={`my-1 ${isDarkMode ? 'border-gray-700' : ''}`} />
                <MenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-900 hover:bg-red-50/50 hover:text-red-500"
                >
                  <FaLock className="h-4 w-4" />
                  <Typography variant="small" className="font-normal">
                    Logout
                  </Typography>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>

       
      </Navbar>

      <ModalComponent 
        size="sm" 
        title="Change Password" 
        open={open} 
        setOpen={setOpen}
      >
        <ChangePassword setOpen={setOpen} />
      </ModalComponent>
    </>
  );
};

export default Header;