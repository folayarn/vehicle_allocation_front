import { Card, Button } from "@material-tailwind/react";
import { useState, useMemo, useEffect } from "react";

import TableComponent from "../../../components/Table";
import ModalComponent from "../../../components/Modal";

import { deleteUser, getUser, suspendUser, unsuspendUser } from "../../../services/API";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaPencilAlt, FaTrash, FaUserAlt, FaUserAltSlash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { Cell } from "jspdf-autotable";
import moment from "moment/moment";
import ServerSideTableComponent from "../../../components/ServerSideTable";
import VehicleForm from "../../../components/VehicleForm";
import { use } from "react";
import { DeleteVehicleThunk, FetchVehicleThunk, GetSingleVehicleThunk } from "../../../store/thunks/VehicleThunk";
import { FetchServerTableThunk } from "../../../store/thunks/ServerTableThunk";
import ViewVehicle from "../../../components/ViewVehicle";
import Allocation from "../../../components/Allocation";
import { FetchAllocationByVehicleThunk } from "../../../store/thunks/AllocationThunk";
import { GiSteeringWheel } from "react-icons/gi";
import DriverForm from "../../../components/DriverForm";
import { FetchDriversByVehicleThunk } from "../../../store/thunks/DriverThunk";
import { FetchMaintenanceRequestByVehicleThunk } from "../../../store/thunks/MaintenanceRequestThunk";
import MaintenanceRequestForm from "../../../components/MaintenanceRequest";

 const AllVehiclePage = () => {
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

  

  const handleDelete = (id) => {
    if(confirm("Are you sure you want to delete this Vehicle?")){
     dispatch(DeleteVehicleThunk(id)).then(() => {

      dispatch(FetchServerTableThunk({ type: 'vehicle', pageIndex: 0, pageSize: 20 })); 
     });
    }
}   
const handleOpenAllocation = (row) => {
    dispatch(FetchAllocationByVehicleThunk(row.original.id)).then(() => {    
   setSingle(row.original)
      setOpenAllocation(true);
    });
  }

  const handleOpenDriverForm = (row) => {
    dispatch(FetchDriversByVehicleThunk(row.original.id)).then(() => {    
   setSingle(row.original)
      setShowDrivers(true);
    });
  }
  

    const handleOpenView = (row) =>{
     dispatch(GetSingleVehicleThunk(row.original.id)).then(() => {    
    setOpenView(true)
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
  {
    Header: "Condition",
    accessor: "condition",
    Cell: ({ row }) => {
      const condition = row.original.condition;
      let colorClass = "text-gray-600";
      if (condition === "SERVICEABLE") colorClass = "text-green-600 font-semibold";
      if (condition === "UNSERVICEABLE") colorClass = "text-red-600";
      
      
      return <div className={colorClass}>{condition || "N/A"}</div>;
    },
  },
  
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
        <Button size="sm" color="gray" onClick={() => handleOpenView(row)}>
            <FaEye /> 
        </Button>
        <Button size="sm" color="blue" onClick={() => handleOpenEdit(row)}>
          <FaPencilAlt /> 
        </Button>
       {role =="admin" && (
<Button size="sm" color="red" onClick={() => handleDelete(row.original.id)}>
          <FaTrash /> 
        </Button>
       )}
        

        </div>
    ),
  },
      
    ];



  const handleOpen = () => {
   
        setOpen(true);   
     
  };

  const handleOpenEdit = (row) => {
   dispatch(GetSingleVehicleThunk(row.original.id)).then(() => {    
    setShowEdit(true)
   });
  }


   const handleOpenMain = (row) =>{
       dispatch(FetchMaintenanceRequestByVehicleThunk(row.original.id)).then(() => {  
        setSingle(row.original)  
      setOpenMain(true)
     });
    };



  return (
    <>
    <Card className="ml-auto border  border-blue-gray-100 shadow-sm p-10 h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Vehicle Records</h2>
        <Button className="bg-green-500" onClick={handleOpen}>+ Add New Vehicle</Button>  
      </div>

<div className="overflow-x-auto max-w-[100%]">
  <ServerSideTableComponent
                               type={"getVehicleAll"}
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
    <ModalComponent size={"xl"} open={open} setOpen={setOpen} title="Enter Vehicle Details">
      <VehicleForm  setOpen={setOpen} />
    </ModalComponent>
    <ModalComponent size={"xl"} open={showEdit} setOpen={setShowEdit} title="Edit Vehicle">
      <VehicleForm isEdit = {true} setOpen={setShowEdit}  vehicleData={singleData} />
    </ModalComponent>
 <ModalComponent size={"xl"} open={openMain} setOpen={setOpenMain} title="Request For Maintenance ">
   
   <MaintenanceRequestForm setOpen={setOpenMain} vehicleData={single}/>
    </ModalComponent>



 <ModalComponent size={"xl"} open={openView} setOpen={setOpenView} title="View Vehicle">
    <ViewVehicle vehicleData={singleData} setOpen={setOpenView}/>
    </ModalComponent>
    <ModalComponent size={"xl"} open={openAllocation} setOpen={setOpenAllocation} title="Allocate Vehicle">
      <Allocation  setOpen={setOpenAllocation} vehicleData={single}/>
    </ModalComponent>

    <ModalComponent size={"xl"} open={showDrivers} setOpen={setShowDrivers} title="Add Driver">
      <DriverForm setOpen={setShowDrivers} vehicleData={single}/>
    </ModalComponent>
 </> );
};

export default AllVehiclePage