import { getCookie } from 'cookies-next'
import { ThumbsUp, ThumbsDown, PencilLine, PencilSimple, Trash, MagnifyingGlass, TrashSimple, CalendarPlus } from 'phosphor-react'
import { useContext, useEffect, useState } from 'react'
import { InvoiceContext } from '../../contexts/InvoiceContext'
import { InvoiceModalContext } from '../../contexts/InvoiceModalContext'
import api from '../../services/axios'
import InvoiceModalDelete from '../../components/Modal'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import ShowErrorMessage from '../../components/Message'
import { toast } from 'react-toastify'
import Filter from '../../components/Filter'
import ModalHeader from '../../components/Modal/ModalHeader'
import Layout from '../layout'
import { Pagination } from '../../components/Pagination'

type FormProps = {
    quantity?: string,
    invoice?: number | undefined,
}

type InvoiceProps = {
    id: number,
    installment_of?: string | null,
    invoice_type: string
}

type Wallet = {
    id: number,
    title: string,
    description?: string,
}



function Invoices() {

    const { openInvoiceModal } = useContext(InvoiceModalContext)


    const { invoices, setInvoices, income, setIncome, expense, setExpense, paginate, setPaginate } = useContext(InvoiceContext)


    const [invoiceModalDeleteOpen, setInvoiceModalDelete] = useState(false)
    const [invoice, setInvoice] = useState<InvoiceProps>()

    const [walletDefault, setWalletDefault] = useState<Wallet>()

    const schema = yup.object({
        quantity: yup.string().nullable().required("Selecione uma opção"),
    })

    const { handleSubmit, register, setValue, reset, formState: { errors } } = useForm<FormProps>({
        resolver: yupResolver(schema)
    })

    useEffect(() => {

        getInvoicesList()

        sessionStorage.removeItem("organize.search")

    }, [])

    async function getInvoicesList() {

        try {

            const user = JSON.parse(getCookie("organize.user") as string)
            const wallet = JSON.parse(localStorage.getItem("organize.wallet") as string)

            setWalletDefault(wallet)

            const response = await api.get(`/invoices?page=1&user=${user.id}&wallet=${wallet.id}`)

            const { data, meta } = response.data.invoices

            setInvoices(data)
            setPaginate(meta)

            setIncome(response.data.income)
            setExpense(response.data.expense)

        } catch (err) { }

    }

    function handleOpenModalDelete(invoice: InvoiceProps) {
        setValue('invoice', invoice.id)
        setInvoice(invoice)
        setInvoiceModalDelete(true)
    }

    function handleCloseModalDelete() {
        reset({
            quantity: '',
            invoice: undefined
        })
        setInvoiceModalDelete(false)
    }

    async function link(link: number) {
        const user = JSON.parse(getCookie("organize.user") as string)
        const wallet = JSON.parse(localStorage.getItem("organize.wallet") as string)
        const search = JSON.parse(sessionStorage.getItem("organize.search") as string)

        const response = await api.get(`/invoices?page=${link}&user=${user.id}&wallet=${wallet.id}&start_date=${search?.start_date}&end_date=${search?.end_date}&invoice_type=${search?.invoice_type}`)
        const { data, meta } = response.data.invoices

        setInvoices(data)
        setPaginate(meta)
    }


    async function deleteInvoice(data: FormProps) {

        // console.log(data)

        // return
        const search = JSON.parse(sessionStorage.getItem("organize.search") as string)

        api.delete(`/invoices/${data.invoice}?page=${paginate?.current_page}&quantity=${data.quantity}&wallet=${walletDefault?.id}&start_date=${search?.start_date}&end_date=${search?.end_date}&invoice_type=${search?.invoice_type}`).then((response) => {
            toast.success(response.data.message)

            const { data, meta } = response.data.invoices

            setInvoices(data)
            setPaginate(meta)

            setIncome(response.data.income)
            setExpense(response.data.expense)
            handleCloseModalDelete()
        }).catch((error) => { })
    }

    async function invoiceStatus(id: number) {

        const search = JSON.parse(sessionStorage.getItem("organize.search") as string)
        const user = JSON.parse(getCookie("organize.user") as string)

        api.post(`/invoices/status/${id}?page=${paginate?.current_page}&user=${user.id}&wallet=${walletDefault?.id}`, search).then((response) => {

            const { data, meta } = response.data.invoices

            setInvoices(data)
            setPaginate(meta)

            setIncome(response.data.income)
            setExpense(response.data.expense)
        }).catch((error) => { })
    }

    return (

        <Layout>
            <InvoiceModalDelete modalIsOpen={invoiceModalDeleteOpen} handleCloseModal={handleCloseModalDelete}>

                {invoice?.installment_of ? (

                    <form onSubmit={handleSubmit(deleteInvoice)}>

                        <div className="flex flex-col mt-10 justify-around">

                            <ModalHeader invoice_type={invoice?.invoice_type} icon={PencilLine} title="Excluir" />

                            <div className="flex p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                                <svg className="inline flex-shrink-0 mr-3 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                                <div>
                                    <span className="font-medium">Atenção!</span> Este lançamento se repete, selecione se quer deletar esse ou todos.
                                </div>
                            </div>
                            <div className="flex justify-around mt-4">

                                <div className="flex items-center mb-4">
                                    <input id="quantity_1" type="radio" {...register("quantity")} value="current" className="w-6 h-6 border-gray-300 focus:ring-2 focus:ring-blue-300 " />
                                    <label htmlFor="quantity_1" className="block ml-2 text-sm font-medium text-gray-400 ">
                                        Apenas essa
                                    </label>
                                </div>

                                <div className="flex items-center mb-4">
                                    <input id="quantity_2" type="radio" {...register("quantity")} value="all" className="w-6 h-6 border-gray-300 focus:ring-0 focus:ring-blue-300" />
                                    <label htmlFor="quantity_2" className="block ml-2 text-sm font-medium text-gray-400">
                                        Todas
                                    </label>
                                </div>
                                <ShowErrorMessage error={errors.quantity?.message} />
                            </div>
                        </div>
                        <button type="submit" className="w-full focus:outline-none text-white bg-[#e95858] hover:bg-[#e95858] focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-2xl px-5 py-2.5 mb-2 ">Excluir</button>
                    </form>) : (
                    <>
                        <ModalHeader invoice_type={invoice?.invoice_type} icon={Trash} title="Excluir" />

                        <div className="flex p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg" role="alert">
                            <svg className="inline flex-shrink-0 mr-3 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                            <div>
                                <span className="font-medium">Atenção!</span> Este lançaneto será excluido permanentamente, tem certeza que deseja excluir ?.
                            </div>
                        </div>
                        <button type="button" onClick={() => deleteInvoice({ invoice: invoice?.id })} className="w-full focus:outline-none text-white bg-[#e95858] hover:bg-[#e95858] focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-2xl px-5 py-2.5 mb-2 "> Excluir</button>


                    </>
                )}

            </InvoiceModalDelete>

            <Filter />



            {invoices?.length > 0 ? (
                <div className="container mx-auto bg-white md:w-8/12 shadow rounded-xl overflow-x-auto">
                    <>
                        <table className={`w-full text-sm text-left text-gray-500`}>
                            <thead className="text-xs text-gray-700 uppercase  ">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Descrição
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Valor
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Conta
                                    </th>

                                    <th scope="col" className="px-6 py-3">
                                        Tipo
                                    </th>

                                    <th scope="col" className="px-6 py-3">
                                        Parcelas
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody>

                                {invoices?.map(invoice => (

                                    <tr key={invoice.id} className="border-b">
                                        <th scope="row" className="px-6 py-4 font-medium   whitespace-nowrap">
                                            {invoice.description}
                                        </th>
                                        <td className="px-6 py-4">
                                            {invoice.value}
                                        </td>
                                        <td className="px-6 py-4">
                                            {invoice.wallet.title}
                                        </td>
                                        <td className="px-6 py-4">
                                            {invoice.invoice_type === 'expense' ? 'saida' : 'entrada'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {invoice.type === 'single' ? 'Unica' : (invoice.type === 'fixed' ? 'Fixa' : `Parcela ${invoice.installment} de ${invoice.installments}`)}
                                        </td>
                                        <td className="px-6 py-4" onClick={() => invoiceStatus(invoice.id)}>
                                            {invoice.status ? <ThumbsUp size={32} color="#06DD83" className="cursor-pointer" /> : <ThumbsDown size={32} className="cursor-pointer" color="#ff4d4d" />}
                                        </td>
                                        <td className="px-6 py-4 flex justify-around">
                                            <PencilSimple size={32} color="#fff" className="cursor-pointer bg-[#3f83f8] rounded-full w-10 h-10 p-2" onClick={() => openInvoiceModal(invoice.invoice_type, invoice.id)} />
                                            <Trash size={32} color="#fff" className="cursor-pointer bg-[#ff5454] rounded-full w-10 h-10 p-2" onClick={() => handleOpenModalDelete(invoice)} />
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                        <div className="flex justify-between">

                            <div className="pagination m-3">
                                <Pagination
                                    total={paginate?.total}
                                    current_page={paginate?.current_page}
                                    per_page={paginate?.per_page}
                                    first_page={paginate?.first_page}
                                    last_page={paginate?.last_page}
                                    onPageLink={link}
                                />
                            </div>

                            {invoices?.length > 0 ? (
                                <div className="flex justify-end p-3">

                                    <ul>

                                        <li><span className="text-gray-600 font-bold">Balanço geral:</span> {(income - expense) <= 0 ? <span className="text-[#ff5454] font-bold text-lg">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(income - expense)}</span> : <span className="text-[#06DD83] font-bold text-lg">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(income - expense)}</span>}</li>

                                    </ul>
                                </div>) : (<></>)}
                        </div>
                    </>
                </div>
            ) : (
                <div className="p-4 container mx-auto md:w-8/12 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800" role="alert">
                    <span className="font-medium">Informação!</span> Ainda não existe lançamentos para o mês atual.
                </div>
            )}

        </Layout>

    )

}

export default Invoices