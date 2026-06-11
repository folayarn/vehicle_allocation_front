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
import FleetSignIn from "../pages/auth/Fleet-sign-in";
import StoreSignIn from "../pages/auth/Store-sign-in";
import { AssetSignIn } from "../pages/auth/Asset-sign-in";
import AccommodationSignIn from "../pages/auth/Accommodation-sign-in";
import AssetDashboard from "../pages/admin/dashboard/asset_dashboard";
import AssetPage from "../pages/asset_management";




export const routes = [
  {
    layout: "dashboard",
    title: "Dashboard",
    pages: [
      {
        icon: <FaHome size={20} />,
        name: "Fleet Stats",
        path: "/",
        role: "admin",
        element: <AdminDasboard/>,
      },
      {
        icon: <FaHome size={20} />,
        name: "Asset Stats",
        path: "/asset_stat",
        role: "admin",
        element: <AssetDashboard/>,
      },
      {
        icon: <FaHome size={20} />,
        name: "dashboard",
        path: "/",
        role: "manager",
        element: <AssetDashboard/>,
      },
       {
        icon: <FaHome size={20} />,
        name: "dashboard",
        path: "/",
        role: "asset_view",
        element: <AssetDashboard/>,
      },
       {
        icon: <FaHome size={20} />,
        name: "dashboard",
        path: "/",
        role: "asset_zone",
        element: <AssetDashboard/>,
      },

      {
        icon: <FaHome size={20} />,
        name: "Asset Management",
        path: "/asset",
        role: "manager",
        element: <AssetPage/>,
      },
      {
        icon: <FaHome size={20} />,
        name: "Asset Management",
        path: "/asset",
        role: "asset_zone",
        element: <AssetPage/>,
      },
      {
        icon: <FaHome size={20} />,
        name: "Asset Management",
        path: "/asset",
        role: "asset_view",
        element: <AssetPage/>,
      },
       {
        icon: <FaHome size={20} />,
        name: "Asset Management",
        path: "/asset",
        role: "admin",
        element: <AssetPage/>,
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
        name: "Fleet Stats",
        path: "/",
        role: "user",
        element: <AdminDasboard/>
      },
       {
        icon: <FaHome size={20} />,
        name: "Asset Stats",
        path: "/asset_stat",
        role: "user",
        element: <AssetDashboard/>,
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
        path: "fleet-sign-in",
        element:<FleetSignIn/>,
      },
{
        icon: null,
        name: "sign in",
        path: "",
        element:<SignIn/>,
      },
       {
        icon: null,
        name: "sign in",
        path: "store-sign-in",
        element:<StoreSignIn/>,
      },
      {
        icon: null,
        name: "sign in",
        path: "asset-sign-in",
        element:<AssetSignIn/>,
      },
      {
        icon: null,
        name: "sign in",
        path: "accommodation-sign-in",
        element:<AccommodationSignIn/>,
      },
    ],
  },
];

export default routes;
