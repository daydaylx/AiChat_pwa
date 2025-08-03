import React from "react";
import Header from "./Header";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="layout-root">
    <Header />
    <main>{children}</main>
  </div>
);

export default Layout;

