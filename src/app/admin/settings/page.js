"use client";
import PageTitle from "@/app/components/common/PageTitle";
import ProfileSetting from "@/app/components/common/ProfileSetting";
import  { useState } from "react";
import styles from "@/style/setting.module.css";
import SmtpSetting from "@/app/user/email_setting/SmtpSetting";
import EmailContent from "@/app/user/email_setting/EmailContent";

function page() {
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
                activeTab === "smtp" ? styles.active_tab : ""
              }`}
              onClick={() => handleTabChange("smtp")}
            >
              SMTP Settings
            </div>
            <div
              className={`${styles.setting_tab} ${
                activeTab === "content" ? styles.active_tab : ""
              }`}
              onClick={() => handleTabChange("content")}
            >
              Email Content Settings
            </div>
          </div>  

            {activeTab === "smtp" && <SmtpSetting />}
            {activeTab === "content" && <EmailContent />}        
        </div>
        <div className="tab-content">
              {activeTab === "profile" && <ProfileSetting />}
            
          </div>
          
     
      </div>
    </div>
  );
}

export default page;
