// src/pages/HomeLayout/HomeLayout.jsx
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";
import "./styles/PageLayout.scss"


export default function PageLayout() {
  return (
    <Layout className="layout-background">
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}
