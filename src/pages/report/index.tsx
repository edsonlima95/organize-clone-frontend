import Layout from "../layout";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getCookie } from "cookies-next";
import { MagnifyingGlass } from "phosphor-react";
import api from "../../services/axios";
import dayjs from 'dayjs'

type Invoice = {
    id: number,
    description: string,
    data: string,
    invoice_type: string,
    value: number
}

type ReportProps = {
    invoices: Invoice[]
}

type ReportFormProps = {
    start_date: string,
    end_date: string,
    invoice_type: string,
    user_id: number,
    wallet_id: number
}

function Report() {

    const [invoices, setInvoices] = useState({} as ReportProps)
    const [income, setIncome] = useState(0)
    const [expense, setExpense] = useState(0)
    const [total, setTotal] = useState(0)

    const { handleSubmit, register, reset, setValue, formState: { errors } } = useForm<ReportFormProps>()

    try {

        const user = JSON.parse(getCookie("organize.user") as string)
        const wallet = JSON.parse(localStorage.getItem("organize.wallet") as string)

        setValue('user_id', user.id)
        setValue('wallet_id', wallet.id)
    } catch (error) { }

    async function report(data: ReportFormProps) {
        try {

            const response = await api.post("/invoices/report", data)

            setInvoices(response.data.invoices)
            setIncome(response.data.income)
            setExpense(response.data.expense)
            setTotal(response.data.total)

        } catch (error) {

        }
    }

    return (
        <>
            <Layout>
                <div className="container mx-auto w-7/12 ">
                    <span className="block mb-10">
                        <h1 className="font-bold text-gray-500 text-4xl mb-4 flex">Relatório</h1>
                        <span className="block w-full border"></span>
                    </span>
                </div>
                <div className="container mx-auto bg-white w-8/12 shadow rounded-xl mb-5 py-4 px-3">
                    <form onSubmit={handleSubmit(report)} className="grid grid-cols-4">

                        <div className="flex flex-col">
                            <label htmlFor="start_date" className="text-gray-400 font-medium">Data inicial</label>
                            <input type="date" className="border-gray-300 rounded mr-5 border-4 focus:outline-none focus:ring-0 focus:border-[#06DD83]" {...register("start_date")} />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="end_date" className="text-gray-400 font-medium">Data final</label>
                            <input type="date" className="border-gray-300 rounded mr-5 border-4 focus:outline-none focus:ring-0 focus:border-[#06DD83]"  {...register("end_date")} />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="type" className="text-gray-400 font-medium">Tipo</label>
                            <select {...register("invoice_type")} className="w-full border-gray-300 border-4  rounded p-2 focus:outline-none focus:ring-0 focus:border-[#06DD83]">
                                <option value="all">Todas</option>
                                <option value="income">Entrada</option>
                                <option value="expense">Saida</option>
                            </select>

                        </div>
                        <div className="flex flex-col justify-end mb-1 w-16 ml-2">
                            <button type="submit" className="bg-[#06DD83] p-1 rounded-md flex justify-center"><MagnifyingGlass size={35} color="#fff" /></button>

                        </div>

                    </form>
                </div>
                <div className="container mx-auto shadow-md h-full w-8/12 rounded-lg bg-white p-5">
                    {invoices.length > 0 ? (
                        <>
                    <table className={`w-full text-sm text-left text-gray-500`}>
                        <thead className="text-xs text-gray-700 uppercase text-center ">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Descrição
                                </th>
                               
                                <th scope="col" className="px-6 py-3">
                                    Data
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    Entradas
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    Saidas
                                </th>

                            </tr>
                        </thead>
                        <tbody className="text-center">

                            {invoices?.map(invoice => <tr key={invoice.id} className="border-b">
                                <td className="px-6 py-4">{invoice.description}</td>
                                <td className="px-6 py-4">{dayjs(invoice.date).format("DD/MM/YYYY")}</td>
                                <td className="px-6 py-4 text-[#06DD83]">{invoice.invoice_type == 'income' ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice.value) : '-'}</td>
                                <td className="px-6 py-4 text-[#ff5454]">{invoice.invoice_type == 'expense' ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice.value) : '-'}</td>
                            </tr>)}

                        </tbody>
                       
                    </table>
                     <div className="flex justify-end pt-4"><span className="text-lg text-gray-700 font-semibold">Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span></div>
                     </>
                    ) : (<div>Não foram encontrado nenhum resultado</div>)}

                </div>
            </Layout>
        </>
    )

}

export default Report