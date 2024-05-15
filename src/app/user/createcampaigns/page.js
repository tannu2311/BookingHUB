'use client'
import PageTitle from '@/app/components/common/PageTitle'
import styles from '@/style/campaign.module.css'
import { Form } from '@/utils/formValidator'
import {  CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import Appointment from '../usercomponent/Appointment';
import { useSearchParams } from 'next/navigation';
import { callAPI } from '@/utils/API';
import Event from '../usercomponent/Event';
import Booking from '../usercomponent/Booking';
import { Loader } from '@/app/components/loader/CommonLoader';
import { useSelector } from 'react-redux';

function CreateCampaigns() {
  const [btnLoader, setBtnLoader] = useState(false);
  const [isloading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [campaignid, setCampaignid] = useState('');
  const [campaignType, setCampaignType] = useState('');
  const [isEdit, setisEdit] = useState(false);
  const [campaignStepDeatils, setcampaignStepDeatils] = useState();
  const[campaignCount,setCampaignCount] = useState();
  const user = useSelector((store) => store.storeData?.auth?.user);

  const { register, handleSubmit, formState: { errors }, reset, control ,watch} = useForm({
    defaultValues: {
      type: ''
    }
  });

  const searchParams = useSearchParams();

  const fetchCampaign = (id) => {
    setLoading(true)
    callAPI({
      method: 'GET',
      url: `user/campaign?id=${id}`,
    }, (res) => {
      setLoading(false)

      if (res.status == 1) {
        setLoading(false)
        if (res.campaignDetail.campaignId) {
          reset(res.campaignDetail.campaignId);
          setcampaignStepDeatils(res.campaignDetail.Details);
          setCampaignType(res.campaignDetail.campaignId.type)
        }
        else {
          reset(res.campaignDetail)
          setCampaignType(res.campaignDetail.type)
        }
      }
    });
  }

  const fetchCampaignList = () => {
      callAPI({
        method: 'GET',
        url: `/user/campaign`,
    }, (resp) => {
        if (resp.status == 1) {
             setCampaignCount(resp?.campaignslist.length);
        }
       
    })
}

  useEffect(() => {
    setCampaignid(searchParams.get('cid'));
    if (searchParams.get('cid')) {
      setisEdit(true);
      fetchCampaign(searchParams.get('cid'))
    }
    fetchCampaignList();
  }, [])


  const onSubmit = (updatedvalues) => {
  
   
      setCampaignType(updatedvalues.type);

      if (campaignid) {
        setBtnLoader(true)
        callAPI({
          method: 'POST',
          url: `user/campaign?id=${campaignid}`,
          data: updatedvalues
        }, (res) => {
          setBtnLoader(false)
          if (res.status == 1) {
            reset();
            setCampaignid(res.id)
            setActiveTab(2);
          }
        });
      }
      else {
        setBtnLoader(true)
        callAPI({
          method: 'POST',
          url: `user/campaign`,
          data: updatedvalues
        }, (res) => {
          setBtnLoader(false)
          if (res.status == 1) {
            reset();
            setCampaignid(res.id)
            setActiveTab(2)
          }
        });
      }
    
  }

  const handleActiveTab = (val) => {
    setActiveTab(val)
  }
  const handleCampaignIdOnBack = (id) => {
    fetchCampaign(id);
  }
 
  return (
    <div>
      {isEdit ? <PageTitle title='Edit Campaigns' /> : <PageTitle title='Create Campaigns' />}
      {isloading && <Loader />}
      <div className='content_wrapper'>
        <div className='center_content'>

          {/* Tabs  */}
          <div className={styles.tab_wrapper}>
            <div className={styles.tab_single}>
              <div>Step 1</div>
              <div className={styles.tab + " " + styles.active_tab}></div>
            </div>
            <div className={styles.tab_single}>
              <div>Step 2</div>
              <div className={(activeTab > 1) ? styles.tab + " " + styles.active_tab : styles.tab}></div>
            </div>
            <div className={styles.tab_single}>
              <div>Step 3</div>
              <div className={(activeTab == 3) ? styles.tab + " " + styles.active_tab : styles.tab}></div>
            </div>
          </div>


          {/* Step First Form  */}
          {(activeTab == '1') && <div className={styles.steps_form_wrap}>
            <form onSubmit={handleSubmit(onSubmit)}>

              <div className='input_wrapper_list'>
                 <Form fieldname='type' label='Campaign Type' inputType='select' isDisable={campaignType ? true : false} control={control} options={[{ label: 'Appointment', value: 'appointment' }, { label: 'Booking', value: 'booking' }, { label: 'Event', value: 'event' }]} errors={errors} isRequired={true} />
                  <Form fieldname='title' label='Campaign Title' inputType='text' register={register} errors={errors} applyValidation={true} isRequired={true} />
              
              </div>
              <div className='input_wrapper_list'>
                  <Form fieldname='business' label='Business Name' inputType='text' register={register} errors={errors} isRequired={true} />
                 <Form fieldname={'phone'} inputType={"phone"} label={'Phone Number'} register={register} errors={errors} control={control} isRequired={(watch('type') == 'event') ?  true : false} />
               
              </div>
              <div className='input_wrapper_list'>
                <Form fieldname='description' label='Description' inputType='textarea' register={register} errors={errors} applyValidation={false} isRequired={true} />
                 <Form fieldname='address' label='Address' inputType='textarea' register={register} errors={errors} applyValidation={false} isRequired={true} />
              </div>
                

              <div className="text-right"> 
              <button type="submit" disabled={btnLoader} className="ap_btn mx_151">Save{btnLoader ? <CircularProgress size={24} sx={{ color: '#fff' }} /> :''}</button> 

           </div>
            </form>
          </div>}

          {(activeTab != 1) && (campaignType == 'appointment') ? <Appointment activeTab={activeTab} handleCampaignIdOnBack={handleCampaignIdOnBack} handleActiveTab={handleActiveTab} campaignid={campaignid} campaignStepDeatils={campaignStepDeatils} /> : null}

          {(activeTab != 1) && (campaignType == 'event') ? <Event activeTab={activeTab} handleCampaignIdOnBack={handleCampaignIdOnBack} handleActiveTab={handleActiveTab} campaignid={campaignid} campaignStepDeatils={campaignStepDeatils} /> : null}

          {(activeTab != 1) && (campaignType == 'booking') ? <Booking activeTab={activeTab} handleCampaignIdOnBack={handleCampaignIdOnBack} handleActiveTab={handleActiveTab} campaignid={campaignid} campaignStepDeatils={campaignStepDeatils} /> : null}



        </div>
      </div>
    </div>
  )
}

export default CreateCampaigns
