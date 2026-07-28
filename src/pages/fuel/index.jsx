import { Card, Button, Chip, Typography, Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaGasPump, FaCheckCircle, FaTimesCircle, FaClock, FaPrint, FaFileExport, FaFilter, FaEye, FaPencilAlt, FaTrash } from "react-icons/fa";
import { MdLocalGasStation } from "react-icons/md";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import { FaCar, FaUser, FaMapMarkerAlt} from "react-icons/fa";

// Import components
import ServerSideTableComponent from "../../components/ServerSideTable";
import ModalComponent from "../../components/Modal";
import FuelRequestForm from "../../components/FuelRequestForm";

// Import thunks
import { FetchServerTableThunk } from "../../store/thunks/ServerTableThunk";
import { 
  ApproveFuelRequestThunk, 
  DispenseFuelRequestThunk,
  CancelFuelRequestThunk,
  DeleteFuelRequestThunk
} from "../../store/thunks/FuelRequestThunk";
import { GetSingleVehicleThunk } from "../../store/thunks/VehicleThunk";
import FuelRequestDetails from "../../components/FuelDetails";

const FuelRequestPage = () => {
  const dispatch = useDispatch();
  
  // State management
  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [openDispense, setOpenDispense] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // all, pending, approved, dispensed, rejected
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Server-side state
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterStatus, setFilterStatus] = useState('');
  const [filterFuelType, setFilterFuelType] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger
  
  // Redux state
  const serverTableState = useSelector((state) => state.FetchSlice?.serverTable);
  const singleData = useSelector((state) => state.FetchSlice?.singleData);
  const userRole = sessionStorage.getItem("role");
  const userId = sessionStorage.getItem("e");

  const isServerSide = true;
  const displayData = isServerSide ? (serverTableState?.data || []) : [];
  const isLoading = isServerSide ? serverTableState?.loading : false;

  // Fetch fuel requests with refresh trigger
  const fetchFuelRequests = (params = {}) => {
    dispatch(FetchServerTableThunk({ 
      type: 'fuel', 
      pageIndex: 0, 
      pageSize: 20,
      search: searchTerm,
      status: filterStatus || viewMode,
      fuelType: filterFuelType,
      startDate: dateRange.start,
      endDate: dateRange.end,
      ...params
    }));
  };

  // Initial fetch and refresh
  useEffect(() => {
    fetchFuelRequests();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  // Handlers
  const handleEdit = (row) => {
    setSelectedRequest(row.original);
    setIsEditMode(true);
    setOpenForm(true); // Open the form modal
  };

  const handleViewDetails = (row) => {
    setSelectedRequest(row.original);
    setOpenDetails(true);
  };

  const handleDeleteRequest = async (row) => {
    if (window.confirm(`Are you sure you want to delete fuel request #${row.original.requestNumber}? This action cannot be undone.`)) {
      try {
        await dispatch(DeleteFuelRequestThunk(row.original.id)).unwrap();
        // Refresh the table after successful deletion
        setRefreshTrigger(prev => prev + 1);
        // Show success notification (optional)
        // toast.success('Fuel request deleted successfully');
      } catch (error) {
        console.error('Error deleting fuel request:', error);
        // Show error notification (optional)
        // toast.error('Failed to delete fuel request');
      }
    }
  };

  // Handle form close and refresh
  const handleFormClose = (shouldRefresh = false) => {
    setOpenForm(false);
    setSelectedRequest(null);
    setIsEditMode(false);
    if (shouldRefresh) {
      setRefreshTrigger(prev => prev + 1);
    }
  };

  // Handle details close
  const handleDetailsClose = (shouldRefresh = false) => {
    setOpenDetails(false);
    setSelectedRequest(null);
    if (shouldRefresh) {
      setRefreshTrigger(prev => prev + 1);
    }
  };
  
  const handleViewChange = (value) => {
    setViewMode(value);
    const statusMap = {
      'all': '',
      'pending': 'Pending',
      'approved': 'Approved',
      'dispensed': 'Dispensed',
      'rejected': 'Rejected',
      'cancelled': 'Cancelled'
    };
    setFilterStatus(statusMap[value] || '');
    fetchFuelRequests({ status: statusMap[value] || '' });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'orange';
      case 'Approved': return 'green';
      case 'Rejected': return 'red';
      case 'Dispensed': return 'blue';
      case 'Cancelled': return 'gray';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <FaClock className="w-4 h-4" />;
      case 'Approved': return <FaCheckCircle className="w-4 h-4" />;
      case 'Rejected': return <FaTimesCircle className="w-4 h-4" />;
      case 'Dispensed': return <FaGasPump className="w-4 h-4" />;
      default: return null;
    }
  };

  const role = sessionStorage.getItem("role");
  
  // Check if user can edit/delete
  const canModify = (row) => {
    const status = row.original.status;
    // Only allow modification for Pending requests
    if (status !== 'Pending') return false;
    
    // Drivers can only modify their own requests
    if (role === 'driver') {
      return row.original.userId === userId;
    }
    
    // Admins can modify all pending requests
    return ['admin', 'super_admin'].includes(role);
  };

  // Table columns
  const fuelRequestColumns = [
    {
      Header: "Request #",
      accessor: "requestNumber",
      Cell: ({ row }) => (
        <div className="font-mono text-sm font-semibold text-blue-600">
          {row.original.requestNumber || "N/A"}
        </div>
      ),
    },
    
    {
      Header: "Requester",
      accessor: "requesterName",
      Cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.requesterName || "N/A"}</div>
        </div>
      ),
    },
        
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Chip 
            value={row.original.status || "Pending"} 
            color={getStatusColor(row.original.status)}
            size="sm"
            className="rounded-full"
          />
        </div>
      ),
    },
    {
      Header: "Created",
      accessor: "createdAt",
      Cell: ({ row }) => (
        <div className="text-sm">
          {row.original.createdAt ? moment(row.original.createdAt).format("DD-MM-YYYY HH:mm") : "N/A"}
        </div>
      ),
    },
    {
      Header: "Actions",
      Cell: ({ row }) => {
        const canModifyRow = canModify(row);
        
        return (
          <div className="flex flex-wrap gap-1">
            <Button 
              size="sm" 
              color="blue" 
              variant="text"
              onClick={() => handleViewDetails(row)}
              className="p-1"
            >
              <FaEye className="w-4 h-4" />
            </Button>
            
            {canModifyRow && (
              <>
                <Button 
                  size="sm" 
                  color="orange" 
                  variant="text"
                  onClick={() => handleEdit(row)}
                  className="p-1"
                >
                  <FaPencilAlt className="w-4 h-4" />
                </Button>

                <Button 
                  size="sm" 
                  color="red" 
                  variant="text"
                  onClick={() => handleDeleteRequest(row)}
                  className="p-1"
                >
                  <FaTrash className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <>
      <Card className="ml-auto border w-full overflow-x-auto border-blue-gray-100 shadow-sm p-6 h-fit">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <Typography variant="h4" color="blue-gray" className="flex items-center gap-2">
              <MdLocalGasStation className="w-6 h-6 text-blue-500" />
              Fuel Request Management
            </Typography>
            <Typography variant="small" color="gray">
              Manage and track all fuel requests for vehicles
            </Typography>
          </div>
          
          {/* Optional: Add a refresh button */}
          <Button
            size="sm"
            color="blue"
            variant="outlined"
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            className="flex items-center gap-2"
          >
            Refresh
          </Button>
        </div> 
         
        {/* Table */}
        <div className="overflow-x-auto max-w-[100%]">
          <ServerSideTableComponent
            type={"fuel"}
            columns={fuelRequestColumns}
            serverSideFiltering={isServerSide}
            serverSideSorting={isServerSide}
            searchTerm={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              fetchFuelRequests({ search: value });
            }}
            dateRange={dateRange}
            onDateRangeChange={(range) => {
              setDateRange(range);
              fetchFuelRequests(range);
            }}
          />
        </div>
      </Card>

      {/* Edit Modal */}
      <ModalComponent 
        size={"xl"} 
        open={openForm} 
        setOpen={setOpenForm} 
        title={isEditMode ? "Edit Fuel Request" : "Create Fuel Request"}
      >
        {selectedRequest && (
          <FuelRequestForm 
            setOpen={handleFormClose}
            initialRequest={selectedRequest}
            isEditMode={isEditMode}
            onSuccess={() => {
              handleFormClose(true);
            }}
          />
        )}
      </ModalComponent>

      {/* Details Modal */}
      <ModalComponent 
        size={"lg"} 
        open={openDetails} 
        setOpen={setOpenDetails} 
        title="Fuel Request Details"
      >
        {selectedRequest && (
          <FuelRequestDetails 
            selectedRequest={selectedRequest}
            fetchFuelRequests={() => {
              setRefreshTrigger(prev => prev + 1);
            }} 
            onClose={() => handleDetailsClose(false)} 
          />
        )}
      </ModalComponent>
    </>
  );
};

export default FuelRequestPage;