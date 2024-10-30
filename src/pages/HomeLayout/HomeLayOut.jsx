// src/pages/HomeLayout/HomeLayout.jsx
import React from "react";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./styles/HomeLayout.scss";
import FeedbackNotificationComponent from "../../components/Notifications/FeedbackNotification/FeedbackNotificationComponent";
import useAuth from "../../services/config/provider/useAuth"; // Import auth hook

export default function HomeLayout() {
  const { auth } = useAuth();

  return (
    <Layout>
      <Header />
      <Content className="layout-background" style={{ padding: `0` }}>
        {auth?.role && <FeedbackNotificationComponent />}
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
}
