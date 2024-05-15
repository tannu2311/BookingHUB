'use client';

import { SessionProvider } from "next-auth/react";
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import persistStore from 'redux-persist/es/persistStore';
import store from "../redux/store";

let persistor = persistStore(store);
const AppProvider = ({ children, session }) => (
  <SessionProvider session={session}>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  </SessionProvider>
)

export default AppProvider;