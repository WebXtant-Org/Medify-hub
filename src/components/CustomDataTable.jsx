'use client'

import { useState, useMemo } from 'react'

import { flexRender } from '@tanstack/react-table'
import Typography from '@mui/material/Typography'
import TablePagination from '@mui/material/TablePagination'
import classnames from 'classnames'

import TablePaginationComponent from './TablePaginationComponent'
import tableStyles from '@core/styles/table.module.css'

const CustomDataTable = ({ table, isLoading, columns }) => {
  return (
    <>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th 
                    key={header.id} 
                    onClick={header.column.getToggleSortingHandler()} 
                    className={classnames(
                      header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                      index === 0 ? tableStyles.stickyColumn : index === 1 ? tableStyles.stickyColumnNext : ''
                    )}
                    style={{ minWidth: index === 0 ? '70px' : 'auto' }}
                  >
                    <div className='flex items-center gap-2'>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <i className={
                          header.column.getIsSorted() === 'asc' 
                            ? 'tabler-chevron-up text-[1.2rem]' 
                            : header.column.getIsSorted() === 'desc' 
                              ? 'tabler-chevron-down text-[1.2rem]' 
                              : 'tabler-selector text-[1.2rem] text-textDisabled'
                        } />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className='text-center py-10'>
                  <Typography color='text.secondary'>Loading...</Typography>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className='text-center py-10'>
                  <Typography color='text.secondary'>No Results Found</Typography>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell, index) => (
                    <td 
                      key={cell.id}
                      className={classnames(
                        index === 0 ? tableStyles.stickyColumn : index === 1 ? tableStyles.stickyColumnNext : ''
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
      />
    </>
  )
}

export default CustomDataTable
