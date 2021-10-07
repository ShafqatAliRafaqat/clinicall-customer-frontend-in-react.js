import React from "react";
import themeConfig from "../configs/themeConfig";
import classnames from "classnames";

const FullPageLayout = ({ children, ...rest }) => {
  let url = window.location.pathname;
  let layoutCheck = false;
  const arr = url.split("/");
  if (arr[1] === "login" && url.length > 7) {
    layoutCheck = true;
  }
  return (
    <div
      className={classnames(
        "full-layout wrapper bg-full-screen-image blank-page dark-layout",
        {
          "layout-dark": themeConfig.layoutDark,
        }
      )}
    >
      <div className="app-content">
        <div className="content-wrapper">
          <div className="content-body">
            <div
              className={layoutCheck ? "fullLayoutScroll" : "flexbox-container"}
            >
              <main className="main w-100">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPageLayout;
