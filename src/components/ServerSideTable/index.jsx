// components/ServerSideTableComponent.jsx
import PropTypes from 'prop-types';
import { Button } from '@material-tailwind/react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSVLink } from 'react-csv';
import { useTable, usePagination, useSortBy } from 'react-table';
import { FaFileCsv, FaFilePdf, FaPrint, FaSearch, FaFilter, FaCalendarAlt, FaSyncAlt } from 'react-icons/fa';
import Select from 'react-select';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FetchServerTableThunk } from '../../store/thunks/ServerTableThunk';

const ServerSideTableComponent = ({ 
  columns, 
  type,
  pageSize: initialPageSize = 20,
  serverSideSorting = true,
  serverSideFiltering = true
}) => {
  const dispatch = useDispatch();
  const tableState = useSelector(state => state.FetchSlice?.serverTable);
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [hoveredCell, setHoveredCell] = useState(null);
  const [sortBy, setSortBy] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  
  const itemsPerPage = initialPageSize;
  const timeoutRef = useRef(null);
  
  // Store current state in ref to avoid dependencies
  const stateRef = useRef({
    searchTerm: '',
    
    dateRange: { start: '', end: '' },
    sortBy: [],
    currentPage: 0
  });

  // Update ref when state changes
  useEffect(() => {
    stateRef.current = {
      searchTerm,
  
      dateRange,
      sortBy,
      currentPage
    };
  }, [searchTerm,  dateRange, sortBy, currentPage]);

  // Get data directly from Redux
  const displayData = tableState?.data || [];
  const displayTotalCount = tableState?.totalCount || 0;
  const isLoading = tableState?.loading || false;

  // SINGLE fetch function with NO dependencies
  const fetchData = (page = currentPage, resetPage = false) => {
    if (!serverSideFiltering) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      const pageToUse = resetPage ? 0 : page;
      const currentState = stateRef.current;
      
      if (resetPage) {
        setCurrentPage(0);
      }
      
      dispatch(FetchServerTableThunk({
        type,
        pageIndex: pageToUse,
        pageSize: itemsPerPage,
        filters: {
          search: currentState.searchTerm,
          dateRange: currentState.dateRange,
        },
        sort: currentState.sortBy
      }));
    }, 500);
  };

  // ONE SINGLE useEffect for initial load
  useEffect(() => {
    if (serverSideFiltering) {

      fetchData(0, true);
    }
  }, [serverSideFiltering, type]); // Only these two dependencies

  // Reset when type changes
  useEffect(() => {
    setSearchTerm('');
    
    setDateRange({ start: '', end: '' });
    setCurrentPage(0);
    setSortBy([]);
  }, [type]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  
  // SIMPLE event handlers
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    fetchData(currentPage, true);
  };

  

  const handleDateRangeChange = (key, value) => {
    setDateRange(prev => {
      const newDateRange = { ...prev, [key]: value };
      fetchData(currentPage, true);
      return newDateRange;
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchData(newPage, false);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(0);
    fetchData(0, false);
  };

  const handleRefresh = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    fetchData(currentPage, false);
  };

  const clearDateRange = () => {
    setDateRange({ start: '', end: '' });
    fetchData(currentPage, true);
  };

  // Table instance
  const tableInstance = useTable(
    {
      columns: useMemo(() => columns, [columns]),
      data: displayData,
      initialState: { 
        pageIndex: currentPage, 
        pageSize: itemsPerPage,
        sortBy: sortBy
      },
      manualPagination: serverSideFiltering,
      manualSortBy: serverSideSorting,
      pageCount: serverSideFiltering ? Math.ceil(displayTotalCount / itemsPerPage) : undefined,
      autoResetPage: false,
      autoResetSortBy: false,
    },
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state: { pageIndex, sortBy: currentSortBy },
  } = tableInstance;

  // Handle sorting from react-table
  useEffect(() => {
    if (serverSideSorting && JSON.stringify(currentSortBy) !== JSON.stringify(sortBy)) {
      handleSortChange(currentSortBy);
    }
  }, [currentSortBy, serverSideSorting]);

  // Pagination handlers
  const handlePreviousPage = () => {
    const newPage = pageIndex - 1;
    handlePageChange(newPage);
  };

  const handleNextPage = () => {
    const newPage = pageIndex + 1;
    handlePageChange(newPage);
  };

  const handleGotoPage = (newPage) => {
    handlePageChange(newPage);
  };

  // Export functions
  const headers = useMemo(() => 
    columns.map((col) => ({
      label: col.Header || 'Unknown',
      key: col.accessor || '',
    }))
  , [columns]);

  const handlePDFExport = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    let title = `${type} Report`;
    let subtitle = `Generated on: ${date}`;
    
    const filterInfo = [];
    if (dateRange.start || dateRange.end) {
      const dateRangeText = `Date Range: ${dateRange.start || 'Start'} to ${dateRange.end || 'End'}`;
      filterInfo.push(dateRangeText);
    }
    
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    
    let yPosition = 22;
    doc.text(subtitle, 14, yPosition);
    
    if (filterInfo.length > 0) {
      yPosition += 6;
      doc.text(`Filters: ${filterInfo.join(' | ')}`, 14, yPosition);
    }
    
    doc.autoTable({
      startY: yPosition + 10,
      head: [columns.map((col) => col.Header)],
      body: displayData.map((row) => columns.map((col) => row[col.accessor] || '')),
      theme: 'grid',
      headStyles: {
        fillColor: [4, 120, 87],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      }
    });
    
    const fileName = type && date
      ? `${type}-${factoryFilter.replace(/\s+/g, '-')}-${date}.pdf` 
      : `${type}-${date}.pdf`;
    
    doc.save(fileName);
  };

 

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '42px',
      borderColor: state.isFocused ? '#0d9488' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(13, 148, 136, 0.2)' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#0d9488' : '#9ca3af'
      }
    })
  };

  

  // Table rendering
  const renderTableBody = () => {
    if (page.length === 0) {
      return (
        <tr>
          <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
            {searchTerm  || dateRange.start || dateRange.end
              ? 'No results found for current filters'
              : 'No data available'}
          </td>
        </tr>
      );
    }

    return page.map((row) => {
      prepareRow(row);
      const { key, ...rowProps } = row.getRowProps();
      
     
      
      return (
        <tr key={key} {...rowProps} className="hover:bg-gray-50 transition-colors duration-150">
          {row.cells.map((cell, cellIndex) => {
            const { key: cellKey, ...cellProps } = cell.getCellProps();
            const cellId = `${key}-${cellIndex}`;
            
            return (
              <td 
                key={cellKey}
                {...cellProps}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-wrap text-left relative group"
                onMouseEnter={() => setHoveredCell(cellId)}
                onMouseLeave={() => setHoveredCell(null)}
              >
                <div className="truncate max-w-xs">
                  {cell.render('Cell')}
                </div>
                
                {hoveredCell === cellId && (
                  <div className="absolute z-10 left-0 top-full mt-1 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg max-w-xs break-words whitespace-normal">
                    {cell.render('Cell')}
                  </div>
                )}
              </td>
            );
          })}
        </tr>
      );
    });
  };


  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Header with search, filters and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Button 
            size="sm" 
            color="teal" 
            onClick={handlePDFExport}
            className="flex items-center gap-1 hover:shadow-md transition-all"
            disabled={isLoading}
          >
            <FaFilePdf className="text-sm" />
            <span className="hidden sm:inline">PDF</span>
          </Button>
          
          {type !== 'activeProduction' && (
            <CSVLink 
              data={displayData} 
              headers={headers} 
              filename={`${type}-${Date.now()}-data.csv`}
            >
              <Button 
                size="sm" 
                color="teal" 
                className="flex items-center gap-1 hover:shadow-md transition-all"
                disabled={isLoading}
              >
                <FaFileCsv className="text-sm" />
                <span className="hidden sm:inline">CSV</span>
              </Button>
            </CSVLink>
          )}
          
          {type === 'activeProduction' && (
            <Button 
              size="sm" 
              color="teal" 
              onClick={() => window.print()} 
              className="flex items-center gap-1 hover:shadow-md transition-all"
              disabled={isLoading}
            >
              <FaPrint className="text-sm" />
              <span className="hidden sm:inline">Print</span>
            </Button>
          )}
      
          <Button 
            size="sm" 
            color="teal" 
            onClick={handleRefresh}
            className="flex items-center gap-1 hover:shadow-md transition-all"
            disabled={isLoading}
          >
            <FaSyncAlt className={`text-sm ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-gray-400" />
              </div>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Start Date"
                
              />
            </div>
            
            <div className="relative">
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="End Date"
                min={dateRange.start}
                
              />
            </div>
            
            <Button
              size="sm"
              variant="outlined"
              onClick={clearDateRange}
              className="whitespace-nowrap hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Clear Dates
            </Button>
          </div>
          
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search ${type}...`}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            
            />
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <div className="overflow-x-auto">
          <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
            <thead className="bg-teal-50">
              {headerGroups.map((headerGroup) => {
                const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
                return (
                  <tr key={key} {...headerGroupProps}>
                    {headerGroup.headers.map((column) => {
                      const { key: columnKey, ...columnProps } = column.getHeaderProps(
                        serverSideSorting ? column.getSortByToggleProps() : {}
                      );
                      return (
                        <th
                          key={columnKey}
                          {...columnProps}
                          className={`px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider ${
                            serverSideSorting ? 'hover:bg-teal-100 cursor-pointer' : ''
                          } transition-colors`}
                        >
                          <div className="flex items-center">
                            {column.render('Header')}
                            {serverSideSorting && (
                              <span className="ml-1">
                                {column.isSorted ? (column.isSortedDesc ? ' ▼' : ' ▲') : ''}
                              </span>
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                );
              })}
            </thead>
            <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
              {renderTableBody()}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pageOptions.length > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-2 py-3 bg-gray-50 rounded-b-lg">
          <div className="mb-2 sm:mb-0 text-sm text-gray-600">
            Showing <span className="font-medium">{(currentPage * itemsPerPage) + 1}</span> to{' '}
            <span className="font-medium">{Math.min((currentPage + 1) * itemsPerPage, displayTotalCount)}</span> of{' '}
            <span className="font-medium">{displayTotalCount}</span> entries
            {serverSideFiltering && ` (Page ${currentPage + 1} of ${pageOptions.length})`}
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => handleGotoPage(0)}
              disabled={!canPreviousPage || isLoading}
              className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              «
            </Button>
            <Button
              variant="outlined"
              size="sm"
              onClick={handlePreviousPage}
              disabled={!canPreviousPage}
              className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              ‹
            </Button>
            
            {pageOptions.slice(
              Math.max(0, currentPage - 2),
              Math.min(pageOptions.length, currentPage + 3)
            ).map((pageNum) => (
              <Button
                key={pageNum}
                size="sm"
                onClick={() => handleGotoPage(pageNum)}
                disabled={isLoading}
                className={`rounded-full w-8 h-8 flex items-center justify-center ${
                  currentPage === pageNum ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-white hover:bg-gray-100'
                } transition-colors disabled:opacity-50`}
              >
                {pageNum + 1}
              </Button>
            ))}
            
            <Button
              variant="outlined"
              size="sm"
              onClick={handleNextPage}
              disabled={!canNextPage}
              className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              ›
            </Button>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => handleGotoPage(pageOptions.length - 1)}
              disabled={!canNextPage}
              className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              »
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

ServerSideTableComponent.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array,
  type: PropTypes.string.isRequired,
  pageSize: PropTypes.number,
  serverSideSorting: PropTypes.bool,
  serverSideFiltering: PropTypes.bool,
};

ServerSideTableComponent.defaultProps = {
  serverSideSorting: true,
  serverSideFiltering: true,
  pageSize: 20,
  data: [],
};

export default ServerSideTableComponent;