import {
  CustomFilter,
  GlobalFilter,
  TypeFilter,
} from '@/components/Backend/DataTableFilters';
import { DataTablePagination } from '@/components/Backend/DataTablePagination';
import { DataTableViewOptions } from '@/components/Backend/DataTableViewOptions';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
export function DataTable({
  data,
  defaultColumns,
  showTypeFilter = false,
  typeFilterOptions,
  showColumnFilters = true,
  customFilterColumn,
  pagination = true,
  showGlobalFilter = false,
  showCustomFilter = true,
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    setColumns(defaultColumns);
  }, [defaultColumns]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="flex items-center gap-4 py-4">
        {showCustomFilter && table && (
          <CustomFilter
            table={table}
            column={customFilterColumn ? customFilterColumn : 'title'}
          />
        )}
        {showGlobalFilter && (
          <GlobalFilter
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        )}
        {showTypeFilter && (
          <TypeFilter
            data={typeFilterOptions.iterable}
            label={'categories'}
            value={typeFilterOptions.selectedId}
            route={typeFilterOptions.route}
          />
        )}
        {showColumnFilters && (
          <DataTableViewOptions table={table} label={'Select columns'} />
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={Math.random() + header.id}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="first-of-type:ml-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={`row_${row.id}`}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => {
                    return (
                      <TableCell
                        key={Math.random() + cell.id}
                        className="max-w-72"
                      >
                        <p className="first-of-type:ml-4">
                          {' '}
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </p>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {pagination && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={table.getHeaderGroups()[0].headers?.length}>
                  <DataTablePagination table={table} />
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </div>
  );
}
