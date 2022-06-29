import { ReactElement } from "react";
import MainLayout from "../components/MainLayout";
import StockDataTable from "../components/StockDataTable";

const Home = () => {
  return (
    <StockDataTable></StockDataTable>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout childContainer={page} title='Dashboard'></MainLayout>
  )
}

export default Home;