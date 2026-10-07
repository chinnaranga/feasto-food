import React from 'react';

/**
 * FEASTO DATA TABLE
 * High-clarity operational table with clean hairlines, tabular figures,
 * hover states, and minimal borders. Avoids generic SaaS shadow-bloated cards.
 */

export interface FeastoColumn<T> {
  key: string;
  header: React.ReactNode;
  render: (item: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface FeastoDataTableProps<T> {
  columns: FeastoColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  selectedId?: string;
  emptyMessage?: string;
  dark?: boolean;
  className?: string;
}

export function FeastoDataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  selectedId,
  emptyMessage = 'No records found in this operational view.',
  dark = false,
  className = '',
}: FeastoDataTableProps<T>) {
  return (
    <div
      className={`w-full overflow-x-auto border select-none ${
        dark ? 'border-white/10 bg-[#14161B]' : 'border-[#141518]/20 bg-[#FAF8F5]'
      } ${className}`}
    >
      <table className="w-full text-left border-collapse font-sans text-xs">
        {/* Table Head */}
        <thead>
          <tr
            className={`border-b font-mono text-[10px] uppercase tracking-widest ${
              dark
                ? 'border-white/10 bg-[#1D212A] text-[#8E929C]'
                : 'border-[#141518]/15 bg-[#EBE7DD] text-[#52555F]'
            }`}
          >
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={`py-3 px-4 font-bold ${
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left'
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-current/10">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-12 px-4 text-center font-mono text-xs text-[#8A8D98]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => {
              const id = keyExtractor(item);
              const isSelected = selectedId === id;

              return (
                <tr
                  key={id}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  } ${
                    isSelected
                      ? dark
                        ? 'bg-[#1B3BFF]/20 text-white font-semibold'
                        : 'bg-[#D7F04A]/30 text-[#141518] font-semibold'
                      : dark
                      ? 'hover:bg-white/[0.04] text-[#F3F0E8]'
                      : 'hover:bg-[#F3F0E8] text-[#141518]'
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-3.5 px-4 ${
                        col.align === 'right'
                          ? 'text-right font-mono'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      }`}
                    >
                      {col.render(item, idx)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
