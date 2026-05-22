import { Card, Button } from "@material-tailwind/react";
import { useState, useMemo, useEffect } from "react";

import TableComponent from "../../components/Table";
import ModalComponent from "../../components/Modal";

import { deleteUser, getUser, suspendUser, unsuspendUser } from "../../services/API";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaPencilAlt, FaTrash, FaUserAlt, FaUserAltSlash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { Cell } from "jspdf-autotable";
import moment from "moment/moment";
import ServerSideTableComponent from "../../components/ServerSideTable";
import { use } from "react";
import { FetchServerTableThunk } from "../../store/thunks/ServerTableThunk";


import { GiSteeringWheel } from "react-icons/gi";

import LogBookForm from "../../components/LogBook";
import { FetchLogBooksByVehicleThunk } from "../../store/thunks/LogBookThunk";
import { FetchMaintenanceRequestByVehicleThunk } from "../../store/thunks/MaintenanceRequestThunk";
import MaintenanceRequestForm from "../../components/MaintenanceRequest";

 const DriverPage = () => {
  const [open, setOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openAllocation, setOpenAllocation] = useState(false);
  const [single, setSingle] = useState({})
  const [showDrivers, setShowDrivers] = useState(false);

  
  const dispatch=useDispatch()
  const isServerSide = true;
   const serverTableState = useSelector((state) => state.FetchSlice?.serverTable);
  
  const displayData = isServerSide ? (serverTableState?.data || []) : (data || []);
  const isLoading = isServerSide ? serverTableState?.loading : loading;
  const singleData = useSelector((state) => state.FetchSlice?.singleData);

  // Server-side state for filters
  const [searchTerm, setSearchTerm] = useState('');
 const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
 const [openMain,setOpenMain]=useState(false)

  


  
  

    const handleOpenView = (row) =>{
     dispatch(FetchLogBooksByVehicleThunk(row.original.id)).then(() => {  
      setSingle(row.original)  
    setOpenView(true)
   });
  };

   const handleOpenMain = (row) =>{
     dispatch(FetchMaintenanceRequestByVehicleThunk(row.original.id)).then(() => {  
      setSingle(row.original)  
    setOpenMain(true)
   });
  };
  
 

  const role = sessionStorage.getItem("role");
  
  
   const vehicleColumns = [
 
  {
    Header: "Chassis Number",
    accessor: "chassisNumber",
    Cell: ({ row }) => <div>{row.original.chassisNumber || "N/A"}</div>,
  },
    
  {
    Header: "Command",
    accessor: "command",
    Cell: ({ row }) => <div>{row.original.command || "N/A"}</div>,
  },
  // {
  //   Header: "Condition",
  //   accessor: "condition",
  //   Cell: ({ row }) => {
  //     const condition = row.original.condition;
  //     let colorClass = "text-gray-600";
  //     if (condition === "SERVICEABLE") colorClass = "text-green-600 font-semibold";
  //     if (condition === "UNSERVICEABLE") colorClass = "text-red-600";
      
      
  //     return <div className={colorClass}>{condition || "N/A"}</div>;
  //   },
  // },
  
  {
    Header: "Date",
    accessor: "createdAt",
    Cell: ({ row }) => (
      <div>{row.original.createdAt ? moment(row.original.createdAt).format("DD-MM-YYYY HH:mm A") : "N/A"}</div>
    ),
  },
  
  
  {
    Header: "Actions",
    Cell: ({ row }) => (
      <div className="flex space-x-2 w-full justify-start">
        <Button size="sm" color="blue" onClick={() => handleOpenView(row)}>
           {role =="driver"? "Fill Log Book":"Check Log Book"} 
        </Button>

         <Button size="sm" color="orange" onClick={() => handleOpenMain(row)}>
           {"Request for Maintenace"} 
        </Button>

        </div>
    ),
  },
      
    ];



  return (
    <>
    <Card className="ml-auto border w-full overflow-x-auto  border-blue-gray-100 shadow-sm p-10 h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Vehicle Allocation Records</h2>
      </div>
<div className="overflow-x-auto max-w-[100%]">

                             <ServerSideTableComponent
                               type={"vehicle"}
                               columns={vehicleColumns}
                               serverSideFiltering={isServerSide}
                               serverSideSorting={isServerSide}
                            
                               // Pass filter state for server-side operations
                               searchTerm={searchTerm}
                               onSearchChange={setSearchTerm}
                            
                               dateRange={dateRange}
                               onDateRangeChange={setDateRange}
                             />
                           </div>
    </Card>
    
    <ModalComponent size={"xl"} open={openView} setOpen={setOpenView} title="ENTER LOG BOOK ">
      <LogBookForm setOpen={setOpenView} vehicleData={single}/>
    </ModalComponent>

    <ModalComponent size={"xl"} open={openMain} setOpen={setOpenMain} title="Request For Maintenance ">
   
   <MaintenanceRequestForm setOpen={setOpenMain} vehicleData={single}/>
    </ModalComponent>
 </> );
};

export default DriverPage