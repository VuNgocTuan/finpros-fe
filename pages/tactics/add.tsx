import { Autocomplete, Box, Button, IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import React, { ReactElement } from "react";
import MainLayout from "../../components/MainLayout";
import AddIcon from '@mui/icons-material/Add';
import APIUtils from "../../src/Services/APIUtils";
import moment from 'moment-timezone';
import LoadingButton from '@mui/lab/LoadingButton';
import Router from "next/router";

const currencies = [
    {
        value: 'Quan',
        label: 'Quan',
    },
    {
        value: 'My',
        label: 'My',
    },
    {
        value: 'Duong',
        label: 'Duong',
    }
];

const TacticAdd = () => {
    const [tacticName, setTacticName] = React.useState('');
    const [author, setAuthor] = React.useState('Quan');
    const [dateValue, setDateValue] = React.useState<Date | null>(
        new Date(),
    );
    const [tickerFields, setTickerFields] = React.useState([
        { ticker: 0, volume: 0 }
    ]);
    const [symbols, setSymbols] = React.useState<[{ id: number, label: string }]>([{ id: 1, label: 'AAV' }]);
    const [nameErr, setNameError] = React.useState(null);
    const [authorErr, setAuthorErr] = React.useState(null);
    const [startDateErr, setStartDateErr] = React.useState(null);
    const [tickersErr, setTickersErr] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    function handleAuthorChange(event: React.ChangeEvent<HTMLInputElement>) {
        setAuthor(event.target.value);
    }

    const handleDateChange = (newValue: Date | null) => {
        setDateValue(newValue);
    };

    function addNewticker() {
        let newTicker = { ticker: 0, volume: 0 };
        setTickerFields([...tickerFields, newTicker]);
    }

    function handleTickerVolumeChange(index: number, event: React.ChangeEvent<HTMLInputElement>) {
        let data = [...tickerFields];
        data[index]['volume'] = Number(event.target.value);
        setTickerFields(data);
    }

    function handleTickerIdChange(index: number, newValue: any) {
        if (!newValue) { return }

        let data = [...tickerFields];
        data[index]['ticker'] = Number(newValue.id);
        setTickerFields(data);
    }

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setTacticName(event.target.value);
    }

    function handleSubmit() {
        setLoading(true);

        let tickers: Array<Object> | null = [...tickerFields];
        if (tickerFields.length == 1 && tickerFields.at(0)?.ticker == 0) {
            tickers = null;
        }

        const data = {
            'name': tacticName,
            'author': author,
            'start_date': moment(dateValue).format('yyyy-MM-DD'),
            'tickers': tickers
        };

        APIUtils.fetch('POST', '/api/tactics', data).then(response => {
            setNameError(null);
            setAuthorErr(null);
            setStartDateErr(null);
            setTickersErr(null);
            return Router.push('/tactics/list');

        }).catch(err => {
            setLoading(false);

            if (err.response.status == 422) {
                setTickersErr(err?.response?.data?.errors)
                setNameError(err?.response?.data?.errors?.name);
                setAuthorErr(err?.response?.data?.errors?.author);
                setStartDateErr(err?.response?.data?.errors?.start_date);
            }
        });
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

                <TextField
                    id="outlined-basic"
                    label="Tactic Name"
                    variant="outlined"
                    onChange={handleNameChange}
                    value={tacticName}
                    error={nameErr != null}
                    helperText={nameErr == null ? '' : nameErr} />
                <TextField
                    id="outlined-select-currency"
                    select
                    label="Author"
                    value={author}
                    error={authorErr != null}
                    helperText={authorErr == null ? '' : authorErr}
                    onChange={handleAuthorChange}
                >
                    {currencies.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <DesktopDatePicker
                    label="Start Date"
                    inputFormat="DD/MM/yyyy"
                    value={dateValue}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField
                        {...params}
                        error={startDateErr != null}
                        helperText={startDateErr == null ? '' : startDateErr}
                    />}
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
                                spacing={0}
                            >
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    defaultValue={!symbols.length ? symbols[0] : null}
                                    options={symbols}
                                    sx={{ width: '150px' }}
                                    onChange={(e, newValue) => handleTickerIdChange(index, newValue)}
                                    renderInput={
                                        (params) => <TextField
                                            {...params}
                                            label="Symbol"
                                            error={tickersErr != null && tickersErr[`tickers.${index}.ticker`] !== undefined}
                                            helperText={(tickersErr != null && tickersErr[`tickers.${index}.ticker`] !== undefined) ? tickersErr[`tickers.${index}.ticker`] : ''}
                                        />
                                    }
                                />
                                <TextField
                                    id="outlined-basic"
                                    label="Volume"
                                    variant="outlined"
                                    name="123"
                                    sx={{ ml: 2 }}
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTickerVolumeChange(index, e)}
                                    value={input.volume}
                                    error={tickersErr != null && tickersErr[`tickers.${index}.volume`] !== undefined}
                                    helperText={(tickersErr != null && tickersErr[`tickers.${index}.volume`] !== undefined) ? tickersErr[`tickers.${index}.volume`] : ''}
                                />
                                <IconButton
                                    aria-label="delete"
                                    size="large"
                                    style={{ width: "50px", height: 'fit-content', display: index == tickerFields.length - 1 ? '' : 'none' }}
                                    onClick={addNewticker}>
                                    <AddIcon fontSize="inherit" />
                                </IconButton>
                            </Stack>
                        </div>
                    )
                })}
                <LoadingButton
                    loading={loading}
                    onClick={handleSubmit}
                    variant="contained">
                    Submit
                </LoadingButton>
            </Box >
        </div >
    );
};

TacticAdd.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout childContainer={page} title="New Tactic"></MainLayout>
    )
}

export default TacticAdd;