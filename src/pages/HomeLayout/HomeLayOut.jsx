// src/pages/HomeLayout/HomeLayout.jsx
import React from "react";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";


export default function HomeLayout() {
  return (
    <Layout className="">
      <Header />
      <Content >
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
}
