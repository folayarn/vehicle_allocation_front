import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { Button, Typography, IconButton } from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { motion } from "framer-motion";
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaTimes,
  FaUserShield,
  FaUserTie,
  FaUserCog
} from 'react-icons/fa';
import { UserContext } from "../../context/UserContext";

const Sidebar = ({ routes }) => {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const [showSubNav, setShowSubNav] = useState({});

  const toggleSubNav = (name) => {
    setShowSubNav((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const closeSidebar = () => {
    setOpenSidenav(dispatch, false);
  };

  const handleLinkClick = () => {
    if (openSidenav) {
      closeSidebar();
    }
  };
 const { user, loading } = useContext(UserContext);
 
  const role = sessionStorage.getItem("role");
  
  // Role icon mapping
  const roleIcons = {
    admin: <FaUserShield className="text-purple-600" />,
    cpc: <FaUserTie className="text-blue-600" />,
    officer: <FaUserCog className="text-green-600" />
  };

  return (
    <aside className={`fixed xl:relative h-full z-20 w-72 bg-white shadow-xl border-r border-gray-100 transition-all duration-300 ${openSidenav ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-gray-50 to-white">
        <Typography variant="h5" color="blue-gray" className="font-bold flex items-center gap-2">
          Menu
       <span className="group relative inline-flex">
  {/* Truncated Badge */}
  <span className="text-xs font-normal bg-blue-gray-100 text-blue-gray-700 px-2 py-1 rounded-full flex items-center gap-1 max-w-[150px] truncate">
    {roleIcons[role.toLowerCase()] || roleIcons.officer}
    <span className="truncate">
      {role === "admin" ? "Admin" : role === "user" ? "User Management" : role === "oc_excise" || role === "cac" ? "View Access (Command)" : 
      role === "allocator" ? "Allocation Officer" : role == "all"? "View Access" :
      role == "view" ? "View Access":
       role == "super" ? `${user?.factory} (Parent Factory)` : `${user?.factory}`}
    </span>
  </span>
  
  {/* Popover Tooltip */}
  <span className="absolute hidden group-hover:block z-100 w-auto max-w-xs px-2 py-1 rounded-md bg-gray-900 text-white text-sm shadow-lg break-words whitespace-normal left-1/2 transform -translate-x-1/2 mb-1">
      {role === "admin" ? "Admin" : role === "user" ? "User Management" : role === "oc_excise" || role === "cac" ? "View Access (Command)" : role === "cpc" ? "CPC" : role == "all"? "View Access" : role === "oc_excise" || role === "cac" ? "View Access (Command)" : role === "cpc" ? "CPC" : role == "all"? "View Access" :role == "semi" ? "View Access (Multi Factories)":
       role == "super" ? `${user?.factory} (Parent Factory)` : `${user?.factory}`}
    {/* Tooltip arrow */}
    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-solid border-transparent border-t-gray-900"></span>
  </span>
</span>
        </Typography>
        <IconButton
          variant="text"
          color="blue-gray"
          className="xl:hidden"
          onClick={closeSidebar}
        >
          <FaTimes className="h-5 w-5" />
        </IconButton>
      </div>

      {/* Sidebar Content */}
      <div className="h-[calc(100vh-64px)] overflow-y-auto p-4">
        {routes.map(({ layout, title, pages }, key) =>
          layout === "dashboard" ? (
            <ul key={key} className="mb-6 space-y-1">
              {title && (
                <li className="px-3 py-2">
                  <Typography
                    variant="small"
                    color="gray"
                    className="font-bold uppercase text-xs tracking-wider flex items-center gap-2"
                  >
                    {title}
                  </Typography>
                </li>
              )}
              {pages.map(({ icon, name, path, role: requiredRole, subNav }, index) =>
                sessionStorage.getItem("role") === requiredRole ? (
                  <li key={index} className="relative">
                    {!subNav ? (
                      <NavLink to={`/${layout}${path}`} end>
                        {({ isActive }) => (
                          <motion.div whileHover={{ scale: 1.02 }}>
                            <Button
                              variant={isActive ? "gradient" : "text"}
                              color={isActive ? sidenavColor : "gray"}
                              className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-colors ${
                                isActive 
                                  ? "shadow-md" 
                                  : "hover:bg-blue-gray-50 hover:text-gray-900"
                              }`}
                              onClick={handleLinkClick}
                            >
                              <span className="w-5 h-5 flex items-center justify-center">
                                {React.cloneElement(icon, {
                                  className: `w-5 h-5 ${
                                    isActive ? "text-white" : "text-gray-600"
                                  }`
                                })}
                              </span>
                              <Typography
                                color="inherit"
                                className="font-medium text-sm"
                              >
                                {name}
                              </Typography>
                            </Button>
                          </motion.div>
                        )}
                      </NavLink>
                    ) : (
                      <>
                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Button
                            variant="text"
                            color="gray"
                            className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg w-full hover:bg-blue-gray-50 hover:text-gray-900 transition-colors"
                            onClick={() => toggleSubNav(name)}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-5 h-5 flex items-center justify-center">
                                {React.cloneElement(icon, {
                                  className: "w-5 h-5 text-gray-600"
                                })}
                              </span>
                              <Typography
                                color="inherit"
                                className="font-medium text-sm"
                              >
                                {name}
                              </Typography>
                            </div>
                            {showSubNav[name] ? (
                              <FaChevronUp className="h-3 w-3 text-gray-500" />
                            ) : (
                              <FaChevronDown className="h-3 w-3 text-gray-500" />
                            )}
                          </Button>
                        </motion.div>

                        {showSubNav[name] && subNav && (
                          <motion.ul 
                            className="ml-8 mt-1 space-y-1"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {subNav.map(
                              ({ icon: subIcon, name: subName, sub_path }, subKey) => (
                                <motion.li 
                                  key={subKey}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.2, delay: subKey * 0.05 }}
                                >
                                  <NavLink
                                    to={`/${layout}${path}${sub_path}`}
                                    end
                                    onClick={handleLinkClick}
                                  >
                                    {({ isActive }) => (
                                      <Button
                                        variant={isActive ? "gradient" : "text"}
                                        color={isActive ? sidenavColor : "gray"}
                                        className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full transition-colors ${
                                          isActive 
                                            ? "shadow-md" 
                                            : "hover:bg-blue-gray-50 hover:text-gray-900"
                                        }`}
                                      >
                                        <span className="w-4 h-4 flex items-center justify-center">
                                          {React.cloneElement(subIcon, {
                                            className: `w-4 h-4 ${
                                              isActive ? "text-white" : "text-gray-600"
                                            }`
                                          })}
                                        </span>
                                        <Typography
                                          color="inherit"
                                          className="font-medium text-xs"
                                        >
                                          {subName}
                                        </Typography>
                                      </Button>
                                    )}
                                  </NavLink>
                                </motion.li>
                              )
                            )}
                          </motion.ul>
                        )}
                      </>
                    )}
                  </li>
                ) : null
              )}
            </ul>
          ) : null
        )}
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidebar;