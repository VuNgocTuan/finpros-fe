import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import React, { ReactElement } from "react";
import MainLayout from "../../components/MainLayout";
import APIUtils from "../../src/Services/APIUtils";

const TacticUpload = () => {
    const [tactics, setTactics] = React.useState([]);

    React.useEffect(() => {

    }, [])

    function callTacticData(newPage: number = 0) {
        const page = newPage + 1;
        const url = `/api/tactics?page=${page}`;

        APIUtils.fetch('GET', url).then(response => {
            setTactics(response?.data.data);
        });
    }

    function handleTacticChange(newValue: any) { }

    return (
        <Box
            component="div"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
        >
            <Typography component="h6" variant="h6">
                Tactic Infomation
            </Typography>

            <Autocomplete
                disablePortal
                id="combo-box-demo"
                defaultValue={!tactics.length ? tactics[0] : null}
                value={tactics[0] ?? null}
                options={tactics}
                sx={{ width: '15ch' }}
                onChange={(e, newValue) => handleTacticChange(newValue)}
                renderInput={
                    (params) => <TextField
                        {...params}
                        label="Symbol"
                    // error={tickersErr != null && tickersErr[`tickers.${index}.ticker`] !== undefined}
                    // helperText={(tickersErr != null && tickersErr[`tickers.${index}.ticker`] !== undefined) ? tickersErr[`tickers.${index}.ticker`] : ''}
                    />
                }
            />
        </Box>
    );
};

TacticUpload.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout childContainer={page} title="Upload Tactic CSV"></MainLayout>
    )
}

export default TacticUpload;