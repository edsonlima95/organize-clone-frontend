import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import { InvoiceModalContext } from '../contexts/InvoiceModalContext'
import InvoiceModal from '../components/Modal';
import InvoiceForm from './invoices/invoiceForm';
import Header from '../components/Header';
import { getCookie, removeCookies } from 'cookies-next';
import Router from 'next/router';
import { GetServerSideProps } from 'next';
import api from '../services/axios';
import { MenuLeft } from '../components/MenuLeft';

type Layout = {
    children: React.ReactNode
}

function Layout({ children }: Layout) {

    const { closeInvoiceModal, invoiceModalIsOpen } = useContext(InvoiceModalContext)
   
    const [isMenuOpen, setMenuOpen] = useState(false)

    const token = getCookie('organize.token');
    const user = getCookie('organize.user');

    useEffect(() => {

        if (!token && !user) {
            Router.push("/auth/login")
        }

        checkToken()

    }, [])

    async function checkToken() {

        try {
            
            if(token) {
                await api.get("/check-token", { headers: { Authorization: `Bearer ${token}` } })
            }
            
        } catch (err: any) {
            localStorage.removeItem("organize.wallet")
            removeCookies("organize.token")
            removeCookies("organize.user")
            Router.push("/auth/login")
        }
    }

    function menuOpen(){
        setMenuOpen(!isMenuOpen)
    }

    return (
        <>

            <Header setMenuOpen={menuOpen}/>

            <MenuLeft isMenuOpen={isMenuOpen} onMenuToggle={setMenuOpen} />

            <main className="bg-[#f8f8f8] p-5 min-h-screen">

                <InvoiceModal
                    handleCloseModal={closeInvoiceModal}
                    modalIsOpen={invoiceModalIsOpen} >
                    <InvoiceForm />
                </InvoiceModal>

                {children}
            </main>

        </>
    )
}



export default Layout
