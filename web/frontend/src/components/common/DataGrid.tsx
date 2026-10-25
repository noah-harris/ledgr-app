import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import type { GridColDef, GridRowId, GridRowParams } from "@mui/x-data-grid";
import { DataGrid as MuiDataGrid, useGridApiRef } from "@mui/x-data-grid";

const defaultGetRowId = (row: any): GridRowId => row.id;
const defaultHiddenColumns = ["id"];

export default function DataGrid<T extends object>({
  rows,
  columns,
  getRowId = defaultGetRowId,
  hiddenColumns = defaultHiddenColumns,
  onSelect,
  onSelectionChange,
  checkboxSelection = false,
  loading = false,
  pageSize = 25,
  width,
}: {
  rows: T[];
  columns: GridColDef<T>[];
  getRowId?: (row: T) => GridRowId;
  hiddenColumns?: string[];
  onSelect?: (params: GridRowParams) => void;
  onSelectionChange?: (ids: GridRowId[]) => void;
  checkboxSelection?: boolean;
  loading?: boolean;
  pageSize?: number;
  width?: number | "fit"; // number = fixed px, "fit" = autosize columns to content and shrink to them, omit = fill parent
}) {
  const apiRef = useGridApiRef();
  const [fitWidth, setFitWidth] = useState<number>();

  // Autosize columns to their content once rows are loaded, then size the grid to the total
  useEffect(() => {
    if (width !== "fit" || rows.length === 0) return;
    // wait a frame so the grid has rendered the new rows before measuring
    const frame = requestAnimationFrame(async () => {
      await apiRef.current?.autosizeColumns({ includeHeaders: true, includeOutliers: true });
      const total = apiRef.current?.getVisibleColumns().reduce((sum, c) => sum + c.computedWidth, 0) ?? 0;
      setFitWidth(total + 2); // + borders
    });
    return () => cancelAnimationFrame(frame);
  }, [rows, width]);

  const boxWidth = width === "fit" ? fitWidth : width;

  return (
    // Fills the parent's height (parent must be a flex column or have a height)
    <Box sx={{ flex: 1, minHeight: 0, width: boxWidth, maxWidth: "100%" }}>
      <MuiDataGrid
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        getRowId={getRowId}
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
              : rows.map((r) => getRowId(r)).filter((id) => !model.ids.has(id));
          onSelectionChange?.(ids);
        }}
        pageSizeOptions={[25, 50, 100]}
        initialState={{
          pagination: { paginationModel: { pageSize } },
          columns: {
            columnVisibilityModel: Object.fromEntries(hiddenColumns.map((field) => [field, false])),
          },
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

// const defaultGetRowId = (row: any): GridRowId => row.id;
// const defaultHiddenColumns = ["id"];

// export default function DataGrid<T extends object>({
//   rows,
//   columns,
//   getRowId = defaultGetRowId,
//   hiddenColumns = defaultHiddenColumns,
//   onSelect,
//   onSelectionChange,
//   checkboxSelection = false,
//   loading = false,
//   pageSize = 25,
//   width,
// }: {
//   rows: T[];
//   columns: GridColDef<T>[];
//   getRowId?: (row: T) => GridRowId;
//   hiddenColumns?: string[];
//   onSelect?: (params: GridRowParams) => void;
//   onSelectionChange?: (ids: GridRowId[]) => void;
//   checkboxSelection?: boolean;
//   loading?: boolean;
//   pageSize?: number;
//   width?: number | "fit"; // number = fixed px, "fit" = sum of column widths, omit = fill parent
// }) {
//   // Sum of visible column widths (100 is MUI's default column width)
//   const fitWidth =
//     columns
//       .filter((c) => !hiddenColumns.includes(c.field))
//       .reduce((sum, c) => sum + (c.width ?? 100), 0) +
//     (checkboxSelection ? 50 : 0) +
//     2; // borders

//   const boxWidth = width === "fit" ? fitWidth : width;

//   return (
//     // Fills the parent's height (parent must be a flex column or have a height)
//     <Box sx={{ flex: boxWidth ? "none" : 1, minHeight: 0, width: boxWidth, maxWidth: "100%" }}>
//       <MuiDataGrid
//         rows={rows}
//         columns={columns}
//         getRowId={getRowId}
//         loading={loading}
//         checkboxSelection={checkboxSelection}
//         disableRowSelectionOnClick // clicking a row calls onSelect without toggling its checkbox
//         onRowClick={(params: GridRowParams) => onSelect?.(params)}
//         onRowSelectionModelChange={(model) => {
//           // "include" = the listed ids are selected
//           // "exclude" = everything EXCEPT the listed ids is selected (used by the header "select all")
//           const ids =
//             model.type === "include"
//               ? [...model.ids]
//               : rows.map((r) => getRowId(r)).filter((id) => !model.ids.has(id));
//           onSelectionChange?.(ids);
//         }}
//         pageSizeOptions={[25, 50, 100]}
//         initialState={{
//           pagination: { paginationModel: { pageSize } },
//           columns: {
//             columnVisibilityModel: Object.fromEntries(hiddenColumns.map((field) => [field, false])),
//           },
//         }}
//         // Hide the blue focus outline on clicked cells and headers
//         sx={{
//           userSelect: "none",
//           "& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader": {
//             "&:focus, &:focus-within": { outline: "none" },
//           },
//         }}
//       />
//     </Box>
//   );
// }

