import { Card, Button } from "@material-tailwind/react";
import { useState, useMemo, useEffect } from "react";

import TableComponent from "../../../components/Table";
import ModalComponent from "../../../components/Modal";

import { deleteUser, getUser, suspendUser, unsuspendUser } from "../../../services/API";
import Skeleton from "react-loading-skeleton";
import UserForm from "../../../components/OfficersForm/Officerformpage";
import { useDispatch, useSelector } from "react-redux";
import { FetchUserThunk } from "../../../store/thunks/UserThunk";
import { FaTrash, FaUserAlt, FaUserAltSlash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { Cell } from "jspdf-autotable";
import ResetPassword from "../../../components/ResetPassword";
import moment from "moment/moment";
import ServerSideTableComponent from "../../../components/ServerSideTable";

 const OfficerPage = () => {
  const [open, setOpen] = useState(false);
  const {loading,data}=useSelector(state=>state.userSlice)
  const [userData,setUserData]=useState({})
  const [factorys,setFactorys]=useState([])
  const [showEdit, setShowEdit] = useState(false);
  const [commands,setCommands]=useState([])
  const [openReset, setOpenReset] = useState(false);
  const users=data
  const dispatch=useDispatch()
  const isServerSide = true;
   const serverTableState = useSelector((state) => state.FetchSlice?.serverTable);
  
  const displayData = isServerSide ? (serverTableState?.data || []) : (data || []);
  const isLoading = isServerSide ? serverTableState?.loading : loading;
 
  
  // Server-side state for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [factoryFilter, setFactoryFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

      
  
  const handleSuspend = (row) => {
    if(confirm("Are you sure you want to suspend this user?")){
          console.log(row)

      suspendUser(row.userId,row.userType).then((res) => {
        window.location.reload();
      }).catch(err=>alert("Something went wrong"))
    }

  };

  const handleDelete = (row) => {
    if(confirm("Are you sure you want to delete this user?")){
          console.log(row)

      deleteUser(row.userId,row.userType).then((res) => {
        window.location.reload();
      }).catch(err=> console.log(err))
    }
  };

    const handleOpenReset = (row) => {
   setUserData(row)
    setOpenReset(true);
  };
  
  const handleUnsuspend = (row) => {
    if(confirm("Are you sure you want to unsuspend this user?")){
    console.log(row)
      unsuspendUser(row.userId,row.userType).then((res) => {
        window.location.reload();
      }).catch(err=>alert("Something went wrong"))
    }
  };

  const role = sessionStorage.getItem("role");
  
  
  const columns = useMemo(()=>  [
    {
      Header: "svn",
      Cell: ({ row }) => <div>{row.original.svn || "N/A"}</div>,
    },
    {
      Header: "Name",
      accessor: "fullname",
    },
    
     {
      Header: "Command",
      accessor: "command",
      Cell: ({row}) => (
        <div>{row.original.command || "N/A"}</div>
      ),
    },
    {
      Header: "Phone",

      accessor: "phone",
    },
    {
      Header: "Email",
      accessor: "email",
    },
     {
      Header: "System Type",
      accessor: "userType",
    },
    {
      Header: "Role",
      accessor: "accessLevel",
      Cell: ({row}) => (
        <div>{row.original.accessLevel?.replace("_"," ")}</div>
      ),
    },
    

    {
      Header: "Date",
      accessor:"dateCreated",
      Cell: ({row}) => (
        <div>{moment(row.original.dateCreated).format("DD-MM-YYYY HH:mm A")}</div>
      ),
    },
    {
      Header: "Action",
      Cell: ({row}) => (
        <>
        <div className="flex gap-2">
          {/* {role ==="admin" && (
            <>

            <Button color="orange" size="sm" 
            onClick={()=>handleOpenReset(row.original)}>
             Reset Password</Button>
            </>
          )} */}
        <Button color="blue" size="sm" onClick={()=>handleOpenEdit(row.original)}><FaPencil/></Button>
       {row.original.status ==="Suspended" ? (
        <>
        <Button color="green" size="sm" onClick={() => handleUnsuspend(row.original)}><FaUserAlt/></Button>
        </>
       ):(
        <Button color="red" size="sm" onClick={() => handleSuspend(row.original)}><FaUserAltSlash/></Button>
       )}
       
      {['admin'].includes(role) &&(
         <Button color="red" size="sm" onClick={() => handleDelete(row.original)}><FaTrash/></Button>
      )} 
       

        </div>
        
        </>
      )
    }
    
  ]
  );


  const handleOpen = () => {
   
        setOpen(true);   
     
  };

  const handleOpenEdit = (row) => {
   setUserData(row)
    setShowEdit(true)
     
  }


  return (
    <>
    <Card className="ml-10 border overflow-x-auto  border-blue-gray-100 shadow-sm p-6 my-4 h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">User Record</h2>
        <Button className="bg-green-500" onClick={handleOpen}>+New User</Button>  
      </div>

                             <ServerSideTableComponent
                               type={"officer"}
                               data={displayData}
                               columns={columns}
                               serverSideFiltering={isServerSide}
                               serverSideSorting={isServerSide}
                               pageSize={20}
                               // Pass filter state for server-side operations
                               searchTerm={searchTerm}
                               onSearchChange={setSearchTerm}
                               factoryFilter={factoryFilter}
                               onFactoryFilterChange={setFactoryFilter}
                               dateRange={dateRange}
                               onDateRangeChange={setDateRange}
                             />
                           
    </Card>
    <ModalComponent size={"xl"} open={open} setOpen={setOpen} title="Add New User">
      <UserForm factory={factorys} commands={commands} setOpen={setOpen} />
    </ModalComponent>
    <ModalComponent size={"xl"} open={showEdit} setOpen={setShowEdit} title="Edit User">
      <UserForm isEdit={true} setOpen={setShowEdit} userData={userData} />
    </ModalComponent>

    {/* <ModalComponent size={"sm"} open={openReset} setOpen={setOpenReset} title="Reset Password">
    <ResetPassword setOpen={setOpenReset} userData={userData}/>
    </ModalComponent> */}
    </>
  );
};

export default OfficerPage