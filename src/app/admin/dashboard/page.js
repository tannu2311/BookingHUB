'use client'
import PageTitle from '@/app/components/common/PageTitle'
import { useEffect, useState } from 'react'
import styles from '@/style/dash.module.css';
import svg from '@/utils/svg';
import { callAPI } from '@/utils/API';
import { Skeleton, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { addUserDetail } from '@/app/redux/authSlice';
import { Loader } from '@/app/components/loader/CommonLoader';

function Dashboard() {
  const [totalUsers, settotalUsers] = useState(0);
  const [totalPlans, settotalPlans] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loader,setLoader] = useState(false);
  const store = useSelector((store) => store.storeData.auth)
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (session) {
      setLoader(true)
      callAPI({
        method: 'GET',
        url: 'common'
      }, (data) => {
        setLoader(false)

        dispatch(addUserDetail({ val: session}));
      })
    }
    
    callAPI({
      method: 'GET',
      url: 'admin/dashboard',
    }, (resp) => {
      setLoading(false)
      if (resp.status == 1) {
        settotalPlans(resp.totalPlans);
        settotalUsers(resp.totalUsers);
      }
    });
  }, [])

  if(loader){
    return <Loader/>
  }else{
    return (

      <div>
        <PageTitle title="Dashboard" />
        <div className='content_wrapper'>
          <div className={styles.dash_main}>
  
            {!loading ? <div className={styles.dash_maincard}>
  
              <div className={styles.dash_card}>
                <div className={styles.dash_usericon + ' ' + styles.card_color1}>{svg.dashboard_user}</div>
                <div className={styles.card_content}>
                  <p>Total Users</p>
                  <h3>{totalUsers}</h3>
                </div>
  
              </div>
              <div className={styles.dash_card}>
                <div className={styles.dash_usericon + ' ' + styles.card_color2}>{svg.plan}</div>
                <div className={styles.card_content}>
                  <p>Total Plans</p>
                  <h3>{totalPlans}</h3>
                </div>
              </div>
            </div>
              :
              <Stack direction="row" spacing={3}>
                {[1, 2, 3, 4].map(val => <Skeleton key={val} variant="rounded" width={310} height={130} />)}
              </Stack>
            }
          </div>
        </div>
      </div>
    )

  }

 
}

export default Dashboard