import { Autocomplete, Box, IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import React, { ReactElement } from "react";
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment-timezone';
import LoadingButton from '@mui/lab/LoadingButton';
import Router, { useRouter } from "next/router";
import MainLayout from "../../../../components/MainLayout";
import APIUtils from "../../../../src/Services/APIUtils";
import RemoveIcon from '@mui/icons-material/Remove';
import ArrayUtils from "../../../../src/Utils/ArrayUtils";

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

const TacticEdit = () => {
    const router = useRouter();

    const [tacticName, setTacticName] = React.useState('');
    const [author, setAuthor] = React.useState('Quan');
    const [dateValue, setDateValue] = React.useState<Date | null>(
        new Date(),
    );
    const [endDateValue, setEndDateValue] = React.useState<Date | null>(null);
    const [tickerFields, setTickerFields] = React.useState([
        { id: 0, volume: 0, tactic_id: 0, stock_id: 0 }
    ]);
    const [tickerDeleted, setTickerDeleted] = React.useState<any[]>([]);
    const [symbols, setSymbols] = React.useState<[{ id: number, label: string }]>([{ id: 1, label: 'AAV' }]);
    const [nameErr, setNameError] = React.useState(null);
    const [authorErr, setAuthorErr] = React.useState(null);
    const [startDateErr, setStartDateErr] = React.useState(null);
    const [endDateErr, setEndDateErr] = React.useState(null);
    const [tickersErr, setTickersErr] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [tickerDates, setTickerDates] = React.useState<any[]>([]);
    const [tickerDateSelected, setTickerDateSelected] = React.useState('');

    function handleAuthorChange(event: React.ChangeEvent<HTMLInputElement>) {
        setAuthor(event.target.value);
    }

    function handleTickerDateChange(event: React.ChangeEvent<HTMLInputElement>) {
        setTickerDateSelected(event.target.value);

        APIUtils.fetch('GET', `/api/tactics/${router.query.id}/tickers?date=${event.target.value}`).then(response => {
            const tickers = response?.data;

            if (tickers?.length > 0) {
                setTickerFields(tickers);
            } else {
                setTickerFields([
                    {
                        id: 0, volume: 0, tactic_id: Number(router.query.id), stock_id: 0
                    }]);
            }
        });
    }

    const handleDateChange = (newValue: Date | null) => {
        setDateValue(newValue);
    };

    const handleEndDateChange = (newValue: Date | null) => {
        setEndDateValue(newValue);
    };

    function addNewticker() {
        let newTicker = { id: 0, volume: 0, tactic_id: Number(router.query.id), stock_id: 0 };
        setTickerFields([...tickerFields, newTicker]);
    }

    function removeTicker(index: number) {
        let data = [...tickerFields];
        const tickerDataDeleted = data.splice(index, 1);
        tickerDeleted.push(tickerDataDeleted[0].id);

        setTickerFields(data);
    }

    function handleTickerVolumeChange(index: number, event: React.ChangeEvent<HTMLInputElement>) {
        let data = [...tickerFields];
        data[index]['volume'] = Number(event.target.value);
        setTickerFields(data);
    }

    function handleTickerIdChange(index: number, newValue: any) {
        if (!newValue) { return }

        let data = [...tickerFields];
        data[index]['stock_id'] = Number(newValue.id);
        setTickerFields(data);
    }

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setTacticName(event.target.value);
    }

    function handleSubmit() {
        setLoading(true);

        let tickers: Array<Object> | null = [...tickerFields];
        if (tickerFields.length == 1 && tickerFields.at(0)?.stock_id == 0) {
            tickers = null;
        }

        const data = {
            'name': tacticName,
            'author': author,
            'start_date': dateValue ? moment(dateValue).format('yyyy-MM-DD') : null,
            'end_date': endDateValue ? moment(endDateValue).format('yyyy-MM-DD') : null,
            'ticker_date': tickerDateSelected ? moment(tickerDateSelected,'DD/MM/yyyy').format('yyyy-MM-DD') : null,
            'tickers': tickers
        };

        if (tickerDeleted.length > 0) {
            const tickerIdDeleted = {
                'ids': tickerDeleted
            }

            APIUtils.fetch('POST', `/api/tactics/${router.query.id}/tickers/delete`, tickerIdDeleted).then(response => {
            });
        }

        APIUtils.fetch('PUT', `/api/tactics/${router.query.id}`, data).then(response => {
            setNameError(null);
            setAuthorErr(null);
            setStartDateErr(null);
            setEndDateErr(null);
            setTickersErr(null);

            return Router.push('/tactics/list');
        }).catch(err => {
            setLoading(false);

            if (err.response.status == 422) {
                setTickersErr(err?.response?.data?.errors)
                setNameError(err?.response?.data?.errors?.name);
                setAuthorErr(err?.response?.data?.errors?.author);
                setStartDateErr(err?.response?.data?.errors?.start_date);
                setEndDateErr(err?.response?.data?.errors?.end_date);
            }
        });
    }

    React.useEffect(() => {
        APIUtils.fetch('GET', '/api/symbols').then(response => {
            setSymbols(response?.data.data);
        });

        APIUtils.fetch('GET', `/api/tactics/${router.query.id}`).then(response => {
            const tactic = response?.data;

            setTacticName(tactic.name);
            setAuthor(tactic.author);
            setDateValue(tactic.start_date);
            setEndDateValue(tactic.end_date);
        });

        APIUtils.fetch('GET', `/api/tactics/${router.query.id}/all-dates`).then(response => {
            const data = ArrayUtils.transformSingleDataForSelectInput(response?.data);

            if (data.length > 0) {
                const dateReq = encodeURIComponent(data[0]?.value);
                setTickerDateSelected(data[0]?.value);
                setTickerDates(data);
                APIUtils.fetch('GET', `/api/tactics/${router.query.id}/tickers?date=${dateReq}`).then(response => {
                    const tickers = response?.data;

                    if (tickers?.length > 0) {
                        setTickerFields(tickers);
                    } else {
                        setTickerFields([
                            {
                                id: 0, volume: 0, tactic_id: Number(router.query.id), stock_id: 0
                            }]);
                    }
                });
            }
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
                <DesktopDatePicker
                    label="End Date"
                    inputFormat="DD/MM/yyyy"
                    value={endDateValue}
                    onChange={handleEndDateChange}
                    renderInput={(params) => <TextField
                        {...params}
                        error={endDateErr != null}
                        helperText={endDateErr == null ? '' : endDateErr}
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
                <TextField
                    select
                    label="Ticker Dates"
                    value={tickerDateSelected}
                    onChange={handleTickerDateChange}
                >
                    {tickerDates.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
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
                                    defaultValue={!symbols.length ? symbols[input.stock_id - 1] : null}
                                    value={symbols[input.stock_id - 1] ?? null}
                                    options={symbols}
                                    sx={{ width: '15ch' }}
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
                                    sx={{ ml: 2, width: '20ch' }}
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTickerVolumeChange(index, e)}
                                    value={input.volume}
                                    error={tickersErr != null && tickersErr[`tickers.${index}.volume`] !== undefined}
                                    helperText={(tickersErr != null && tickersErr[`tickers.${index}.volume`] !== undefined) ? tickersErr[`tickers.${index}.volume`] : ''}
                                />
                                <IconButton
                                    aria-label="remove"
                                    size="large"
                                    style={{ width: "50px", height: 'fit-content' }}
                                    onClick={() => removeTicker(index)}>
                                    <RemoveIcon fontSize="inherit" />
                                </IconButton>
                                <IconButton
                                    aria-label="add"
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
                    Update
                </LoadingButton>
            </Box >
        </div >
    );
};

TacticEdit.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout childContainer={page} title="Edit Tactic"></MainLayout>
    )
}

export default TacticEdit;