import axios from 'axios';


import { toast } from 'react-toastify';
export const callAPI = async (params, cb) => {
    var detail = {
        method: params.method,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            mode: "cors", // no-cors
        },
    };
    
    if(params.isFormData){
        detail["headers"]["Content-Type"] = "multipart/form-data";
        detail["data"] = params.data;
    }else{
        detail["data"] = JSON.stringify(params.data);
    }

    axios('/api/' + params.url, detail).then(function (resp) {
       
        var resp = resp.data;
        if (resp.status == 1) {
            if (resp.message && resp.message != "") {
                if(params.alert !== false){
                    toast.success(resp.message,{ theme: "colored" , toastId: "success"})
                }
            }
            cb(resp);
            return resp;
        }else{
            if(params.alert !== false){
            toast.error(resp.message,{ theme: "colored", toastId: "error" })

        }
            cb(resp);
            return resp;
        }
    }).catch(function (error) {

        if(error.code === "ERR_NETWORK"){
            toast.error(error.message,{ theme: "colored",toastId: "network" })
        }else{
            toast.error(error.message,{ theme: "colored" ,toastId: "error"})

        }
    });
}