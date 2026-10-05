import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface BulkAction<T> {
  label: string;
  onClick: (items: T[]) => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
}

export interface SmartTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  filterField?: keyof T;
  filterOptions?: { value: string; label: string }[];
  bulkActions?: BulkAction<T>[];
  idField?: keyof T;
  pageSize?: number;
}

export function SmartTable<T>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchFields = [],
  filterField,
  filterOptions = [],
  bulkActions = [],
  idField = 'id' as keyof T,
  pageSize = 8,
}: SmartTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 1. Filter and Search Data
  const processedData = useMemo(() => {
    let result = [...data];

    // Filter status
    if (filterField && filterValue !== 'all') {
      result = result.filter((item) => String(item[filterField]) === filterValue);
    }

    // Search query
    if (searchTerm.trim() !== '' && searchFields.length > 0) {
      const query = searchTerm.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) =>
          String(item[field] || '').toLowerCase().includes(query)
        )
      );
    }

    // Sort column
    if (sortKey) {
      result.sort((a, b) => {
        const valA = String((a as any)[sortKey] || '');
        const valB = String((b as any)[sortKey] || '');
        
        // Handle numeric fields if applicable
        const numA = Number(valA);
        const numB = Number(valB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortDirection === 'asc' ? numA - numB : numB - numA;
        }

        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
    }

    return result;
  }, [data, searchTerm, filterField, filterValue, sortKey, sortDirection, searchFields]);

  // 2. Pagination Math
  const totalPages = Math.max(1, Math.ceil(processedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, currentPage, pageSize]);

  // Handle Sort Toggles
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelected = new Set(paginatedData.map((item) => String(item[idField])));
      setSelectedIds(newSelected);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const isAllSelected = paginatedData.length > 0 && paginatedData.every((item) => selectedIds.has(String(item[idField])));

  // Get full object records from selected IDs
  const selectedRecords = useMemo(() => {
    return data.filter((item) => selectedIds.has(String(item[idField])));
  }, [data, selectedIds, idField]);

  return (
    <div className="flex flex-col gap-4">
      {/* Table Toolbar controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-primary-bg p-4 border border-border-main rounded-xl shadow-xs">
        {/* Search & Filters */}
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {searchFields.length > 0 && (
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-border-main rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-orange bg-primary-bg"
              />
            </div>
          )}
          
          {filterField && filterOptions.length > 0 && (
            <select
              value={filterValue}
              onChange={(e) => {
                setFilterValue(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-border-main rounded-lg text-xs bg-primary-bg focus:outline-none focus:ring-1 focus:ring-brand-orange"
            >
              <option value="all">All States</option>
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Selected Counter & Bulk Actions */}
        {selectedIds.size > 0 && bulkActions.length > 0 && (
          <div className="flex items-center gap-2 bg-brand-orange/5 border border-brand-orange/15 px-3.5 py-1.5 rounded-lg animate-fade-in shrink-0">
            <span className="text-[10px] font-extrabold text-brand-orange uppercase">
              {selectedIds.size} Selected
            </span>
            <div className="h-4 w-px bg-brand-orange/20 mx-1" />
            <div className="flex gap-1.5">
              {bulkActions.map((action) => (
                <Button
                  key={action.label}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={async () => {
                    await action.onClick(selectedRecords);
                    setSelectedIds(new Set());
                  }}
                  className="px-2.5 py-1 text-[10px] h-7 font-bold rounded-md"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actual Data Table grid */}
      <div className="bg-primary-bg border border-border-main rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-surface-bg border-b border-border-main select-none">
                {bulkActions.length > 0 && (
                  <th className="px-5 py-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="rounded border-border-main focus:ring-brand-orange cursor-pointer"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`px-5 py-4 font-bold text-text-secondary uppercase tracking-wider ${
                      col.sortable ? 'cursor-pointer hover:bg-black/5 hover:text-text-primary transition-colors' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span>{col.label}</span>
                      {col.sortable && sortKey === col.key && (
                        sortDirection === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/50">
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => {
                  const id = String(item[idField]);
                  const isSelected = selectedIds.has(id);
                  return (
                    <tr
                      key={id}
                      className={`hover:bg-surface-bg/30 transition-colors ${
                        isSelected ? 'bg-brand-orange/5' : ''
                      }`}
                    >
                      {bulkActions.length > 0 && (
                        <td className="px-5 py-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(id, e.target.checked)}
                            className="rounded border-border-main focus:ring-brand-orange cursor-pointer"
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} className="px-5 py-3.5 text-text-primary font-medium">
                          {col.render ? col.render(item) : String((item as any)[col.key] || '')}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (bulkActions.length > 0 ? 1 : 0)}
                    className="px-5 py-12 text-center text-text-muted font-bold text-xs"
                  >
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Clientside Pagination Footer */}
        <div className="px-5 py-4 border-t border-border-main flex items-center justify-between gap-4 select-none">
          <div className="text-[10px] text-text-muted font-semibold uppercase">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} records
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-1 h-8 w-8 rounded-lg"
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-xs font-bold text-text-primary px-3 py-1 bg-surface-bg rounded-lg border border-border-main">
              {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1 h-8 w-8 rounded-lg"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
