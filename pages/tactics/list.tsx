import { ReactElement } from "react";
import MainLayout from "../../components/MainLayout";
import TacticDataTable from "../../components/TacticDataTable";

const TacticList = () => {
    return (
        <TacticDataTable></TacticDataTable>
    );
};

TacticList.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout childContainer={page} title="Tactics List"></MainLayout>
    )
}

export default TacticList;