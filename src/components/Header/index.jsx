import {
  Navbar,
  IconButton,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  Tooltip
} from "@material-tailwind/react";
import logo from "../../assets/img/logo.png";
import { FaCog, FaLock, FaBars } from 'react-icons/fa';
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import Skeleton from "react-loading-skeleton";
import ModalComponent from "../Modal";
import ChangePassword from "../ChangePassword";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav } = controller;
  const { user, loading } = useContext(UserContext);
  
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      <Navbar
        blurred
        shadow={false}
        className="sticky bg-teal-600 top-0 z-50 h-max max-w-full rounded-none border-0 p-2 md:p-4 shadow-md"
      >
        <div className="flex items-center justify-between text-blue-gray-900">
          {/* Logo and Sidebar Toggle */}
          <div className="flex items-center gap-2 md:gap-4">
            <img 
              src={logo} 
              alt="logo" 
              className="h-10 md:h-12 w-auto object-contain" 
            />
            <IconButton
              variant="text"
              className="ml-1 md:ml-2 h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent xl:hidden"
              ripple={false}
              onClick={() => setOpenSidenav(dispatch, !openSidenav)}
            >
              <FaBars className="h-5 w-5" color="white"/>
            </IconButton>
          </div>

          {/* System Title with Responsive Truncation */}
          <Tooltip content="EXCISE REGISTER SYSTEM" placement="bottom">
            <Typography 
              className="text-center text-sm md:text-lg font-bold text-white
              truncate max-w-[120px] sm:max-w-[180px] md:max-w-none px-2"
            >
            {sessionStorage.getItem("role") === "ftz" ? "FREE TRADE ZONE REGISTER" : "EXCISE REGISTER SYSTEM"}
            </Typography>
          </Tooltip>

          {/* User Menu */}
          <div className="flex items-center gap-2 md:gap-4">
            <Menu placement="bottom-end">
              <MenuHandler>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Skeleton width={120} height={30} />
                  </div>
                ) : (
                  <Button
                    variant="text"
                    color="white"
                    className="flex items-center gap-1 md:gap-2 rounded-full py-1 px-2 md:py-1.5 md:pl-2 md:pr-3 capitalize shadow-none hover:shadow-none"
                  >
                    <div className="hidden sm:flex flex-col items-end">
                      <Typography 
                        variant="small" 
                        className="font-semibold truncate max-w-[80px] md:max-w-[120px]"
                      >
                        {user?.fullname}
                      </Typography>
                      <Typography 
                        variant="small" 
                        className="text-xs opacity-70 truncate max-w-[80px] md:max-w-[120px]"
                      >
                        {user?.role}
                      </Typography>
                    </div>
                    <div className="sm:hidden">
                      <Typography 
                        variant="small" 
                        className="font-semibold truncate max-w-[40px]"
                      >
                        {user?.fullname?.split(' ')[0]}
                      </Typography>
                    </div>
                    <FaCog className="h-4 w-4" />
                  </Button>
                )}
              </MenuHandler>

              <MenuList className="p-1 min-w-[180px]">
                <MenuItem 
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-2 hover:bg-blue-gray-50/50"
                >
                  <FaCog className="h-4 w-4" />
                  <Typography variant="small" className="font-normal">
                    Change Password
                  </Typography>
                </MenuItem>
                <MenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-2 hover:bg-red-50/50 hover:text-red-500"
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