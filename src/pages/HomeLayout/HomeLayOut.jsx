// src/pages/HomeLayout/HomeLayout.jsx
import React from "react";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./styles/HomeLayout.scss";
import FeedbackNotificationComponent from "../../components/Notifications/FeedbackNotification/FeedbackNotificationComponent";

export default function HomeLayout() {

  return (
    <Layout>
      <Header />
      <Content className="layout-background" style={{ padding: `0` }}>
        <FeedbackNotificationComponent />
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
}
