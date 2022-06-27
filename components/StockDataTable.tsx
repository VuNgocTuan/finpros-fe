import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import APIUtils from '../src/Services/APIUtils';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import moment from 'moment-timezone';
import { devNull } from 'os';

const columns: GridColDef[] = [
  { field: 'symbol', headerName: 'Symbol', flex: 1 },
  { field: 'open', headerName: 'Open', flex: 1 },
  { field: 'high', headerName: 'High', flex: 1 },
  { field: 'low', headerName: 'Low', flex: 1 },
  { field: 'close', headerName: 'Close', flex: 1 },
  { field: 'volume', headerName: 'Volume', flex: 1 },
  {
    field: 'date_time', headerName: 'Date time', flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      const dateTime = moment.tz(params.value, 'UTC');

      return dateTime.tz('Asia/Bangkok').format('DD/MM/YYYY HH:mm:ss');
    },
  },
  { field: 'next_time', headerName: 'Next time', flex: 1 },
];

const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
]

export default function ServerPaginationGrid() {
  // const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [pageInfo, setPageInfo] = React.useState<{ current_page: number, last_page: number, per_page: number, total: number }>({ current_page: 1, last_page: 1, per_page: 20, total: 1 });
  const [rowCountState, setRowCountState] = React.useState(0);
  const [symbols, setSymbols] = React.useState<[{ id: number, label: string }]>([{ id: 1, label: 'AAV' }]);
  const [dateValue, setDateValue] = React.useState<Date | null>(
    new Date(),
  );
  const [symbolIdValue, setSymbolIdValue] = React.useState(1);
  React.useEffect(() => {
    callStockData();

    APIUtils.fetch('GET', '/api/symbols').then(response => {
      setSymbols(response?.data.data);
    });

  }, []);

  function onPageChange(newPage: number) {
    const dateString = moment(dateValue).format('yyyy-MM-DD');
    
    callStockData(newPage, dateString, symbolIdValue);
  }

  function callStockData(newPage: number = 0, newDateTime: string = moment(dateValue).format('yyyy-MM-DD'), symbolId = 1) {
    setIsLoading(true);
    const page = newPage + 1;
    const url = `/api/daily-stocks?page=${page}&dateTime=${newDateTime}&symbolId=${symbolId}`;

    APIUtils.fetch('GET', url).then(response => {
      setData(response?.data.data);
      setRowCountState(response?.data.total);
      setPageSize(response?.data.per_page);
      setPageInfo(response?.data);
      setIsLoading(false);
    });
  }

  const handleDateChange = (newValue: Date | null) => {
    setDateValue(newValue);
    const dateString = moment(newValue).format('yyyy-MM-DD');
    callStockData(0, dateString, symbolIdValue);
  };

  const handleSymbolChange = (newValue: any) => {
    setSymbolIdValue(newValue?.id);

    const dateString = moment(dateValue).format('yyyy-MM-DD');
    callStockData(0, dateString, newValue?.id);
  }

  return (
    <div style={{ height: 700, width: '100%' }}>
      <Grid container spacing={2}>
        <Grid sx={{ flexGrow: 1 }} item xs={2}>
          <DesktopDatePicker
            label="Date Time"
            inputFormat="DD/MM/yyyy"
            value={dateValue}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item xs={2}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            onChange={(event, newValue) => handleSymbolChange(newValue)}
            defaultValue={!symbols.length ? symbols[0] : null}
            options={symbols}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Symbol" />}
          />
        </Grid>
      </Grid>

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
