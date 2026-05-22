import { useState } from "react";
import { Routes, Route } from "react-router-dom";
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

  return (
    <UserProvider>
      <div className="min-h-screen w-full bg-blue-gray-50/50">
        {/* Header */}
        <Header />

        <div className="flex flex-col md:flex-row">
          {/* Sidebar Section - Responsive Behavior */}
          <div
            className={`
              ${openSidenav ? "translate-x-0" : "-translate-x-full"} 
              md:translate-x-0
              fixed md:relative
              w-64
              h-screen md:h-auto
              bg-white
              shadow-lg md:shadow-none
              z-20
              transition-all duration-300 ease-in-out
            `}
          >
            <Sidebar routes={routes} />
          </div>

          {/* Overlay for mobile when sidebar is open */}
          {openSidenav && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
              onClick={() => dispatch({ type: "OPEN_SIDENAV", value: false })}
            />
          )}

          {/* Main Content Section */}
          <main
            className={`
              flex-1
              overflow-x-auto
              p-4 sm:p-6 md:p-8 lg:p-10
              min-h-screen
              transition-all duration-300
              ${openSidenav ? "ml-0 md:ml-64" : "ml-0"}
            `}
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
            </Routes>
          </main>
        </div>
      </div>
    </UserProvider>
  );
};

export default Dashboard;