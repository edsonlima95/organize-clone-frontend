import { createContext, useContext, useState } from "react";

type Modal = {
    children: React.ReactNode
}


type ModalContext = {
    openInvoiceModal: (type: 'expense' | 'income', invoice?: number) => void,
    afterOpenModal?: () => void,
    closeInvoiceModal: () => void,
    invoiceType: 'income' | 'expense',
    invoiceId?: number | undefined
    invoiceModalIsOpen: boolean,
}

export const InvoiceModalContext = createContext({} as ModalContext)


export function InvoiceModalProvider({ children }: Modal) {

    

    const [invoiceModalIsOpen, setInvoiceModalIsOpen] = useState(false);
    const [invoiceType, setInvoiceType] = useState<'income' | 'expense'>('income');
    const [invoiceId, setInvoice] = useState<number>();

    function openInvoiceModal( type: 'expense' | 'income', invoiceId?: number) {
        setInvoice(invoiceId)
        setInvoiceType(type);
        setInvoiceModalIsOpen(true);
    }

    function closeInvoiceModal() {
        setInvoiceModalIsOpen(false);
    }

    return (
        <InvoiceModalContext.Provider value={{ openInvoiceModal, closeInvoiceModal, invoiceModalIsOpen, invoiceType, invoiceId }}>
            {children}
        </InvoiceModalContext.Provider>
    )

}

