'use client'
import PageTitle from '@/app/components/common/PageTitle'
import  { useEffect, useState,useRef } from 'react'
import styles from '@/style/dash.module.css';
import svg from '@/utils/svg';
import { callAPI } from '@/utils/API';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { addUserDetail } from '@/app/redux/authSlice';
import { Loader } from '@/app/components/loader/CommonLoader';


function page() {

  const [totalCampaigns, settotalCampaigns] = useState();
  const [totalCustomers, settotalCustomers] = useState();
  const [totalBookings, settotalBookings] = useState();
  const [loading, setLoading] = useState(true);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const elementRef = useRef(null);
  
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (session) {
      setLoading(true)
      callAPI({
        method: 'GET',
        url: 'common'
      }, (data) => {
        setLoading(false);
        dispatch(addUserDetail({ val: session}));
      })
     
    }

    callAPI({
      method: 'GET',
      url: 'user/dashboard',
    }, (resp) => {
      setLoading(false)
      if (resp.status == 1) {
        settotalCampaigns(resp.totalCampaigns);
        settotalCustomers(resp.totalCustomers);
        settotalBookings(resp.totalBookings);
       
      }
    });
  }, [])

  const handleButtom = () => {
    if (isPlayingVideo) {
        elementRef.current.pause()
        setIsPlayingVideo(false)
    } else {
        elementRef.current.play()
        setIsPlayingVideo(true)
    }
}

if(loading){
  return <Loader/>
}else{
  return (

    <div>

      <PageTitle title="Dashboard" />
      <div className='content_wrapper'>
        <div className={styles.dash_main}>

          <div className={styles.dash_maincard}>

            <div className={styles.dash_card}>
              <div className={styles.dash_usericon + ' ' + styles.card_color1}>{svg.dash_campaign}</div>
              <div className={styles.card_content}>
                <p>Total Campaigns</p>
                <h3>{totalCampaigns}</h3>
              </div>

            </div>
            <div className={styles.dash_card}>
              <div className={styles.dash_usericon + ' ' + styles.card_color4}>{svg.dash_booking}</div>
              <div className={styles.card_content}>
                <p>Total Bookings</p>
                <h3>{totalBookings}</h3>
              </div>
            </div>
            <div className={styles.dash_card}>
              <div className={styles.dash_usericon + ' ' + styles.card_color3}>{svg.dashboard_user}</div>
              <div className={styles.card_content}>
                <p>Total Customers</p>
                <h3>{totalCustomers}</h3>
              </div>
            </div>
           
          </div>

          <div className={styles.tutorial_wrapper}>
            <h1>Tutorial Video</h1>
            <div className={styles.dash_box_wrapper}>
              <div className={styles.dash_firstcard}>
                <video controls width="724px" onEnded={() => setIsPlayingVideo(false)} onPlay={() => setIsPlayingVideo(true)} onPause={()=>setIsPlayingVideo(false)} src="/video.mp4" ref={elementRef}>
              
                  </video>
                  { !isPlayingVideo &&  <div className={styles.dash_video_icon} onClick={()=> handleButtom()}>{svg.video_icon}</div> }
              </div>
              <div className={styles.dash_secondcard}>
                <h3>Revolutionizing Booking, Appointments, and Event Coordination</h3>
                <p>Welcome to the future of hassle-free appointment scheduling, booking, and event management! Our comprehensive SaaS platform equips you to effortlessly create bespoke booking systems using an intuitive widget. Tailor your approach with options for both free and paid bookings, backed by secure PayPal and Stripe integrations. Customize your calendar by marking holidays or blocking specific dates, and fine-tune your booking forms with additional fields to capture vital information. Our robust database ensures all details are safely stored, while automated confirmation emails keep both users and visitors informed. Experience a unified solution that takes the stress out of scheduling, registration, and event coordination.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
 
}

export default page