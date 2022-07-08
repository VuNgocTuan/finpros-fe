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
import faker from 'faker';
import { useRouter } from "next/router";

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
            text: 'Profit',
        },
    },
};

const labels = ['2022-07-01', '2022-07-02', '2022-07-03', '2022-07-04', '2022-07-05', '2022-07-06', '2022-07-07'];

export const data = {
    labels,
    datasets: [
        {
            label: 'OCB',
            data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
    ],
};

const TacticProfit = () => {
    const router = useRouter();
    const tacticId = router.query.id;

    React.useEffect(() => {
        console.log(tacticId);
    }, []);

    return (
        <Line options={options} data={data} />
    );
}

TacticProfit.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout childContainer={page} title="Profit"></MainLayout>
    )
}

export default TacticProfit;
