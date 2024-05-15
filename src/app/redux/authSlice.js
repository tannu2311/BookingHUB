import { createSlice } from "@reduxjs/toolkit"


export const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: {},
    },
    reducers: {
        addUserDetail: (state, action) => {
            
            let userData= {...action.payload.val}
            return { user : userData};
        },
        logoutRemoveUser: () => {  
            return { user : {}};
        },
        updatePlanStatus:(state, action) =>{
        return {user:{...state.user, planStatus:action.payload.status, noOfCampaigns: action.payload.campCount}};

        }
    }
})

export const { addUserDetail ,logoutRemoveUser ,updatePlanStatus} = authSlice.actions;
export default authSlice.reducer;

