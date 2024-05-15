import {combineReducers, configureStore} from '@reduxjs/toolkit'
import { persistStore, persistReducer ,FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import commonReducer from './commonSlice'
import authReducer from './authSlice'


const persistConfig = {
    key: 'root',
    storage,
  };
const reducer =combineReducers({
    common: commonReducer,
    auth:authReducer,
})
const persistedReducer = persistReducer(persistConfig, reducer);

const store= configureStore({
    reducer:{
        storeData:persistedReducer,
      
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})
export default store;
