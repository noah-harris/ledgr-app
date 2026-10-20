import Box from "@mui/material/Box";
import type { GridColDef, GridRowId, GridRowParams } from "@mui/x-data-grid";
import { DataGrid as MuiDataGrid } from "@mui/x-data-grid";

export default function MyDataGrid<T extends { id: GridRowId }>({
  rows,
  columns,
  onSelect,
  onSelectionChange,
  checkboxSelection = false,
  loading = false,
  pageSize = 25,
}: {
  rows: T[];
  columns: GridColDef<T>[];
  onSelect?: (params: GridRowParams) => void;
  onSelectionChange?: (ids: GridRowId[]) => void;
  checkboxSelection?: boolean;
  loading?: boolean;
  pageSize?: number;
}) {
  return (
    // Fills the parent's height (parent must be a flex column or have a height)
    <Box sx={{ flex: 1, minHeight: 0 }}>
      <MuiDataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick // clicking a row calls onSelect without toggling its checkbox
        onRowClick={(params: GridRowParams) => onSelect?.(params)}
        onRowSelectionModelChange={(model) => {
          // "include" = the listed ids are selected
          // "exclude" = everything EXCEPT the listed ids is selected (used by the header "select all")
          const ids =
            model.type === "include"
              ? [...model.ids]
              : rows.map((r) => r.id).filter((id) => !model.ids.has(id));
          onSelectionChange?.(ids);
        }}
        pageSizeOptions={[25, 50, 100]}
        initialState={{
          pagination: { paginationModel: { pageSize } },
          columns: { columnVisibilityModel: { id: false } },
        }}
        // Hide the blue focus outline on clicked cells and headers
        sx={{
          userSelect: "none",
          "& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader": {
            "&:focus, &:focus-within": { outline: "none" },
          },
        }}
      />
    </Box>
  );
}

// import Box from "@mui/material/Box";
// import type { GridColDef, GridRowId, GridRowParams } from "@mui/x-data-grid";
// import { DataGrid as MuiDataGrid } from "@mui/x-data-grid";

// export default function MyDataGrid<T extends { id: GridRowId }>({
//   rows,
//   columns,
//   onSelect,
//   onSelectionChange,
//   checkboxSelection = false,
//   loading = false,
//   pageSize = 25,
// }: {
//   rows: T[];
//   columns: GridColDef<T>[];
//   onSelect?: (id: GridRowId) => void;
//   onSelectionChange?: (ids: GridRowId[]) => void;
//   checkboxSelection?: boolean;
//   loading?: boolean;
//   pageSize?: number;
// }) {

//   return (
    
//     // Fills the parent's height (parent must be a flex column or have a height)
//     <Box sx={{ flex: 1, minHeight: 0 }}>
//       <MuiDataGrid
//         rows={rows}
//         columns={columns}
//         loading={loading}
//         checkboxSelection={checkboxSelection}
//         disableRowSelectionOnClick // clicking a row calls onSelect without toggling its checkbox
//         onRowClick={(params: GridRowParams) => onSelect?.(params.id)}
//         onRowSelectionModelChange={(model) => {
//           // "include" = the listed ids are selected
//           // "exclude" = everything EXCEPT the listed ids is selected (used by the header "select all")
//           const ids =
//             model.type === "include"
//               ? [...model.ids]
//               : rows.map((r) => r.id).filter((id) => !model.ids.has(id));
//           onSelectionChange?.(ids);
//         }}
//         pageSizeOptions={[25, 50, 100]}
//         initialState={{ 
//           pagination: { paginationModel: { pageSize } } ,
//           columns: { columnVisibilityModel: { id: false } },
//         }}
//       />
//     </Box>
//   );
// }

