import { Autocomplete, Box, Button, IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import React, { ReactElement } from "react";
import MainLayout from "../../components/MainLayout";
import AddIcon from '@mui/icons-material/Add';
import APIUtils from "../../src/Services/APIUtils";

const currencies = [
    {
        value: 'Quan',
        label: 'Quan',
    },
    {
        value: 'My',
        label: 'My',
    }
];

const TacticAdd = () => {
    const [author, setAuthor] = React.useState('Quan');
    const [dateValue, setDateValue] = React.useState<Date | null>(
        new Date(),
    );
    const [tickerFields, setTickerFields] = React.useState([
        { ticker: '', volume: 0 }
    ]);
    const [symbols, setSymbols] = React.useState<[{ id: number, label: string }]>([{ id: 1, label: 'AAV' }]);

    function handleAuthorChange(event: React.ChangeEvent<HTMLInputElement>) {
        setAuthor(event.target.value);
    }

    function handleDateChange() { }

    function addNewticker() {
        let newTicker = { ticker: '', volume: 0 };
        setTickerFields([...tickerFields, newTicker]);
    }

    function handleTickerVolumeChange(index: number, event: React.ChangeEvent<HTMLInputElement>) {
        let data = [...tickerFields];
        data[index]['volume'] = Number(event.target.value);
        setTickerFields(data);
    }

    React.useEffect(() => {
        APIUtils.fetch('GET', '/api/symbols').then(response => {
            setSymbols(response?.data.data);
        });

    }, []);

    return (
        <div>
            <Box
                component="div"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
            >
                <Typography component="h6" variant="h6">
                    Tactic Infomation
                </Typography>

                <TextField id="outlined-basic" label="Tactic Name" variant="outlined" />
                <TextField
                    id="outlined-select-currency"
                    select
                    label="Author"
                    value={author}
                    onChange={handleAuthorChange}
                >
                    {currencies.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <DesktopDatePicker
                    label="Date Time"
                    inputFormat="DD/MM/yyyy"
                    value={dateValue}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} />}
                />
            </Box>
            <Box
                component="div"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
            >
                <Typography component="h6" variant="h6">
                    Tickers Infomation
                </Typography>
                {tickerFields.map((input, index) => {
                    return (
                        <div key={index} style={{ width: '100%' }}>
                            <Stack
                                direction="row"
                                spacing={2}
                            >
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    // onChange={(event, newValue) => handleSymbolChange(newValue)}
                                    defaultValue={!symbols.length ? symbols[0] : null}
                                    options={symbols}
                                    sx={{ width: '150px' }}
                                    renderInput={(params) => <TextField {...params} label="Symbol" />}
                                />
                                <TextField
                                    id="outlined-basic"
                                    label="Volume"
                                    variant="outlined"
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTickerVolumeChange(index, e)}
                                    value={input.volume} />
                                <IconButton
                                    aria-label="delete"
                                    size="large"
                                    style={{ width: "50px", display: index == tickerFields.length - 1 ? '' : 'none' }}
                                    onClick={addNewticker}>
                                    <AddIcon fontSize="inherit" />
                                </IconButton>
                            </Stack>
                        </div>
                    )
                })}
                <Button variant="contained">Submit</Button>
            </Box >
        </div >
    );
};

TacticAdd.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout childContainer={page} title="New Tactics"></MainLayout>
    )
}

export default TacticAdd;