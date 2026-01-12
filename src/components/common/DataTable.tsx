/**
 * Column definition for DataTable.
 */
export interface Column<T> {
  readonly header: string;
  readonly render: (row: T) => React.ReactNode;
  readonly className?: string;
}

/**
 * DataTable component props.
 */
export interface DataTableProps<T> {
  readonly columns: Column<T>[];
  readonly data: T[];
  readonly getRowId: (row: T) => string;
  readonly emptyMessage?: string;
}

/**
 * Reusable data table component with typed API.
 * Renders columns and rows with empty state handling.
 * Responsive with horizontal scroll on small screens.
 */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  emptyMessage = 'No data',
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="mt-6 bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={getRowId(row)} className="hover:bg-gray-50">
              {columns.map((column, index) => {
                const baseCellClasses = 'px-4 py-4 text-sm text-gray-900';
                const defaultCellClasses = column.className?.includes('whitespace-')
                  ? ''
                  : 'whitespace-nowrap';
                const cellClassName = `${baseCellClasses} ${defaultCellClasses} ${column.className || ''}`.trim();

                return (
                  <td key={index} className={cellClassName}>
                    {column.render(row)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

