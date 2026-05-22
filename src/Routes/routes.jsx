import { FaDollarSign, FaHome, FaMapMarkedAlt, FaRocket, FaUserAlt, FaWarehouse } from "react-icons/fa";
import SignIn from "../pages/auth/sign-in";
import AdminDasboard from "../pages/admin/dashboard/dashboard";



import OfficerPage from "../pages/admin/officers";
import { FaBookOpen, FaLaptop, FaRadio } from "react-icons/fa6";
import AllocationPage from "../pages/allocator/allocationPage";
import ViewAllocationPage from "../pages/view";
import DriverPage from "../pages/driver";
import MaintenancePage from "../pages/Maintenance";
import IncidentReportPage from "../pages/IncidentReport";
import UnserviceableAllocationPage from "../pages/allocator/unserviceable";
import SparePartPage from "../pages/sparepart";




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
        role: "store",
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
        role: "driver",
        element: <AdminDasboard/>
      },
       {
        icon: <FaHome size={20} />,
        name: "dashboard",
        path: "/",
        role: "chief_driver_com",
        element: <AdminDasboard/>
      },
       {
        icon: <FaHome size={20} />,
        name: "dashboard",
        path: "/",
        role: "allocator",
        element: <AdminDasboard/>
      },


      {
        icon: <FaHome size={20} />,
        name: "dashboard",
        path: "/",
        role: "mechanic",
        element: <AdminDasboard/>
      },
       {
        icon: <FaHome size={20} />,
        name: "dashboard",
        path: "/",
        role: "transport",
        element: <AdminDasboard/>
      },
 {       icon: <FaHome size={20} />,
        name: "Allocations",
        path: "/allocations",
        role: "allocator",
        element: <AllocationPage/>,
    },

    {       icon: <FaHome size={20} />,
        name: "Unserviceable Vehicles",
        path: "/unservice",
        role: "allocator",
        element: <UnserviceableAllocationPage/>,
    },
 
    {       icon: <FaHome size={20} />,
        name: "Available Vehicles",
        path: "/vehicles",
        role: "mechanic",
        element: <MaintenancePage/>,
    },
     {       icon: <FaHome size={20} />,
        name: "Available Vehicles",
        path: "/vehicles",
        role: "transport",
        element: <IncidentReportPage/>,
    },
    {       icon: <FaHome size={20} />,
        name: "Allocations",
        path: "/allocations",
        role: "view",
        element: <ViewAllocationPage/>,
    },
    {       icon: <FaHome size={20} />,
        name: "Vehicle Record",
        path: "/vehicle",
        role: "driver",
        element: <DriverPage/>,
    },
{       icon: <FaHome size={20} />,
        name: "Vehicle Record",
        path: "/vehicle",
        role: "chief_driver_com",
        element: <DriverPage/>,
    },{       icon: <FaHome size={20} />,
        name: "Vehicle Record",
        path: "/vehicle",
        role: "chief_driver_hq",
        element: <DriverPage/>,
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

    {       icon: <FaHome size={20} />,
        name: "Spare Part Request",
        path: "/sparepart",
        role: "allocator",
        element: <SparePartPage/>,
    },
    {       icon: <FaHome size={20} />,
        name: "Spare Part Request",
        path: "/sparepart",
        role: "store",
        element: <SparePartPage/>,
    },
    {       icon: <FaHome size={20} />,
        name: "Unserviceable Vehicles",
        path: "/unservice",
        role: "admin",
        element: <UnserviceableAllocationPage/>,
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
