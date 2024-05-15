
import { useEffect } from "react";
import { callAPI } from "./API";

export let common = {
   
     useOutsideClick : (ref, callback) => {
        const handleClick = e => {
          if (ref.current && !ref.current.contains(e.target)) {
            callback();
          }
        };
      
        useEffect(() => {
          document.addEventListener("click", handleClick);
      
          return () => {
            document.removeEventListener("click", handleClick);
          };
        });
      },

      saveCampaignData:(campaignid,data)=>{ 
        callAPI({
          method: 'PUT',
          url: `user/campaign?id=${campaignid}`,
          data: data,
          loading:false,
          alert:false
        },
          (res) => {
            if (res.status == 1) {}
          })
      }
};
