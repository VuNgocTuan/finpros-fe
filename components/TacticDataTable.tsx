import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import moment from 'moment-timezone';
import React from "react";

const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    {
        field: 'start_date', headerName: 'Start Date', flex: 1,
        valueGetter: (params: GridValueGetterParams) => {
            const dateTime = moment.tz(params.value, 'UTC');

            return dateTime.tz('Asia/Bangkok').format('DD/MM/YYYY HH:mm:ss');
        },
    },
    { field: 'next_time', headerName: 'Next time', flex: 1 },
    { field: 'author', headerName: 'Author', flex: 1 },
];

export default function TacticDataTable() {
    const [pageSize, setPageSize] = React.useState(20);
    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [pageInfo, setPageInfo] = React.useState<{ current_page: number, last_page: number, per_page: number, total: number }>({ current_page: 1, last_page: 1, per_page: 20, total: 1 });
    const [rowCountState, setRowCountState] = React.useState(0);

    function onPageChange(newPage: number) {
      }

    return (
        <div style={{ height: 700, width: '100%' }}>
            <DataGrid
                sx={{ mt: 4 }}
                rows={data}
                rowCount={rowCountState}
                loading={isLoading}
                rowsPerPageOptions={[20]}
                pagination
                page={pageInfo.current_page - 1}
                pageSize={pageSize}
                paginationMode="server"
                onPageChange={(newPage) => onPageChange(newPage)}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                columns={columns}
                checkboxSelection={false}
                disableSelectionOnClick={true}
            />
        </div>
    );
}