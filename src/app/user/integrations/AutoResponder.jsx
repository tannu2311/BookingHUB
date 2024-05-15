"use client"
import { callAPI } from '@/utils/API'
import styles from '@/style/autoresponders.module.css'
import svg from '@/utils/svg'
import Popup from '@/app/components/popup/popup'
import { Form } from '@/utils/formValidator';
import { useForm } from "react-hook-form";
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material'
import { ResponderDisconnectPopUp } from '@/app/components/popup/deleteConfirm'
import { useSelector } from 'react-redux';

function AutoResponders() {

  const user = useSelector((store) => store.storeData.auth.user)

  const { register, handleSubmit, control, formState: { errors }, reset ,setValue} = useForm({
 });
  const [showEditPopUp, setShowEditPopUp] = useState(false);
  const [selectedAutoResponder, setSelectedAutoResponder] = useState('');
  const [ActiveAutoResponder, setActiveResponder] = useState([])
  const [showDisconnectPopup, setShowDisconnectPopup] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);

  const [Ardata, setArdata] = useState([]);

  useEffect(() => {
    fetchAutoResponderData();
  }, [])


  const fetchAutoResponderData = () => {
    callAPI({
      method: 'GET',
      url: '/autoresponder',
    }, (resp) => {
      if (resp.status == 1) {
        setArdata(resp.autoresponder, "jkjk");
        let autoresponderNames = resp.autoresponder.map(item => Object.keys(item.autoresponder)[0]);
        setActiveResponder(autoresponderNames)
      }
    });
  }

  const PopupCloseHandler = () => {
    setShowEditPopUp(false);
    setShowDisconnectPopup(false)
    setValue('Api_key' , '');
  
  }

  function commonReset(response) {
    setBtnLoader(false)
    if (response.status == 1) {
      reset()
    }
    else {
      setBtnLoader(false)
    }
    fetchAutoResponderData();
    setShowEditPopUp(false)
  }
  const onSubmitUpdate = (updatedata) => {

    setBtnLoader(true)

    callAPI({
      method: 'POST',
      url: `/autoresponder?Autoresponder=${selectedAutoResponder}`,

      data: updatedata
    }, (response) => {
      commonReset(response)
    })

  }

  const handleClick = (value) => {
    const contains = ActiveAutoResponder.some(item => item.includes(value));
    setSelectedAutoResponder(value);
    if (contains) {
      setShowDisconnectPopup(true)
    }
    else {
      setShowEditPopUp(true)
    }
  }

  const handlePopUp = (val) => { 
    if (val) {
      callAPI({
        method: 'DELETE',
        url: `/autoresponder?autoresponder=${selectedAutoResponder}`,
      }, (resp) => {
        if (resp.status == 1) {
          fetchAutoResponderData();
        }
      })
    }
    setShowDisconnectPopup(false);
  }

  const handleUpdate = (value) => {

    const contains = Ardata.find(item => item.autoresponder[value] !== undefined);
    setSelectedAutoResponder(value);
    if (contains) {
      setShowDisconnectPopup(true)
    } else {
      setShowEditPopUp(true);
    }
  };

  const handleLinks =(url) =>{
    var openWindow = window.open(url, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
            
    // check popup is closed or not with interval.
    var popupTick = setInterval(function() {
        if (openWindow.closed) { 
            clearInterval(popupTick);
            setTimeout(() => {
              fetchAutoResponderData(); 
            }, 200);
        }
    }, 500);
  }

  return (
    <div>
      <div className='center_content'>
        <div className={styles.autoresponders_main}>
          <div className={styles.autoresponders_svg}>
            <div className={styles.auto_wrap}>

             
                <div className={(ActiveAutoResponder.includes('Aweber')) ? styles.active_autoresponder : null}>
             { (!ActiveAutoResponder.includes('Aweber')) &&  <a onClick={()=>handleLinks(`https://auth.aweber.com/oauth2/authorize?response_type=code&client_id=${process.env.AWEBER_CLIENT_ID}&client_secret=${process.env.AWEBER_CLIENT_SECRET}&redirect_uri=${process.env.APP_URL}/connection/Aweber&scope=account.read%20list.read%20list.write%20subscriber.read%20subscriber.write%20email.read%20email.write&state=1`)}></a>}
                  <span className={styles.hide_tick}>{svg.white_tick}</span>
                  <span onClick={() => handleClick('Aweber')} className={styles.cross_chek}>{svg.cross_chek}</span>
                  <div onClick={() => {setSelectedAutoResponder('Aweber');(ActiveAutoResponder.includes('Aweber')) && handleUpdate('Aweber')}} className={styles.autoresponders_aweber}>{svg.aweber}</div>
                </div>
             


              <div className={(ActiveAutoResponder.includes('GetResponse')) ? styles.active_autoresponder : null}><span className={styles.hide_tick}>{svg.white_tick}</span><span onClick={() => handleClick('GetResponse')} className={styles.cross_chek} >{svg.cross_chek}</span><div onClick={() => handleUpdate('GetResponse')} className={styles.autoresponders_getrespons}>{svg.getresponse}</div> </div>

              <div className={(ActiveAutoResponder.includes('ActiveCampaign')) ? styles.active_autoresponder : null}><span className={styles.hide_tick}>{svg.white_tick}</span><span onClick={() => handleClick('ActiveCampaign')} className={styles.cross_chek}>{svg.cross_chek}</span>  <div onClick={() => handleUpdate('ActiveCampaign')} className={styles.autoresponders_activecampaign}>{svg.activecampaign}</div></div>
              
             
                <div className={(ActiveAutoResponder.includes('Constant-Contact')) ? styles.active_autoresponder : null}>
                { (!ActiveAutoResponder.includes('Constant-Contact')) &&  <a onClick={()=>handleLinks(`https://authz.constantcontact.com/oauth2/default/v1/authorize?client_id=${process.env.CONSTANT_CONTACT_CLIENT_ID}&state=${user.id}&scope=contact_data+offline_access&response_type=code&redirect_uri=${process.env.APP_URL}/connection/Constant-Contact`)}></a>}
                  <span className={styles.hide_tick}>{svg.white_tick}</span>
                  <span onClick={() => handleClick('Constant-Contact')} className={styles.cross_chek}>{svg.cross_chek}</span>
                  <div onClick={() =>{ setSelectedAutoResponder('Constant-Contact');(ActiveAutoResponder.includes('Constant-Contact')) && handleUpdate('Constant-Contact')}} className={styles.autoresponders_constant}>{svg.constant}</div>
                </div>
             

              <div className={(ActiveAutoResponder.includes('Mailchimp')) ? styles.active_autoresponder : null}><span className={styles.hide_tick}>{svg.white_tick}</span><span onClick={() => handleClick('Mailchimp')} className={styles.cross_chek}>{svg.cross_chek}</span><div onClick={() => handleUpdate('Mailchimp')} className={styles.autoresponders_mailchimp}>{svg.mailchimp}</div></div>
             
              <div className={(ActiveAutoResponder.includes('ConvertKit')) ? styles.active_autoresponder : null}><span className={styles.hide_tick}>{svg.white_tick}</span><span onClick={() => handleClick('ConvertKit')} className={styles.cross_chek}>{svg.cross_chek}</span> <div onClick={() => handleUpdate('ConvertKit')} className={styles.autoresponders_convertkit}>{svg.convertkit}</div></div>
              <div className={(ActiveAutoResponder.includes('SendPulse')) ? styles.active_autoresponder : null}><span className={styles.hide_tick}>{svg.white_tick}</span><span onClick={() => handleClick('SendPulse')} className={styles.cross_chek}>{svg.cross_chek}</span><div onClick={() => handleUpdate('SendPulse')} className={styles.autoresponders_sendpule}>{svg.sendpulse}</div></div>
              <div className={(ActiveAutoResponder.includes('SendGrid')) ? styles.active_autoresponder : null}><span className={styles.hide_tick}>{svg.white_tick}</span><span onClick={() => handleClick('SendGrid')} className={styles.cross_chek}>{svg.cross_chek}</span> <div onClick={() => handleUpdate('SendGrid')} className={styles.autoresponders_sendgrid}>{svg.sendgrid}</div></div>
            </div>
          </div>
        </div>
        <div className={styles.autoresponders_form}>


          <Popup
            show={showEditPopUp}
            onClose={PopupCloseHandler}
            maxWidth={'570px'}
          >
            <form onSubmit={handleSubmit(onSubmitUpdate)}>
              {(selectedAutoResponder == "ActiveCampaign") && (
                <Form
                  fieldname='Url'
                  label='API URL'
                  inputType='text'
                  register={register}
                  errors={errors}
                  applyValidation={false}
                  isRequired={true}
                />
              )}

              {(["ActiveCampaign", "GetResponse", "Mailchimp", "ConvertKit", "SendPulse", "SendGrid"].includes(selectedAutoResponder)) && (
                <Form
                  fieldname='Api_key'
                  label='API key'
                  inputType='text'
                  register={register}
                  errors={errors}
                  applyValidation={false}
                  isRequired={true}
                />
              )}
              {(["ConvertKit"].includes(selectedAutoResponder)) && (
                <Form
                  fieldname='secret_key'
                  label='API Secret Key'
                  inputType='text'
                  register={register}
                  errors={errors}
                  applyValidation={false}
                  isRequired={true}
                />
              )}
              {(selectedAutoResponder == "SendPulse") && (
                <Form
                  fieldname='client_secret'
                  label='API Secret Key'
                  inputType='text'
                  register={register}
                  errors={errors}
                  applyValidation={false}
                  isRequired={true}
                />
              )}
              {(selectedAutoResponder == "SendPulse") && (
                <Form
                  fieldname='grant_type'
                  label='Grant type'
                  inputType='text'
                  register={register}
                  errors={errors}
                  applyValidation={false}
                  isRequired={true}
                />
              )}

              <button type='button' className={styles.autoresponders_button} onClick={() => setShowEditPopUp(false)} >Cancel</button>
              <button type='submit' className={styles.autoresponders_button1}>Submit   {btnLoader ? <CircularProgress size={18} sx={{ color: '#FFF' }} /> : ''}</button>
            </form>
          </Popup>

          <Popup
            show={showDisconnectPopup}
            onClose={PopupCloseHandler}
            maxWidth={'370px'}
          >
            <ResponderDisconnectPopUp autoresponder={selectedAutoResponder} handlePopUp={handlePopUp} />
          </Popup>
        </div>
      </div>
    </div>
  )
}

export default AutoResponders
