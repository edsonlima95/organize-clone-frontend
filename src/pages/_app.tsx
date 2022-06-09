import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import Modal from 'react-modal';
import { InvoiceModalProvider } from '../contexts/InvoiceModalContext';
import Header from '../components/Header';
import Layout from './layout';
import { InvoiceProvider } from '../contexts/InvoiceContext';
import { getCookie } from 'cookies-next';
import Login from './auth/login';
import Router from 'next/router';
import { useEffect } from 'react';

import Dashboard from '../pages'
import { GetServerSideProps } from 'next';
import { AuthProvider } from '../contexts/AuthContext';

Modal.setAppElement('#__next');

function MyApp({ Component, pageProps }: AppProps) {


  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <InvoiceModalProvider>
        <InvoiceProvider>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </InvoiceProvider>
      </InvoiceModalProvider>


    </>
  )

}


export default MyApp
