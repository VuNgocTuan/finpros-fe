import { ReactElement } from "react";
import MainLayout from "../components/MainLayout";
import StockDataTable from "../components/StockDataTable";

const Home = () => {
  return (
    <StockDataTable></StockDataTable>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  const { props } = page;
  return (
    <MainLayout childContainer={page}></MainLayout>
  )
}

export default Home;