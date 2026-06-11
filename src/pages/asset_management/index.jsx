import { Card, Button } from "@material-tailwind/react";
import { useState, useMemo, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { 
  FaEye, 
  FaPencilAlt, 
  FaTrash, 
  FaUserAlt, 
  FaUserAltSlash,
  FaBuilding,
  FaMapMarkerAlt,
  FaBolt,
  FaTachometerAlt,
  FaClipboardList,
  FaInfoCircle
} from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { Cell } from "jspdf-autotable";
import moment from "moment/moment";
import ModalComponent from "../../components/Modal";
import ServerSideTableComponent from "../../components/ServerSideTable";
import AssetForm from "../../components/AssetForm";
import { 
  DeleteAssetThunk,
  FetchSingleAssetThunk,
  UpdateAssetThunk
} from "../../store/thunks/AssetThunk";
import { FetchServerTableThunk } from "../../store/thunks/ServerTableThunk";

const AssetPage = () => {
  const [open, setOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [single, setSingle] = useState({});
  const [selectedAsset, setSelectedAsset] = useState(null);

  const dispatch = useDispatch();
  const isServerSide = true;
  const serverTableState = useSelector((state) => state.FetchSlice?.serverTable);
  
  const displayData = isServerSide ? (serverTableState?.data || []) : [];
  const isLoading = isServerSide ? serverTableState?.loading : false;
  const singleData = useSelector((state) => state.FetchSlice?.singleData);
  
  // Server-side state for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [openMain, setOpenMain] = useState(false);
  const role = sessionStorage.getItem("role");

  // Helper function to get condition badge color
  const getConditionColor = (condition) => {
    switch(condition?.toLowerCase()) {
      case 'good': return 'text-green-600 font-semibold';
      case 'fair': return 'text-yellow-600 font-semibold';
      case 'poor': return 'text-red-600 font-semibold';
      case 'under_renovation': return 'text-blue-600 font-semibold';
      default: return 'text-gray-600';
    }
  };

  // Helper function to get status badge color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'serviceable': return 'bg-green-100 text-green-800';
      case 'dilapidated': return 'bg-red-100 text-red-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'needs_renovation': return 'bg-orange-100 text-orange-800';
      case 'active': return 'bg-purple-100 text-purple-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'abandoned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get asset type icon
  const getAssetTypeIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'land': return <FaBuilding className="inline mr-1" />;
      case 'electrical': return <FaBolt className="inline mr-1" />;
      case 'project': return <FaClipboardList className="inline mr-1" />;
      default: return <FaBuilding className="inline mr-1" />;
    }
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this Asset?")) {
      dispatch(DeleteAssetThunk(id)).then(() => {
        dispatch(FetchServerTableThunk({ type: 'asset', pageIndex: 0, pageSize: 20 }));
      });
    }
  };

  const handleOpenView = (row) => {
    dispatch(FetchSingleAssetThunk(row.original.id)).then(() => {
      setOpenView(true);
    });
  };

  const handleOpenEdit = (row) => {
    dispatch(FetchSingleAssetThunk(row.original.id)).then(() => {
      setSelectedAsset(row.original);
      setShowEdit(true);
    });
  };

  const handleOpenMain = (row) => {
    setSingle(row.original);
    setOpenMain(true);
  };

  // Asset Columns Definition
  const assetColumns = [
    {
      Header: "Asset Name",
      accessor: "assetName",
      Cell: ({ row }) => (
        <div className="font-medium max-w-[200px] truncate" title={row.original.assetName}>
          {getAssetTypeIcon(row.original.assetType)}
          {row.original.assetName || "N/A"}
        </div>
      ),
    },
    {
      Header: "Type",
      accessor: "assetType",
      Cell: ({ row }) => {
        const type = row.original.assetType;
        let typeLabel = "N/A";
        let typeColor = "text-gray-600";
        
        if (type === "land") {
          typeLabel = "Land";
          typeColor = "text-green-600";
        } else if (type === "electrical") {
          typeLabel = "Electrical";
          typeColor = "text-blue-600";
        } else if (type === "project") {
          typeLabel = "Project";
          typeColor = "text-purple-600";
        }
        
        return <div className={typeColor}>{typeLabel}</div>;
      },
    },
    {
      Header: "Zone",
      accessor: "zone",
      Cell: ({ row }) => <div>{row.original.zone || "N/A"}</div>,
    },
    {
      Header: "Command",
      accessor: "command",
      Cell: ({ row }) => <div className="max-w-[150px] truncate" title={row.original.command}>{row.original.command || "N/A"}</div>,
    },
    {
      Header: "Location",
      accessor: "location",
      Cell: ({ row }) => (
        <div className="max-w-[150px] truncate flex items-center gap-1" title={row.original.location}>
          <FaMapMarkerAlt className="text-gray-400 text-xs" />
          {row.original.location || "N/A"}
        </div>
      ),
    },
    {
      Header: "Capacity/Spec",
      accessor: "capacity",
      Cell: ({ row }) => {
        const capacity = row.original.capacity;
        const brand = row.original.brandName;
        const noOfBuilding = row.original.noOfBuilding;
        
        if (capacity) {
          return <div className="text-sm font-mono">{capacity}</div>;
        }
        if (brand) {
          return <div className="text-sm">{brand}</div>;
        }
        if (noOfBuilding) {
          return <div className="text-sm">{noOfBuilding} Building(s)</div>;
        }
        return <div className="text-gray-400 text-sm">N/A</div>;
      },
    },
    {
      Header: "Condition",
      accessor: "condition",
      Cell: ({ row }) => {
        const condition = row.original.condition;
        return (
          <span className={`capitalize ${getConditionColor(condition)}`}>
            {condition || "N/A"}
          </span>
        );
      },
    },
    {
      Header: "Status",
      accessor: "assetStatus",
      Cell: ({ row }) => {
        const status = row.original.assetStatus;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status?.replace(/_/g, ' ') || "N/A"}
          </span>
        );
      },
    },
    {
      Header: "Date Added",
      accessor: "createdAt",
      Cell: ({ row }) => (
        <div className="text-sm">
          {row.original.createdAt ? moment(row.original.createdAt).format("DD-MM-YYYY") : "N/A"}
        </div>
      ),
    },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button size="sm" color="blue" onClick={() => handleOpenView(row)} title="View Details">
            <FaEye />
          </Button>
           {["admin","user","manager"].includes(role) &&(
          <Button size="sm" color="teal" onClick={() => handleOpenEdit(row)} title="Edit Asset">
            <FaPencilAlt />
          </Button>
           )}
          {["admin"].includes(role) && (
            <Button size="sm" color="red" onClick={() => handleDelete(row.original.id)} title="Delete Asset">
              <FaTrash />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleOpenAdd = () => {
    setSelectedAsset(null);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setShowEdit(false);
    setOpenView(false);
    setSelectedAsset(null);
    // Refresh the table data
    dispatch(FetchServerTableThunk({ type: 'asset', pageIndex: 0, pageSize: 20 }));
  };

  return (
    <>
      <Card className="ml-auto border border-blue-gray-100 shadow-sm p-10 h-fit">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold">Asset Records</h2>
            <p className="text-gray-500 text-sm mt-1">
              Manage buildings, land, electrical assets, and construction projects
            </p>
          </div>
          {["admin","user","manager"].includes(role) &&(
 <Button className="bg-green-500 flex items-center gap-2" onClick={handleOpenAdd}>
            <FaBuilding />
            + Add New Asset
          </Button>
          )}
         
        </div>

        <div className="overflow-x-auto max-w-[100%]">
          <ServerSideTableComponent
            type={"asset"}
            columns={assetColumns}
            serverSideFiltering={isServerSide}
            serverSideSorting={isServerSide}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>
      </Card>

      {/* Add Asset Modal */}
      <ModalComponent size={"xl"} open={open} setOpen={setOpen} title="Add New Asset">
        <AssetForm setOpen={handleCloseModal} />
      </ModalComponent>

      {/* Edit Asset Modal */}
      <ModalComponent size={"xl"} open={showEdit} setOpen={setShowEdit} title="Edit Asset">
        <AssetForm setOpen={handleCloseModal} initialAsset={selectedAsset} />
      </ModalComponent>

      {/* View Asset Modal */}
      <ModalComponent size={"lg"} open={openView} setOpen={setOpenView} title="Asset Details">
        {singleData && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-gray-600">Asset Name:</label>
                <p>{singleData.assetName || "N/A"}</p>
              </div>
              <div>
                <label className="font-semibold text-gray-600">Asset Type:</label>
                <p className="capitalize">{singleData.assetType || "N/A"}</p>
              </div>
              <div>
                <label className="font-semibold text-gray-600">Serial Number:</label>
                <p>{singleData.serialNumber || "N/A"}</p>
              </div>
              <div>
                <label className="font-semibold text-gray-600">Zone:</label>
                <p>{singleData.zone || "N/A"}</p>
              </div>
              <div>
                <label className="font-semibold text-gray-600">Command:</label>
                <p>{singleData.command || "N/A"}</p>
              </div>
              <div>
                <label className="font-semibold text-gray-600">Location:</label>
                <p>{singleData.location || "N/A"}</p>
              </div>
              <div>
                <label className="font-semibold text-gray-600">Condition:</label>
                <p className="capitalize">{singleData.condition || "N/A"}</p>
              </div>
              <div>
                <label className="font-semibold text-gray-600">Status:</label>
                <p className="capitalize">{singleData.assetStatus?.replace(/_/g, ' ') || "N/A"}</p>
              </div>
              {singleData.capacity && (
                <div>
                  <label className="font-semibold text-gray-600">Capacity:</label>
                  <p>{singleData.capacity}</p>
                </div>
              )}
              {singleData.brandName && (
                <div>
                  <label className="font-semibold text-gray-600">Brand:</label>
                  <p>{singleData.brandName}</p>
                </div>
              )}
              {singleData.noOfBuilding && (
                <div>
                  <label className="font-semibold text-gray-600">No. of Buildings:</label>
                  <p>{singleData.noOfBuilding}</p>
                </div>
              )}
              {singleData.category && (
                <div>
                  <label className="font-semibold text-gray-600">Category:</label>
                  <p>{singleData.category}</p>
                </div>
              )}
              {singleData.buildingType && (
                <div>
                  <label className="font-semibold text-gray-600">Building Type:</label>
                  <p>{singleData.buildingType}</p>
                </div>
              )}
              {singleData.constructionCost && (
                <div>
                  <label className="font-semibold text-gray-600">Construction Cost:</label>
                  <p>₦{singleData.constructionCost.toLocaleString()}</p>
                </div>
              )}
              {singleData.acquisitionCost && (
                <div>
                  <label className="font-semibold text-gray-600">Acquisition Cost:</label>
                  <p>₦{singleData.acquisitionCost.toLocaleString()}</p>
                </div>
              )}
              {singleData.description && (
                <div className="col-span-2">
                  <label className="font-semibold text-gray-600">Description:</label>
                  <p className="text-gray-700">{singleData.description}</p>
                </div>
              )}
              {singleData.remark && (
                <div className="col-span-2">
                  <label className="font-semibold text-gray-600">Remarks:</label>
                  <p className="text-gray-700">{singleData.remark}</p>
                </div>
              )}
              {singleData.litigationStatus && (
                <div className="col-span-2">
                  <label className="font-semibold text-gray-600">Litigation Status:</label>
                  <p className="text-red-600">{singleData.litigationStatus}</p>
                </div>
              )}
              <div>
                <label className="font-semibold text-gray-600">Created At:</label>
                <p>{moment(singleData.createdAt).format("DD-MM-YYYY HH:mm")}</p>
              </div>
              {singleData.updatedAt && (
                <div>
                  <label className="font-semibold text-gray-600">Last Updated:</label>
                  <p>{moment(singleData.updatedAt).format("DD-MM-YYYY HH:mm")}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </ModalComponent>
    </>
  );
};

export default AssetPage;