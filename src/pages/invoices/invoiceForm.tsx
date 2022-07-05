import { getCookie } from "cookies-next"
import React, { useContext, useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { InvoiceModalContext } from "../../contexts/InvoiceModalContext"
import api from "../../services/axios"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import ShowErrorMessage from "../../components/Message"
import { InvoiceContext } from "../../contexts/InvoiceContext"
import { CalendarPlus } from "phosphor-react"
import ModalHeader from "../../components/Modal/ModalHeader"
import {currency} from '../../helpers/inputMaskCurrency'

interface Invoice extends SearchProps {
    id?: number,
    wallet_id: number | undefined,
    category_id: number | undefined,
    date: string,
    description: string,
    installments: number | undefined,
    invoice_type: string | undefined,
    period: string,
    type: string,
    user_id: number | undefined,
    value: string | undefined,
    quantity?: number,
}


type SearchProps = {
    start_date?: string | undefined,
    end_date?: string | undefined,
    invoices?: number | undefined
}

type Category = {
    id: number,
    title: string,
    description?: string,
}

type Wallet = {
    id: number,
    title: string,
    description?: string,
}



function InvoiceForm() {

    //CONTEXTOS
    const { closeInvoiceModal, invoiceType, invoiceId } = useContext(InvoiceModalContext)
    const { setInvoices, setIncome, setExpense, paginate, setPaginate, setNextInvoices, setNextExpenses } = useContext(InvoiceContext)

    //ESTADOS
    const [installment, setInstallment] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [wallets, setWallets] = useState<Wallet[]>([])
    const [invoice, setInvoice] = useState<Invoice>({} as Invoice)

    const [walletDefault, setWalletDefault] = useState<Wallet>()

    //VALIDAÇÕES
    const schema = yup.object({
        description: yup.string().required("Descrição é obrigatório"),
        value: yup.string().required("Valor é obrigatório"),
        date: yup.string().required("Data é obrigatório"),
        wallet_id: yup.string().required("Carteira/Conta é obrigatório"),
        category_id: yup.string().required("Categoria é obrigatório"),
        type: yup.string().nullable().required("Tipo é obrigatório"),

    })

    //REACT HOOK FORM PROPRIEDADES
    const { handleSubmit, register, reset,control, setValue, getValues, setError, formState: { errors } } = useForm<Invoice>({
        resolver: yupResolver(schema),
    })

    useEffect(() => {

        const user = JSON.parse(getCookie("organize.user") as string)

        const wallet = JSON.parse(localStorage.getItem("organize.wallet") as string)
        setWalletDefault(wallet)

        //CAMPOS DEFAULT
        setValue('user_id', user?.id)
        setValue('invoice_type', invoiceType)
        setValue('period', 'month')

        //BUSCA AS CATEGORIAS
        api.get(`/categories?user_id=${user.id}`).then((response) => {
            setCategories(response.data.categories)
        }).catch((error) => { })

        //BUSCA AS CATEIRAS/CONTAS
        api.get(`/wallets?user_id=${user.id}`).then((response) => {
            setWallets(response.data.wallets)
        }).catch((error) => { })

        //BUSCA O LANÇANETO PARA EDIÇÃO
        if (invoiceId != undefined) {

            api.get(`/invoices/${invoiceId}/edit`).then((response) => {

                const invoiceEdit = response.data

                setInvoice(response.data)

                setValue('description', invoiceEdit?.description)
                setValue('value', invoiceEdit?.value)
                setValue('quantity', invoiceEdit?.quantity)
                setValue('category_id', invoiceEdit?.category_id)
                setValue('date', invoiceEdit?.date)
                setValue('wallet_id', invoiceEdit?.wallet_id)
                setValue('type', invoiceEdit?.type)

            }).catch((error) => { })
        }

    }, [])

    //CADASTRA UM LANÇAMENTO
    async function create(data: Invoice) {

        api.post(`/invoices?page=1&wallet=${walletDefault?.id}`, data).then(response => {

            const { data, meta } = response.data.invoices

            setInvoices(data)
            setPaginate(meta)

            setNextInvoices(response.data.nextInvoices)
            setNextExpenses(response.data.nextExpenses)

            toast.success(response.data.message)
            closeModal()

        }).catch(err => {
            console.log(err)
        })
    }

    //ATUALIZA UM LANÇAMENTO
    async function update(data: Invoice) {

        const search = JSON.parse(sessionStorage.getItem("organize.search") as string)

        api.put(`/invoices/${invoice.id}?page=${paginate?.current_page}&wallet=${walletDefault?.id}&start_date=${search?.start_date}&end_date=${search?.end_date}&invoice_type=${search?.invoice_type}`, data).then(response => {

            const { data, meta } = response.data.invoices

            toast.success(response.data.message)

            setInvoices(data)
            setPaginate(meta)

            setIncome(response.data.income)
            setExpense(response.data.expense)

            closeModal()
        }).catch(err => {
            setError('quantity', { message: err.response.data.error })

        })

    }

    //CADASTRA / EDITA O LANÇAMENTO
    async function launch(data: Invoice) {

        if (invoiceId) {
            update(data)
        } else {
            create(data)
        }

    }

    //RESETA OS CAMPOS
    function resetFields() {
        reset({
            description: '',
            value: undefined,
            date: '',
            installments: undefined,
            invoice_type: '',
            type: ''
        })
    }

    //FECHA O MODAL.
    function closeModal() {
        closeInvoiceModal()
        resetFields()
    }

    
    function handleCurrencyInputValue(e: React.ChangeEvent<HTMLInputElement>) {
        const formatValue = e.target.value?.replace(".", "")
        setValue('value', formatValue?.replace(",", "."))
    }

    return (
        <>
            <ModalHeader invoice_type={invoiceType} icon={CalendarPlus} title={`${invoiceId ? 'Editar' : 'Lançar'}`} />

            <form onSubmit={handleSubmit(launch)}>

                {/* DESCRIÇÃO */}
                <div className="w-full">
                    <label htmlFor="" className="text-gray-400 font-medium"> Descrição</label>
                    <input type="text" {...register("description")} className="w-full border-gray-200 border-4  rounded p-3 focus:outline-none focus:ring-0 focus:border-[#06DD83]" />
                    <ShowErrorMessage error={errors.description?.message} />
                </div>

                {/* VALOR / DATA */}
                <div className="flex gap-4">

                    <div className={`${invoiceId ? 'w-full' : 'w-6/12'}`}>
                        <label htmlFor="" className="text-gray-400 font-medium">Valor</label>
                        <Controller
                            name="value"
                            control={control}
                            render={({ field }) => <input type="text" onChange={(e) => handleCurrencyInputValue(currency(e))} className="w-full border-gray-200 border-4  rounded p-3 focus:outline-none focus:ring-0 focus:border-[#06DD83]" />}
                        />
                        {/* <CurrencyInput decimalSeparator="," groupSeparator="." {...register("value")} className="w-full border-gray-200 border-4  rounded p-3 focus:outline-none focus:ring-0 focus:border-[#06DD83]" /> */}
                        
                        <ShowErrorMessage error={errors.value?.message} />
                    </div>
                    <div className={`w-6/12 ${invoiceId && 'hidden'}`}>
                        <label htmlFor="" className="text-gray-400 font-medium">Data</label>
                        <input type="date" {...register("date")} className="w-full border-gray-200 border-4  rounded p-3 focus:outline-none focus:ring-0 focus:border-[#06DD83]" />
                        <ShowErrorMessage error={errors.date?.message} />
                    </div>
                </div>

                {/* CARTEIRAS / CATEGORIAS */}
                <div className="flex gap-4">

                    <div className="w-6/12">
                        <label htmlFor="wallet_id" className="text-gray-400 font-medium">Conta</label>
                        <select {...register("wallet_id")} className="w-full border-gray-200 border-4  rounded p-3 focus:outline-none focus:ring-0 focus:border-[#06DD83]">
                            <option value="" disabled selected>Selecione uma conta</option>

                            {wallets.map(wallet => (
                                <option key={wallet.id} defaultValue="selected" value={wallet.id}>{wallet.title}</option>
                            ))}
                        </select>
                        <ShowErrorMessage error={errors.wallet_id?.message} />
                    </div>

                    <div className="w-6/12">
                        <label htmlFor="category_id" className="text-gray-400 font-medium">Categoria</label>
                        <select {...register("category_id")} className="w-full border-gray-200 border-4  rounded p-3 focus:outline-none focus:ring-0 focus:border-[#06DD83]">
                            <option value="" disabled selected>Selecione um categoria</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.title}</option>
                            ))}
                        </select>
                        <ShowErrorMessage error={errors.category_id?.message} />
                    </div>
                </div>

                {/* TIPO DAS PARCELAS */}
                <div className={`flex mt-10 justify-around ${invoiceId && 'hidden'}`}>

                    <div className="flex items-center mb-4">
                        <input onClick={() => setInstallment(false)} id="single" type="radio" {...register("type")} value="single" className="w-6 h-6 border-gray-300 focus:ring-2 focus:ring-[#06DD83]" />
                        <label htmlFor="single" className="block ml-2 text-sm font-medium text-gray-400 ">
                            Unica
                        </label>
                    </div>

                    <div className="flex items-center mb-4">
                        <input onClick={() => setInstallment(false)} id="country-option-2" type="radio" {...register("type")} value="fixed" className="w-6 h-6 border-gray-300 focus:ring-2 focus:ring-[#06DD83]" />
                        <label htmlFor="country-option-2" className="block ml-2 text-sm font-medium text-gray-400">
                            Fixa
                        </label>
                    </div>

                    <div className="flex items-center mb-4">
                        <input onClick={() => setInstallment(true)} id="country-option-3" type="radio" {...register("type")} value="split" className="w-6 h-6 border-gray-300 focus:ring-2 focus:ring-[#06DD83]" />
                        <label htmlFor="country-option-3" className="block ml-2 text-sm font-medium text-gray-400">
                            Parcelada
                        </label>
                    </div>


                </div>
                <div className="flex justify-center">
                    <ShowErrorMessage className="hidden" error={errors.type?.message} />
                </div>

                {/* PARCELAS */}
                <div className={`${installment ? 'w-full block' : 'hidden'}`}>
                    <label htmlFor="" className="text-gray-400 font-medium">Parcelas</label>
                    <select {...register("installments")} className="w-full border-gray-200 border-4  rounded p-3 focus:outline-none focus:ring-0 focus:border-[#06DD83]">
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={7}>7</option>
                        <option value={8}>8</option>
                        <option value={9}>9</option>
                        <option value={10}>10</option>
                        <option value={11}>11</option>
                        <option value={12}>12</option>
                    </select>
                </div>

                {/* Condição se atualiza todas ou apenas uma quando for FIXA ou PACELADA */}
                <div className={`${invoiceId && invoice.type === 'split' || invoice.type === 'fixed' ? 'flex flex-col mt-10 justify-around' : 'hidden'}`}>

                    <div className="flex p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg " role="alert">
                        <svg className="inline flex-shrink-0 mr-3 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                        <div>
                            <span className="font-medium">Atenção!</span> Este lançamento se repete, selecione se quer atualizar esse ou todos.
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

                <div className="flex gap-3 mt-5">
                    <button type="submit" className="w-full focus:outline-none text-white bg-[#06DD83] hover:bg-[#14ca7e] focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-2xl px-5 py-2.5 mb-2 ">{invoiceId ? 'Atualizar' : 'Cadastra'}</button>
                </div>

            </form>
        </>
    )

}

export default InvoiceForm