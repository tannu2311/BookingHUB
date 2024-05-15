'use client'
import { useState } from 'react'
import PageTitle from '@/app/components/common/PageTitle'
import styles from '@/style/integration.module.css'

import PaymentIntegrate from '@/app/components/common/paymentIntegrate'
import AutoResponders from './AutoResponder'

function Integrations() {
    const [activeTab, setActiveTab] = useState('autoresponders');
    const handleTabChange = (tab) => {
      setActiveTab(tab);
    };
  return (

    <div>
    <PageTitle title='Integrations' />
    <div className='content_wrapper'>
      <div className='center_content'>
      <div
        className={styles.integration_container}
        
      >
        <div
          className={`${styles.integration_tab} ${
            activeTab === 'autoresponders' ? styles.active_tab : ''
          }`}
          onClick={() => handleTabChange('autoresponders')}
        >
          Autoresponders
        </div>
        <div
          className={`${styles.integration_tab} ${
            activeTab === 'paymentmethods' ? styles.active_tab : ''
          }`}
          onClick={() => handleTabChange('paymentmethods')}
        >
          Payment Methods
        </div>
      </div>
     
    </div>
    <div >
        {activeTab === 'autoresponders' && <AutoResponders/>}
        {activeTab === 'paymentmethods' &&  <PaymentIntegrate />} 
      </div>
  </div>
  </div>




  )
}

export default Integrations
