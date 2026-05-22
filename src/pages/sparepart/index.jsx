import { Card, Button } from "@material-tailwind/react";
import { useState, useMemo, useEffect } from "react";

import ModalComponent from "../../components/Modal";

import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaPencilAlt, FaTrash, FaUserAlt, FaUserAltSlash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { Cell } from "jspdf-autotable";
import moment from "moment/moment";
import ServerSideTableComponent from "../../components/ServerSideTable";
import { use } from "react";
import {  GetSingleVehicleThunk } from "../../store/thunks/VehicleThunk";
import { FetchServerTableThunk } from "../../store/thunks/ServerTableThunk";
import { GiSteeringWheel } from "react-icons/gi";
import ViewRequest from "../../components/ViewRequest";
import { FetchSingleSparePartRequestThunk } from "../../store/thunks/SparePartRequestThunk";

 const SparePartPage = () => {
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

  

 

  
    
  
 

  const role = sessionStorage.getItem("role");
  
  
   const vehicleColumns = [
 
  {
    Header: "Chassis Number",
    accessor: "chassisNumber",
    Cell: ({ row }) => <div>{row.original.vehicleAssessment?.chassisNumber || "N/A"}</div>,
  },
    
  {
    Header: "Request Number",
    accessor: "requestNumber",
    Cell: ({ row }) => <div>{row.original.requestNumber|| "N/A"}</div>,
  },
  {
    Header: "Priority",
    accessor: "priority",
    Cell: ({ row }) => {
      const condition = row.original.priority;
      let colorClass = "text-gray-600";
      if (condition === "Low") colorClass = "text-green-600 font-semibold";
      if (condition === "High") colorClass = "text-red-600";
        if (condition === "Medium") colorClass = "text-orange-600";
      
      return <div className={colorClass}>{condition || "N/A"}</div>;
    },
  },
  
  {
    Header: "Date",
    accessor: "createdAt",
    Cell: ({ row }) => (
      <div>{row.original.created ? moment(row.original.created).format("DD-MM-YYYY HH:mm A") : "N/A"}</div>
    ),
  },
  
  {    Header: "Action",
    Cell: ({ row }) => (
      <div className="flex space-x-2 w-full justify-start">
        
 <Button size="sm" color="gray" onClick={() => handleOpenMain(row)}>
           {"Check Request"} 
        </Button>

            </div>
    )
  },
 
      
    ];



 
   const handleOpenMain = (row) =>{
     dispatch(FetchSingleSparePartRequestThunk(row.original.id)).then(()=>{
     
      setOpenMain(true)
    }
    )
       
     
    };



  return (
    <>
    <Card className="ml-auto border  border-blue-gray-100 shadow-sm p-10 h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Spare Part Request Records</h2>
      </div>

<div className="overflow-x-auto max-w-[100%]">
  <ServerSideTableComponent
                               type={"sparepart"}
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
   



 <ModalComponent size={"xl"} open={openMain} setOpen={setOpenMain} title="View Spare Part Request">
    <ViewRequest requestData={singleData} setOpen={setOpenMain}/>
    </ModalComponent>
   

   
 </> );
};

export default SparePartPage