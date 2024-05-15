import {createSlice} from "@reduxjs/toolkit"

export const commonSlice= createSlice({
    name:"common",
    initialState:{
        menuToggle: false,
        campaignWidgetId:{}
    },
    reducers:{ 
        setHideShowSidebarPopup: (state, action) => {
            return {...state , menuToggle : action.payload};
        },
        setCampaignID:(state,action) =>{
            return {...state , campaignWidgetId : action.payload}
        }
    }
})


export const {setHideShowSidebarPopup, setCampaignID} = commonSlice.actions;
export default commonSlice.reducer;