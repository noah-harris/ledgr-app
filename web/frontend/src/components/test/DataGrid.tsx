import Box from "@mui/material/Box";
import {
  DataGrid as MuiDataGrid,
  type GridColDef,
  type GridRowId,
  type GridRowParams,
} from "@mui/x-data-grid";

// Usage: <DataGrid rows={rows} columns={columns} onSelect={setSelectedId} />
type Props<T extends { id: GridRowId }> = {
  rows: T[];
  columns: GridColDef<T>[];
  onSelect?: (id: GridRowId) => void;
  loading?: boolean;
  pageSize?: number;
};

export default function DataGrid<T extends { id: GridRowId }>({
  rows,
  columns,
  onSelect,
  loading = false,
  pageSize = 25,
}: Props<T>) {
  return (
    // Fills the parent's height (parent must be a flex column or have a height)
    <Box sx={{ flex: 1, minHeight: 0 }}>
      <MuiDataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        onRowClick={(params: GridRowParams) => onSelect?.(params.id)}
        pageSizeOptions={[25, 50, 100]}
        initialState={{ pagination: { paginationModel: { pageSize } } }}
      />
    </Box>
  );
}