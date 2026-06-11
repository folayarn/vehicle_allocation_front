import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import routes from "../Routes/routes";
import { SubRoutes } from "../Routes/subRoutes";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { UserProvider } from "../context/UserContext";
import { useMaterialTailwindController } from "@/context";

const Dashboard = () => {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav } = controller;
  const userRole = sessionStorage.getItem("role");
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile && openSidenav) {
      dispatch({ type: "OPEN_SIDENAV", value: false });
    }
  }, [location.pathname, isMobile]);

  // Update page title based on current route
  useEffect(() => {
    const findPageTitle = () => {
      for (const route of routes) {
        for (const page of route.pages) {
          if (location.pathname.includes(page.path) && page.name) {
            setPageTitle(page.name);
            return;
          }
          if (page.subNav) {
            const subPage = page.subNav.find(sub => 
              location.pathname.includes(sub.sub_path)
            );
            if (subPage) {
              setPageTitle(`${page.name} - ${subPage.name}`);
              return;
            }
          }
        }
      }
      setPageTitle("Dashboard");
    };
    
    findPageTitle();
  }, [location.pathname]);

  // Handle sidebar close on escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && openSidenav && isMobile) {
        dispatch({ type: "OPEN_SIDENAV", value: false });
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [openSidenav, isMobile, dispatch]);

  // Page transition animations
  const pageVariants = {
    initial: {
      opacity: 0,
      x: -20,
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: 20,
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.3,
  };

  return (
    <UserProvider>
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        {/* Header */}
        <Header />

        <div className="flex h-screen flex-col md:flex-row relative">
          {/* Sidebar Section - Responsive Behavior */}
          <AnimatePresence>
            {(openSidenav || !isMobile) && (
              <motion.div
                initial={isMobile ? { x: -300 } : false}
                animate={isMobile ? { x: 0 } : false}
                exit={isMobile ? { x: -300 } : false}
                transition={{ type: "tween", duration: 0.3 }}
                className={`
                  ${openSidenav ? "translate-x-0" : "-translate-x-full"} 
                  md:translate-x-0
                  fixed md:relative
                  z-30
                  transition-all duration-300 ease-in-out
                `}
              >
                <Sidebar routes={routes} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay for mobile when sidebar is open */}
          <AnimatePresence>
            {openSidenav && isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                onClick={() => dispatch({ type: "OPEN_SIDENAV", value: false })}
              />
            )}
          </AnimatePresence>

          {/* Main Content Section */}
          <main
            className={`
              flex-1
              overflow-x-auto
              transition-all duration-300
              ${!isMobile && openSidenav ? 'md:ml-72' : 'md:ml-20'}
              ${isMobile ? 'ml-0' : ''}
            `}
          >
           

            {/* Page Content with Animation */}
            <div className="p-4 sm:p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Routes>
                    {routes.map(({ pages }) =>
                      pages.map(({ path, role, element, subNav }) => {
                        if (!role || role === userRole) {
                          if (subNav) {
                            return (
                              <Route
                                key={path}
                                path={`${path}/*`}
                                element={<SubRoutes subNav={subNav} />}
                              />
                            );
                          } else {
                            return <Route key={path} path={path} element={element} />;
                          }
                        }
                        return null;
                      })
                    )}
                    
                    {/* 404 Route */}
                    <Route
                      path="*"
                      element={
                        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                          <h2 className="text-4xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                            404
                          </h2>
                          <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Page not found
                          </p>
                          <button
                            onClick={() => window.location.href = '/dashboard'}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Go to Dashboard
                          </button>
                        </div>
                      }
                    />
                  </Routes>
                </motion.div>
              </AnimatePresence>
            </div>

            
          </main>
        </div>
      </div>
    </UserProvider>
  );
};

export default Dashboard;