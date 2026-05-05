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
import VehicleForm from "../../components/VehicleForm";
import { use } from "react";
import { DeleteVehicleThunk, FetchVehicleThunk, GetSingleVehicleThunk } from "../../store/thunks/VehicleThunk";
import { FetchServerTableThunk } from "../../store/thunks/ServerTableThunk";
import ViewVehicle from "../../components/ViewVehicle";
import Allocation from "../../components/Allocation";
import { FetchAllocationByVehicleThunk } from "../../store/thunks/AllocationThunk";
import { FetchRemarksByVehicleThunk } from "../../store/thunks/RemarkThunk";
import RemarkForm from "../../components/RemarkForm";

 const ViewAllocationPage = () => {
  const [open, setOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openAllocation, setOpenAllocation] = useState(false);
  const [single, setSingle] = useState({})
    const [openRemark, setRemark] = useState(false);

  const dispatch=useDispatch()
  const isServerSide = true;
   const serverTableState = useSelector((state) => state.FetchSlice?.serverTable);
  
  const displayData = isServerSide ? (serverTableState?.data || []) : (data || []);
  const isLoading = isServerSide ? serverTableState?.loading : loading;
  const singleData = useSelector((state) => state.FetchSlice?.singleData);
  
  // Server-side state for filters
  const [searchTerm, setSearchTerm] = useState('');
 const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
 useEffect(() => {
    
    dispatch(FetchServerTableThunk({ 
      type: 'vehicle',
      pageIndex: 0,
      pageSize: 20
    }));
  }, [dispatch]);
  

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

    const handleOpenView = (row) =>{
     dispatch(GetSingleVehicleThunk(row.original.id)).then(() => {    
    setOpenView(true)
   });
  };
  
 const handleOpenRemark =(row)=>{
  
      dispatch(FetchRemarksByVehicleThunk(row.original.id)).then(() => {    
   setSingle(row.original)

        setRemark(true)
 })
 }

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
      <div className="flex space-x-2">
        <Button size="sm" color="gray" onClick={() => handleOpenView(row)}>
            <FaEye /> 
        </Button>
{role!=="zone" && (
 <Button size="sm" color="green" onClick={() => handleOpenRemark(row)}>
          Add Remark
        </Button>
) }
       
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



  return (
    <>
    <Card className="ml-10 border  overflow-x-auto  border-blue-gray-100 shadow-sm p-10 my-4 h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Vehicle Allocation Records</h2>
      </div>

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
                           
    </Card>
    <ModalComponent size={"xl"} open={open} setOpen={setOpen} title="Enter Vehicle Details">
      <VehicleForm  setOpen={setOpen} />
    </ModalComponent>
    <ModalComponent size={"xl"} open={showEdit} setOpen={setShowEdit} title="Edit Vehicle">
      <VehicleForm isEdit = {true} setOpen={setShowEdit}  vehicleData={singleData} />
    </ModalComponent>

 <ModalComponent size={"xl"} open={openView} setOpen={setOpenView} title="View Vehicle">
    <ViewVehicle vehicleData={singleData} setOpen={setOpenView}/>
    </ModalComponent>
    <ModalComponent size={"xl"} open={openAllocation} setOpen={setOpenAllocation} title="Allocate Vehicle">
      <Allocation  setOpen={setOpenAllocation} vehicleData={single}/>
    </ModalComponent>


     <ModalComponent size={"xl"} open={openRemark} setOpen={setRemark} title="Add Remark">
      <RemarkForm  setOpen={setRemark} vehicleData={single}/>
    </ModalComponent>
 </> );
};

export default ViewAllocationPage