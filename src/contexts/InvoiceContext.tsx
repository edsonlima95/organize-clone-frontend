import React, { useState } from "react";
import { createContext } from "react";

type Category = {
    id: number,
    title: string,
    user_id: number,
    description: string,
}

type Wallet = {
    id: number,
    title: string,
    user_id: number,
    description: string,
}

type Invoice = {
    id: number,
    description: string,
    value: number,
    date: string,
    type: string,
    invoice_type: 'expense' | 'income',
    status: boolean,
    category: Category,
    wallet: Wallet,
    installment: number,
    installments: number,
}


type InvoiceContextProps = {
    invoices: Invoice[],
    income: number,
    expense: number,
    paginate: Meta,
    nextInvoices: NextInvoices[],
    nextExpenses: NextInvoices[]

    setInvoices: (data: Invoice[]) => void,
    setIncome: (income: number) => void,
    setExpense: (income: number) => void,
    setPaginate: (meta: Meta) => void,
    setNextInvoices: (nextInvoice: NextInvoices[]) => void,
    setNextExpenses: (nextInvoice: NextInvoices[]) => void,
}

type InvoiceProviderProps = {
    children: React.ReactNode
}

type Meta = {
    total: number,
    per_page: number,
    current_page: number,
    next_page_url: string,
    previous_page_url: string,
    first_page: number,
    last_page: number,
}


type NextInvoices = {
    id: number,
    description: string,
    value: number,
    date: string
}

export const InvoiceContext = createContext({} as InvoiceContextProps)


export function InvoiceProvider({ children }: InvoiceProviderProps) {

    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [income, setIncome] = useState<number>(0)
    const [expense, setExpense] = useState<number>(0)
    const [paginate, setPaginate] = useState<Meta>({} as Meta)
    const [nextInvoices, setNextInvoices] = useState<NextInvoices[]>([])
    const [nextExpenses, setNextExpenses] = useState<NextInvoices[]>([])

    return (
        <InvoiceContext.Provider value={{
            invoices,
            setInvoices,
            income,
            setIncome,
            expense,
            setExpense,
            paginate,
            setPaginate,
            nextInvoices,
            setNextInvoices,
            nextExpenses,
            setNextExpenses
        }}>
            {children}
        </InvoiceContext.Provider>
    )

}

