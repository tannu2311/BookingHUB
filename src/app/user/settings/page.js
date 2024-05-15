"use client";
import PageTitle from "@/app/components/common/PageTitle";
import { useState } from "react";
import SettingsProfile from "./profile/page";
import styles from "@/style/setting.module.css";
import Billing from "./billing/page";
import Subscription from "./subscription/page";
import LanguageSettings from "./Language/page";

function Setting() {
  const [activeTab, setActiveTab] = useState("profile");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <PageTitle title="Settings" />
      <div className="content_wrapper">
        <div className="center_content">
          <div className={styles.setting_container}>
            <div
              className={`${styles.setting_tab} ${
                activeTab === "profile" ? styles.active_tab : ""
              }`}
              onClick={() => handleTabChange("profile")}
            >
              Profile
            </div>
            <div
              className={`${styles.setting_tab} ${
                activeTab === "billing" ? styles.active_tab : ""
              }`}
              onClick={() => handleTabChange("billing")}
            >
              Billing
            </div>
            <div
              className={`${styles.setting_tab} ${
                activeTab === "subscription" ? styles.active_tab : ""
              }`}
              onClick={() => handleTabChange("subscription")}
            >
              Subscription
            </div>
            <div
              className={`${styles.setting_tab} ${
                activeTab === "language" ? styles.active_tab : ""
              }`}
              onClick={() => handleTabChange("language")}
            >
             Widget Language
            </div>
          </div>

          
        </div>
        <div className="tab-content">
          {activeTab === "profile" && <SettingsProfile />}
          {activeTab === "billing" && <Billing />}
          {activeTab === "subscription" && <Subscription />}
          {activeTab === "language" && <LanguageSettings />}

        </div>
      </div>
    </div>
  );
}

export default Setting;
