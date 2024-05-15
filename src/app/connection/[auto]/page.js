"use client"
import { callAPI } from "@/utils/API";
import { useEffect, useState } from "react";
import styles from '@/style/autoresponders.module.css'
import { useSearchParams } from 'next/navigation'
import { Loader } from "@/app/components/loader/CommonLoader";


function page({params}) {
    const searchParams = useSearchParams();
    const[connected,setConnected] = useState(false);
    const[errMes,setErrMes] = useState('');
    const [loader,setLoader] = useState(false);

    useEffect(() => {
      
        if((params.auto == 'Aweber')  || (params.auto == 'Constant-Contact'))
        setLoader(true);
        {  
            if(searchParams.get('code')){
                callAPI({
                    method: 'POST',
                    url: `/autoresponder?Autoresponder=${params.auto}`,
                    data: {
                      "code": searchParams.get('code'),
                      "state": searchParams.get('state')
                    }
                  }, (response) => { 
                  setLoader(false);
                    if (response.status == 1) {
                        setConnected(true) ;
                     }
                  })
                }        
            }   
      }, [])

  return (
    <div className='center_content' style={{height:'100vh'}}>
    <div className={styles.connect_outer_box}>
                {loader ? <Loader/>
                        :
            (connected) ?  <div className={styles.tick_div}>
                    <img  src='/auth/check.gif' />
                    <h3>All set! {process.env.APP_NAME} is successfully connected to {params.auto}.</h3>
                </div>  :
                <div className={styles.tick_div}>
                <img  src='/auth/cross.png' />
                <h3>{errMes}</h3>
                </div>    
            } 
                
        </div>
        </div>
  )
}

export default page