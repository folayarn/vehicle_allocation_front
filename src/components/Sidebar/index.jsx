import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { Button, Typography, IconButton } from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaTimes,
  FaUserShield,
  FaUserTie,
  FaUserCog,
  FaSearch,
  FaStar,
  FaHistory,
  FaChevronLeft,
  FaChevronRight,
  FaSun,
  FaMoon
} from 'react-icons/fa';
import { UserContext } from "../../context/UserContext";
import { setSideBarTitle } from "../../utils";

const Sidebar = ({ routes }) => {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const [showSubNav, setShowSubNav] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [recentPages, setRecentPages] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Load saved preferences
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsed) setIsCollapsed(JSON.parse(savedCollapsed));
    
    const savedFavorites = localStorage.getItem('sidebarFavorites');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    
    const savedRecent = localStorage.getItem('recentPages');
    if (savedRecent) setRecentPages(JSON.parse(savedRecent));
    
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'black');
  }, []);

  // Apply theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('black');
      localStorage.setItem('theme', 'black');
    } else {
      document.documentElement.classList.remove('black');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleSubNav = (name) => {
    setShowSubNav((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const closeSidebar = () => {
    setOpenSidenav(dispatch, false);
  };

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  const addToRecent = (pageName, path) => {
    const newRecent = [
      { name: pageName, path, timestamp: Date.now() },
      ...recentPages.filter(p => p.name !== pageName)
    ].slice(0, 5);
    setRecentPages(newRecent);
    localStorage.setItem('recentPages', JSON.stringify(newRecent));
  };

  const toggleFavorite = (pageName, path) => {
    const isFavorite = favorites.some(f => f.name === pageName);
    let newFavorites;
    if (isFavorite) {
      newFavorites = favorites.filter(f => f.name !== pageName);
    } else {
      newFavorites = [...favorites, { name: pageName, path, timestamp: Date.now() }];
    }
    setFavorites(newFavorites);
    localStorage.setItem('sidebarFavorites', JSON.stringify(newFavorites));
  };

  const handleLinkClick = (pageName, path) => {
    addToRecent(pageName, path);
    if (openSidenav) closeSidebar();
  };

  const { user, loading } = useContext(UserContext);
  const role = sessionStorage.getItem("role");

  // Role icon mapping
  const roleIcons = {
    admin: <FaUserShield className="text-purple-600" />,
    cpc: <FaUserTie className="text-blue-600" />,
    officer: <FaUserCog className="text-green-600" />
  };

  // Filter routes based on search
  const filteredRoutes = routes.map(route => ({
    ...route,
    pages: route.pages.filter(page => {
      const matchesPage = page.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubNav = page.subNav?.some(sub => 
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return matchesPage || matchesSubNav;
    })
  })).filter(route => route.pages.length > 0);

  // Custom scrollbar styles
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: ${isDarkMode ? '#1f2937' : '#e5e7eb'};
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: ${isDarkMode ? '#4b5563' : '#9ca3af'};
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: ${isDarkMode ? '#6b7280' : '#6b7280'};
    }
  `;

  return (
    <>
      <style>{scrollbarStyles}</style>
      <aside className={`fixed xl:relative h-full z-20 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-72'
      } ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'} shadow-xl border-r ${
        isDarkMode ? 'border-gray-800' : 'border-gray-200'
      } ${openSidenav ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}`}>
        
        {/* Sidebar Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          {!isCollapsed && (
            <Typography variant="h5" className={`font-bold flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Menu
              <span className="group relative inline-flex">
                <span className={`text-xs font-normal px-2 py-1 rounded-full flex items-center gap-1 max-w-[150px] truncate ${
                  isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}>
                  {roleIcons[role?.toLowerCase()] || roleIcons.officer}
                  <span className="truncate">
                    {setSideBarTitle(role)}
                  </span>
                </span>
                
              </span>
            </Typography>
          )}
          
          <div className="flex items-center gap-2">
            {!isCollapsed && (
              <IconButton
                variant="text"
                color={isDarkMode ? "white" : "blue-gray"}
                className="xl:hidden"
                onClick={closeSidebar}
              >
                <FaTimes className="h-5 w-5" />
              </IconButton>
            )}
            <IconButton
              variant="text"
              color={isDarkMode ? "white" : "blue-gray"}
              onClick={toggleCollapse}
              className="hidden xl:flex"
            >
              {isCollapsed ? <FaChevronRight className="h-4 w-4" /> : <FaChevronLeft className="h-4 w-4" />}
            </IconButton>
            {!isCollapsed && (
              <IconButton
                variant="text"
                color={isDarkMode ? "white" : "blue-gray"}
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? <FaSun className="h-4 w-4" /> : <FaMoon className="h-4 w-4" />}
              </IconButton>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>
        )}

        {/* Sidebar Content */}
        <div className={`h-[calc(100vh-${isCollapsed ? '70px' : '200px'})] overflow-y-auto custom-scrollbar ${
          isCollapsed ? 'px-2' : 'p-4'
        }`}>
         

          {/* Main Navigation */}
          {(searchTerm ? filteredRoutes : routes).map(({ layout, title, pages }, key) =>
            layout === "dashboard" ? (
              <ul key={key} className="mb-6 space-y-1">
                {title && !isCollapsed && (
                  <li className="px-3 py-2">
                    <Typography
                      variant="small"
                      className={`font-bold uppercase text-xs tracking-wider flex items-center gap-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {title}
                    </Typography>
                  </li>
                )}
                {pages.map(({ icon, name, path, role: requiredRole, subNav, badge }, index) =>
                  sessionStorage.getItem("role") === requiredRole ? (
                    <li key={index} className="relative">
                      {!subNav ? (
                        <NavLink to={`/${layout}${path}`} end>
                          {({ isActive }) => (
                            <div className="relative group">
                              <motion.div whileHover={{ scale: isCollapsed ? 1 : 1.02 }}>
                                <Button
                                  variant={isActive ? "gradient" : "text"}
                                  color={isActive ? sidenavColor : isDarkMode?"white":"gray"}
                                  className={`flex items-center gap-3 rounded-lg w-full transition-colors ${
                                    isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'
                                  } ${
                                    isActive 
                                      ? "shadow-md" 
                                      : `hover:bg-blue-gray-50 ${isDarkMode ? 'hover:bg-gray-800' : ''}`
                                  }`}
                                  onClick={() => handleLinkClick(name, `/${layout}${path}`)}
                                >
                                  <span className="w-5 h-5 flex items-center justify-center">
                                    {React.cloneElement(icon, {
                                      className: `w-5 h-5 ${
                                        isActive ? "text-white" : isDarkMode ? "text-gray-300" : "text-gray-600"
                                      }`
                                    })}
                                  </span>
                                  {!isCollapsed && (
                                    <>
                                      <Typography
                                        color="inherit"
                                        className="font-medium text-sm flex-1 text-left"
                                      >
                                        {name}
                                      </Typography>
                                      {badge > 0 && (
                                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                                          {badge > 99 ? '99+' : badge}
                                        </span>
                                      )}
                                    </>
                                  )}
                                </Button>
                              </motion.div>
                              
                              {/* Tooltip for collapsed mode */}
                              {isCollapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                  {name}
                                </div>
                              )}
                              
                              {/* Favorite star for non-collapsed mode */}
                              {!isCollapsed && !subNav && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toggleFavorite(name, `/${layout}${path}`);
                                  }}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <FaStar className={`h-3 w-3 ${
                                    favorites.some(f => f.name === name) 
                                      ? 'text-yellow-500' 
                                      : 'text-gray-400 hover:text-yellow-500'
                                  }`} />
                                </button>
                              )}
                            </div>
                          )}
                        </NavLink>
                      ) : (
                        <>
                          <motion.div whileHover={{ scale: isCollapsed ? 1 : 1.02 }}>
                            <Button
                              variant="text"
                              color="gray"
                              className={`flex items-center justify-between rounded-lg w-full transition-colors ${
                                isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'
                              } hover:bg-blue-gray-50 ${isDarkMode ? 'hover:bg-gray-800' : ''}`}
                              onClick={() => !isCollapsed && toggleSubNav(name)}
                            >
                              <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                                <span className="w-5 h-5 flex items-center justify-center">
                                  {React.cloneElement(icon, {
                                    className: `w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`
                                  })}
                                </span>
                                {!isCollapsed && (
                                  <Typography className="font-medium text-sm">
                                    {name}
                                  </Typography>
                                )}
                              </div>
                              {!isCollapsed && (
                                showSubNav[name] ? (
                                  <FaChevronUp className="h-3 w-3 text-gray-500" />
                                ) : (
                                  <FaChevronDown className="h-3 w-3 text-gray-500" />
                                )
                              )}
                            </Button>
                          </motion.div>

                          {/* Tooltip for collapsed mode */}
                          {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                              {name}
                            </div>
                          )}

                          <AnimatePresence>
                            {showSubNav[name] && subNav && !isCollapsed && (
                              <motion.ul 
                                className="ml-8 mt-1 space-y-1"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                {subNav.map(
                                  ({ icon: subIcon, name: subName, sub_path, badge: subBadge }, subKey) => (
                                    <motion.li 
                                      key={subKey}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.2, delay: subKey * 0.05 }}
                                    >
                                      <NavLink
                                        to={`/${layout}${path}${sub_path}`}
                                        end
                                        onClick={() => handleLinkClick(subName, `/${layout}${path}${sub_path}`)}
                                      >
                                        {({ isActive }) => (
                                          <Button
                                            variant={isActive ? "gradient" : "text"}
                                            color={isActive ? sidenavColor : "gray"}
                                            className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full transition-colors ${
                                              isActive 
                                                ? "shadow-md" 
                                                : `hover:bg-blue-gray-50 ${isDarkMode ? 'hover:bg-gray-800' : ''}`
                                            }`}
                                          >
                                            <span className="w-4 h-4 flex items-center justify-center">
                                              {React.cloneElement(subIcon, {
                                                className: `w-4 h-4 ${
                                                  isActive ? "text-white" : isDarkMode ? "text-gray-400" : "text-gray-600"
                                                }`
                                              })}
                                            </span>
                                            <Typography className="font-medium text-xs flex-1">
                                              {subName}
                                            </Typography>
                                            {subBadge > 0 && (
                                              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                                                {subBadge > 99 ? '99+' : subBadge}
                                              </span>
                                            )}
                                          </Button>
                                        )}
                                      </NavLink>
                                    </motion.li>
                                  )
                                )}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                    </li>
                  ) : null
                )}
              </ul>
            ) : null
          )}
        </div>

        {/* User Profile Section at Bottom */}
        {!isCollapsed && (
          <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
            isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold`}>
                {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <Typography className={`text-sm font-medium truncate ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {user?.name || user?.username || 'User'}
                </Typography>
                <Typography className={`text-xs truncate ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {user?.email || setSideBarTitle(role)}
                </Typography>
              </div>
            </div>
           
          </div>
        )}
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidebar;