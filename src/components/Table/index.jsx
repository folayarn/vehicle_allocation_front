import PropTypes from 'prop-types';
import { Button } from '@material-tailwind/react';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { CSVLink } from 'react-csv';
import { useTable, usePagination, useSortBy } from 'react-table';
import { FaFileCsv, FaFilePdf, FaPrint, FaSearch, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import Select from 'react-select';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TableComponent = ({ columns, data, type }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [factoryFilter, setFactoryFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [uniqueFactories, setUniqueFactories] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [hasDateField, setHasDateField] = useState(false);
  const itemsPerPage = 20;

  // Check if data contains dateCreated field
  useEffect(() => {
    if (!data || data.length === 0) {
      setHasDateField(false);
      return;
    }
    
    const firstItem = data[0];
    const hasDate = firstItem && (
      firstItem.dateCreated !== undefined || 
      firstItem.createdAt !== undefined ||
      firstItem.date !== undefined ||
      firstItem.monthCreated !== undefined
    );
    setHasDateField(hasDate);
  }, [data]);

  // Extract unique factory names for filter dropdown
  useEffect(() => {
    if (!data || data.length === 0) {
      setUniqueFactories([]);
      return;
    }
    
    const factories = [...new Set(data
      .filter(item => item && item.factoryName)
      .map(item => item.factoryName)
      .sort())];
      
    if (JSON.stringify(factories) !== JSON.stringify(uniqueFactories)) {
      setUniqueFactories(factories);
    }
  }, [data]);

  // Format factories for react-select
  const factoryOptions = useMemo(() => {
    return [
      { value: '', label: 'All Factories' },
      ...uniqueFactories.map(factory => ({
        value: factory,
        label: factory
      }))
    ];
  }, [uniqueFactories]);

  // Get date field name from data
  const getDateFieldName = useCallback((item) => {
    if (!item) return null;
    if (item.dateCreated) return 'dateCreated';
    if (item.createdAt) return 'createdAt';
    if (item.date) return 'date';
    if (item.timestamp) return 'monthCreated';
    return null;
  }, []);

  // Parse date string to Date object for comparison
  const parseDate = useCallback((dateString) => {
    if (!dateString) return null;
    
    // Try different date formats
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Try parsing as ISO string or other formats
      const timestamp = Date.parse(dateString);
      if (!isNaN(timestamp)) {
        return new Date(timestamp);
      }
      return null;
    }
    return date;
  }, []);

  // Filtered data based on search term, factory filter, date range, and type
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.filter((item) => {
      if (!item) return false;
      
      // Check factory filter
      if (factoryFilter && item.factoryName !== factoryFilter) {
        return false;
      }
      
      // Check date range if date fields exist and range is specified
      if (hasDateField && (dateRange.start || dateRange.end)) {
        const dateFieldName = getDateFieldName(item);
        if (dateFieldName && item[dateFieldName]) {
          const itemDate = parseDate(item[dateFieldName]);
          if (itemDate) {
            if (dateRange.start) {
              const startDate = parseDate(dateRange.start);
              if (startDate && itemDate < startDate) return false;
            }
            if (dateRange.end) {
              const endDate = parseDate(dateRange.end);
              if (endDate) {
                // Include the entire end day (up to 23:59:59)
                const endOfDay = new Date(endDate);
                endOfDay.setHours(23, 59, 59, 999);
                if (itemDate > endOfDay) return false;
              }
            }
          }
        }
      }
      
      // Check search term
      const searchTermLower = searchTerm.toLowerCase();
      const searchableContent = Object.values(item)
        .filter(value => value !== null && value !== undefined)
        .map(value => value.toString().toLowerCase())
        .join(' ');
      
      return searchableContent.includes(searchTermLower);
    });
  }, [searchTerm, factoryFilter, dateRange, data, hasDateField, getDateFieldName, parseDate]);

  // Create a stable columns reference
  const stableColumns = useMemo(() => columns, [columns]);

  // Table instance with pagination
  const tableInstance = useTable(
    {
      columns: stableColumns,
      data: filteredData,
      initialState: { pageIndex: 0, pageSize: itemsPerPage },
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
    gotoPage,
    previousPage,
    nextPage,
    state: { pageIndex },
  } = tableInstance;

  // Column headers for CSV export
  const headers = useMemo(() => 
    stableColumns.map((col) => ({
      label: col.Header || 'Unknown',
      key: col.accessor || '',
    }))
  , [stableColumns]);

  // Enhanced Export to PDF function with filters info
  const handlePDFExport = useCallback(() => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    let title = `${type} Report`;
    let subtitle = `Generated on: ${date}`;
    
    // Add filter information
    const filterInfo = [];
    if (factoryFilter) filterInfo.push(`Factory: ${factoryFilter}`);
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
      head: [stableColumns.map((col) => col.Header)],
      body: filteredData.map((row) => stableColumns.map((col) => row[col.accessor] || '')),
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
    
    const fileName = factoryFilter 
      ? `${type}-${factoryFilter.replace(/\s+/g, '-')}-${date}.pdf` 
      : `${type}-${date}.pdf`;
    
    doc.save(fileName);
  }, [stableColumns, filteredData, factoryFilter, dateRange, type]);

  // Check if this table type should show factory filter
  const shouldShowFactoryFilter = useMemo(() => 
    ['surveyReport',"officer", 'defectiveProduct', 'PaymentLogs','factoryType', 
    'finishProduct', 'comments', 'productionStock', 'raw', 'production'].includes(type)
  , [type]);

  // Custom styles for react-select
  const customStyles = useMemo(() => ({
    control: (provided, state) => ({
      ...provided,
      minHeight: '42px',
      borderColor: state.isFocused ? '#0d9488' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(13, 148, 136, 0.2)' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#0d9488' : '#9ca3af'
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af'
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: '#d1d5db'
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#6b7280',
      '&:hover': {
        color: '#374151'
      }
    })
  }), []);

  // Reset to first page when filters change
  useEffect(() => {
    gotoPage(0);
  }, [searchTerm, factoryFilter, dateRange, gotoPage]);

  // Clear date range
  const clearDateRange = () => {
    setDateRange({ start: '', end: '' });
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
          >
            <FaFilePdf className="text-sm" />
            <span className="hidden sm:inline">PDF</span>
          </Button>
          {type !== 'activeProduction' && (
            <CSVLink data={filteredData} headers={headers} filename={`${type}-${Date.now()}-data.csv`}>
              <Button size="sm" color="teal" className="flex items-center gap-1 hover:shadow-md transition-all">
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
            >
              <FaPrint className="text-sm" />
              <span className="hidden sm:inline">Print</span>
            </Button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {shouldShowFactoryFilter && uniqueFactories.length > 0 && (
            <div className="relative w-full sm:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <FaFilter className="text-gray-400 mt-1" />
              </div>
              <Select
                value={factoryOptions.find(option => option.value === factoryFilter) || factoryOptions[0]}
                onChange={(selectedOption) => setFactoryFilter(selectedOption.value)}
                options={factoryOptions}
                placeholder="Filter by Factory"
                styles={customStyles}
                className="react-select-container"
                classNamePrefix="react-select"
                isSearchable={true}
                menuPlacement="auto"
              />
            </div>
          )}
          
          {hasDateField && (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors"
                  placeholder="Start Date"
                />
              </div>
              
              <div className="relative">
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors"
                  placeholder="End Date"
                  min={dateRange.start}
                />
              </div>
              
              {(dateRange.start || dateRange.end) && (
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={clearDateRange}
                  className="whitespace-nowrap hover:bg-gray-50 transition-colors"
                >
                  Clear Dates
                </Button>
              )}
            </div>
          )}
          
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search ${type}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-teal-50">
            {headerGroups.map((headerGroup) => {
              const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
              return (
                <tr key={key} {...headerGroupProps}>
                  {headerGroup.headers.map((column) => {
                    const { key: columnKey, ...columnProps } = column.getHeaderProps(column.getSortByToggleProps());
                    return (
                      <th
                        key={columnKey}
                        {...columnProps}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hover:bg-teal-100 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center">
                          {column.render('Header')}
                          <span className="ml-1">
                            {column.isSorted ? (column.isSortedDesc ? ' ▼' : ' ▲') : ''}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {page.length === 0 ? (
              <tr>
                <td colSpan={stableColumns.length} className="px-6 py-4 text-center text-gray-500">
                  {searchTerm || factoryFilter || dateRange.start || dateRange.end
                    ? `No results found for ${searchTerm ? `"${searchTerm}"` : ''} ${searchTerm && (factoryFilter || dateRange.start || dateRange.end) ? 'and ' : ''} ${factoryFilter ? `${factoryFilter} factory` : ''} ${(factoryFilter && (dateRange.start || dateRange.end)) ? 'and ' : ''} ${dateRange.start || dateRange.end ? `date range ${dateRange.start ? `from ${dateRange.start}` : ''} ${dateRange.start && dateRange.end ? 'to' : ''} ${dateRange.end ? `${dateRange.end}` : ''}` : ''}` 
                    : 'No data available'}
                </td>
              </tr>
            ) : (
              page.map((row) => {
                prepareRow(row);
                const { key, ...rowProps } = row.getRowProps();
                
                if (type === 'officer' && row.original.accessLevel === 'admin') {
                  return null;
                }
                
                return (
                  <tr key={key} {...rowProps} className="hover:bg-gray-50 transition-colors duration-150">
                    {row.cells.map((cell, cellIndex) => {
                      const { key: cellKey, ...cellProps } = cell.getCellProps();
                      const cellId = `${key}-${cellIndex}`;
                      
                      return (
                        <td 
                          key={cellKey}
                          {...cellProps}
                          className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${
                             'text-wrap text-left px-2' 
                          } relative group`}
                          onMouseEnter={() => setHoveredCell(cellId)}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          <div className="truncate max-w-xs">
                            {cell.render('Cell')}
                          </div>
                          
                          {/* Hover tooltip */}
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
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageOptions.length > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-2 py-3 bg-gray-50 rounded-b-lg">
          <div className="mb-2 sm:mb-0 text-sm text-gray-600">
            Showing <span className="font-medium">{(pageIndex * itemsPerPage) + 1}</span> to{' '}
            <span className="font-medium">{Math.min((pageIndex + 1) * itemsPerPage, filteredData.length)}</span> of{' '}
            <span className="font-medium">{filteredData.length}</span> entries
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              «
            </Button>
            <Button
              variant="outlined"
              size="sm"
              onClick={previousPage}
              disabled={!canPreviousPage}
              className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              ‹
            </Button>
            
            {pageOptions.slice(
              Math.max(0, pageIndex - 2),
              Math.min(pageOptions.length, pageIndex + 3)
            ).map((pageNum) => (
              <Button
                key={pageNum}
                size="sm"
                onClick={() => gotoPage(pageNum)}
                className={`rounded-full w-8 h-8 flex items-center justify-center ${
                  pageIndex === pageNum ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-white hover:bg-gray-100'
                } transition-colors`}
              >
                {pageNum + 1}
              </Button>
            ))}
            
            <Button
              variant="outlined"
              size="sm"
              onClick={nextPage}
              disabled={!canNextPage}
              className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              ›
            </Button>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => gotoPage(pageOptions.length - 1)}
              disabled={!canNextPage}
              className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              »
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

TableComponent.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
};

export default TableComponent;