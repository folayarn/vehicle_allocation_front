import { FaDollarSign, FaHome, FaMapMarkedAlt, FaRocket, FaUserAlt, FaWarehouse } from "react-icons/fa";
import SignIn from "../pages/auth/sign-in";
import AdminDasboard from "../pages/admin/dashboard/dashboard";



import OfficerPage from "../pages/admin/officers";
import { FaBookOpen, FaLaptop, FaRadio } from "react-icons/fa6";
import AllocationPage from "../pages/allocator/allocationPage";
import ViewAllocationPage from "../pages/view";




export const routes = [
  {
    layout: "dashboard",
    title: "Dashboard",
    pages: [
      {
        icon: <FaHome size={20} />,
        name: "dashboard",
        path: "/",
        role: "admin",
        element: <AdminDasboard/>,
      },

       {
        icon: <FaHome size={20} />,
        name: "dashboard",
        path: "/",
        role: "view",
        element: <AdminDasboard/>,
      },
       {
        icon: <FaHome size={20} />,
        name: "dashboard",
        path: "/",
        role: "zone",
        element: <AdminDasboard/>,
      },
       {
        icon: <FaHome size={20} />,
        name: "dashboard",
        path: "/",
        role: "user",
        element: <AdminDasboard/>
      },
       {
        icon: <FaHome size={20} />,
        name: "dashboard",
        path: "/",
        role: "allocator",
        element: <AdminDasboard/>
      },
 {       icon: <FaHome size={20} />,
        name: "Allocations",
        path: "/allocations",
        role: "allocator",
        element: <AllocationPage/>,
    },
    {       icon: <FaHome size={20} />,
        name: "Allocations",
        path: "/allocations",
        role: "view",
        element: <ViewAllocationPage/>,
    },

    {       icon: <FaHome size={20} />,
        name: "Allocations",
        path: "/allocations",
        role: "zone",
        element: <ViewAllocationPage/>,
    },
{       icon: <FaHome size={20} />,
        name: "Allocations",
        path: "/allocations",
        role: "admin",
        element: <AllocationPage/>,
    },
      {
        icon: <FaUserAlt size={20} />,
        name: "User Management",
        path: "/users",
        role: "admin",
        element: <OfficerPage/>,
      },

      {       icon: <FaHome size={20} />,
        name: "Allocations",
        path: "/allocations",
        role: "user",
        element: <AllocationPage/>,
    },
      {
        icon: <FaUserAlt size={20} />,
        name: "User Management",
        path: "/users",
        role: "user",
        element: <OfficerPage/>,
      },
       
     

       
      


    ],
  },
{
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: null,
        name: "sign in",
        path: "",
        element:<SignIn/>,
      },
    ],
  },
];

export default routes;
