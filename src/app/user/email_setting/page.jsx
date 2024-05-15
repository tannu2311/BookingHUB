'use client'
import { useState } from 'react'
import styles from '@/style/integration.module.css'
import SmtpSetting from './SmtpSetting';
import EmailContent from './EmailContent';
import PageTitle from '@/app/components/common/PageTitle';

function EmailSetting() {
    const [activeTab, setActiveTab] = useState('smtp');
    const handleTabChange = (tab) => {
      setActiveTab(tab);
    };
  return (

    <div>
   <PageTitle title="Email Settings"/>
    <div className='content_wrapper'>
      <div className='center_content'>
      <div
        className={styles.integration_container}
        
      >
        <div
          className={`${styles.integration_tab} ${
            activeTab === 'smtp' ? styles.active_tab : ''
          }`}
          onClick={() => handleTabChange('smtp')}
        >
          SMTP Settings
        </div>
        <div
          className={`${styles.integration_tab} ${
            activeTab === 'content' ? styles.active_tab : ''
          }`}
          onClick={() => handleTabChange('content')}
        >
          Email Content Settings
        </div>
      </div>
    
        {activeTab === 'smtp' && <SmtpSetting/>}
        {activeTab === 'content' &&  <EmailContent />} 
    
    </div>
    
  </div>
  </div>




  )
}

export default  EmailSetting

