import React, { useEffect, useState } from 'react'
import styles from '@/style/campaign.module.css'
import { Skeleton, CircularProgress } from '@mui/material';
import { Form } from '@/utils/formValidator';
import { useForm } from "react-hook-form";
import { callAPI } from '@/utils/API';
import { useRouter } from 'next/navigation';
import { setCampaignID } from '@/app/redux/commonSlice';
import { useDispatch } from 'react-redux';
import { useSearchParams } from "next/navigation";
import Popup from '@/app/components/popup/popup';
import { toast } from 'react-toastify';
import { languageArray } from '@/utils/data';

function Step3({ campaignid, handleActiveTab, campaignStepDeatils, campaignType }) {

  const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm({});
  const dispatch = useDispatch();
  const router = useRouter();
  const [btnLoader, setBtnLoader] = useState(false);
  const [arNames, setarNames] = useState([]);
  const [arMailList, setarMailList] = useState({});
  const [templateList, setTemplateList] = useState([]);
  const [preview, setPreview] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const [activeTemplate, setActiveTemplate] = useState('');
  const [enableRTL, setEnableRTL] = useState(false);
  const [langSelect, setlangSelect] = useState([]);

  const [loader, setLoader] = useState(false);
  const searchParams = useSearchParams();


  useEffect(() => {
    callAPI({
      method: 'GET',
      url: `/user/language`,
    }, (resp) => {
      if (resp.status == 1) {
        const dataKeys = Object.keys(resp.data);
        const filteredLanguageArray = languageArray
          .filter(language => dataKeys.includes(language.value))
          .map(language => ({ ...language }));
        if (!dataKeys.includes('en')) {
          filteredLanguageArray.push({ label: "English", value: "en" });
        }
        setlangSelect(filteredLanguageArray);
      }
    })
  }, [])

  useEffect(() => {
    if (campaignType) {
      setLoader(true);
      callAPI({
        method: 'GET',
        url: `user/template?type=${(campaignType == 'seat' || campaignType == 'table') ? 'seat_and_table' : campaignType}`,
      }, (resp) => {
        setLoader(false);
        if (resp.status == 1) {
          setActiveTemplate(resp.templateList[0]._id)
          setTemplateList(resp.templateList);
        }
      })
    }
  }, [campaignType])

  useEffect(() => {
    if (campaignStepDeatils) {
      campaignStepDeatils.template_id && setActiveTemplate(campaignStepDeatils.template_id);
      reset({
        maillist: campaignStepDeatils?.autoresponder?.listid,
        autoresponder: campaignStepDeatils?.autoresponder?.name,
        subHeadline: campaignStepDeatils.subHeadline,
        headline: campaignStepDeatils.headline,
        thankyouMessage: campaignStepDeatils.thankyouMessage,
        widget_language : campaignStepDeatils.language,
      });
      if(campaignStepDeatils.enableRTL)
      {
        setEnableRTL(campaignStepDeatils.enableRTL);
      }
    }

  }, []);

  useEffect(() => {
    callAPI(
      {
        method: 'GET',
        url: `/autoresponder`,
      },
      (res) => {
        if (res.status === 1) {
          let arNames = [];
          let arlists = {};

          res.autoresponder.map((item) => {
            const serviceName = Object.keys(item.autoresponder)[0];
            if (item.autoresponder[serviceName].listsData) {
              const lists = item.autoresponder[serviceName].listsData;
              let updatedlist = lists.map((item) => {
                return {
                  value: item.id,
                  label: item.name,
                }
              })
              arlists[serviceName] = updatedlist;
            }
            arNames.push({ label: serviceName, value: serviceName });
          });
          if (arNames.length > 0) setarNames(arNames);
          setarMailList(arlists);
        }

      }
    );
  }, [])


  const handleTab = (val) => {
    handleActiveTab(val)
  }

  const handleFinalSubmit = async (values) => {
    try {
      setBtnLoader(true);
      let data = {};
      data.subHeadline = values.subHeadline;
      data.headline = values.headline;
      data.thankyouMessage = values.thankyouMessage;
      data.language = values.widget_language;
      data.enableRTL = enableRTL;
      data.autoresponder = {
        name: values.autoresponder,
        listid: values.maillist,
      };

      data.template_id = activeTemplate;
      callAPI({
        method: 'PUT',
        url: `user/campaign?id=${campaignid}`,
        data: data,
        alert: false,
      },
        (res) => {
          if (res.status == 1) {
            if (!searchParams.get('cid')) {
              dispatch(setCampaignID(res.data));
              toast.success('Successfully created campaign.', { theme: "colored", toastId: "success" })
            } else {
              toast.success('Successfully updated campaign.', { theme: "colored", toastId: "success" })
            }
            reset();
            setBtnLoader(false);
            router.push('/user/campaigns');
          } else {
            setBtnLoader(false);
          }
        })


    } catch (error) {
      setBtnLoader(false)
    }
  }

  const closePopUphandler = () => {
    setPreview(false);
    setPreviewData({})
  }
  return (
    <>

      <form onSubmit={handleSubmit(handleFinalSubmit)}>

        <div className={styles.step3_main}>

          {loader ? [1, 2].map(val => <Skeleton variant="rectangular" width={226} height={250} key={val} />) :
            templateList.map((val) => (<div className={`${styles.main_card} ${styles.active_card}`} key={val._id}

            >
              <div className={styles.child_card}><img src={`/${val.thumbnail}`} />
                <div className={styles.card_overlay}><button className={styles.preview} type='button' onClick={() => { setPreview(true), setPreviewData(val) }}>Preview</button>
                </div>
              </div>

            </div>)
            )
          }
        </div>






        <div className='input_wrapper_list mt'>
          <Form fieldname='headline' label='Add Headline' inputType='text' register={register} errors={errors} applyValidation={false} isRequired={true} />
          <Form fieldname='subHeadline' label='Add Sub-Headline' inputType='text' register={register} errors={errors} applyValidation={false} isRequired={true} />
        </div>
        {(arNames?.length > 0) && <div className='input_wrapper_list mt'>
          <Form fieldname="autoresponder" label={`AutoResponder`} inputType={"select"} options={arNames} control={control} errors={errors} />
          {watch('autoresponder') && <Form fieldname="maillist" label={`maillist`} inputType={"select"} options={arMailList[watch('autoresponder')] || [{ label: 'This AR not have any mail list', value: 'undefined' }]} control={control} errors={errors} isRequired={true} />}
        </div>}

        <div className='input_wrapper_list'>
          <Form fieldname="widget_language" label={`Widget Language`} inputType={"select"} options={langSelect} control={control} errors={errors} isRequired={true} />
          <div className="xs_switch">

            <input
              id={'userChk_'}
              type="checkbox"
              value={enableRTL}
              checked={enableRTL? true : false}
              onChange={(e) => setEnableRTL(e.target.checked)}
            />

            <label htmlFor={'userChk_'}>
              <span className="xs_switch_icon"></span>
              <span className="xs_switch_text">Enable RTL</span>
              {/* //{row.status == 1 ? 'Active' : 'Inactive'} */}
            </label>
          </div>
        </div>

        <Form fieldname='thankyouMessage' label='Thank You Message' inputType='textarea' register={register} errors={errors} isRequired={true} />


        <div className="space_between mt">
          <button type='button' className="ap_btn_white mx_151" onClick={() => handleTab(2)}>Back</button>
          <button className="ap_btn mx_151" type="submit" disabled={btnLoader}>Publish
            {btnLoader ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : ''}
          </button>
        </div>
      </form>


      <Popup
        show={preview}
        maxWidth={'640px'}
        onClose={closePopUphandler}
      >
        <div>
          <img src={`/${previewData?.thumbnail}`} alt="" style={{ width: '100%' }} />
        </div>
      </Popup>
    </>

  )
}

export default Step3
