import React, { ReactElement, useEffect } from "react";
import MainLayout from "../../../../components/MainLayout";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useRouter } from "next/router";
import APIUtils from "../../../../src/Services/APIUtils";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Tactic 01',
        },
    },
};

const labels = [''];

export const data = {
    labels: labels,
    datasets: [
        {
            label: 'Total Profit',
            data: [0],
            borderColor: '#0066ff',
            backgroundColor: '#cce0ff',
        }
    ],
};

const TacticProfit = () => {
    const [profitData, setProfitData] = React.useState(data);
    const [profitOption, setProfitOption] = React.useState(options);
    const [totalProfit, setTotalProfit] = React.useState(0);
    const router = useRouter();
    const tacticId = router.query.id;

    React.useEffect(() => {
        APIUtils.fetch('GET', `/api/tactics/${tacticId}`, data).then(response => {
            const data = response?.data;
            profitOption.plugins.title.text = `${data.name} - ${data.author}`;
        }).catch(err => {
            console.log(err);
        });

        APIUtils.fetch('GET', `/api/tactics/profit/${tacticId}`, data).then(response => {
            const data = response?.data;
            setTotalProfit(data.total);
            setProfitData({
                labels: data.dates,
                datasets: [
                    {
                        label: `Profit`,
                        data: data.profits,
                        borderColor: '#0066ff',
                        backgroundColor: '#cce0ff',
                    }
                ],
            });
        }).catch(err => {
            console.log(err);
        });
    }, []);

    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });


    return (
        <div>
            <Line options={options} data={profitData} />
            <TableContainer component={Paper} sx={{ mt: 8 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Profit&nbsp;(VND)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {profitData.labels.map((row, index) => (
                            <TableRow
                                key={row}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row}
                                </TableCell>
                                <TableCell align="right">{formatter.format(profitData.datasets[0].data[index])}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell component="th" scope="row" size="medium">
                                <Typography variant="button">Total</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="button">{formatter.format(totalProfit)}</Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

TacticProfit.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout childContainer={page} title="Profit"></MainLayout>
    )
}

export default TacticProfit;
