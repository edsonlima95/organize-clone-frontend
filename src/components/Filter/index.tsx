import { getCookie } from "cookies-next";
import { MagnifyingGlass } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../services/axios";
import ShowErrorMessage from "../Message";
import { InvoiceContext } from "../../contexts/InvoiceContext";

type FormProps = {
    start_date?: string,
    end_date?: string
    user_id: number
    wallet?: number
    category_id?: number
    invoice_type?: string
    page?: number
}


function Filter() {

    const { setInvoices, paginate, setPaginate } = useContext(InvoiceContext)

    const { handleSubmit, register, setValue, formState: { errors } } = useForm<FormProps>()

    useEffect(() => {
        try {

            const user = JSON.parse(getCookie("organize.user") as string)
            const wallet = JSON.parse(localStorage.getItem("organize.wallet") as string)

            setValue('user_id', user.id)
            setValue('wallet', wallet.id)

        } catch (error) {}
        
    }, [])


    async function search(data: FormProps) {

        sessionStorage.setItem("organize.search", JSON.stringify(data))

        api.post(`/invoices/filter?page=${paginate?.current_page}`, data).then((response) => {

            const { data, meta } = response.data.invoices

            setInvoices(data)
            setPaginate(meta)

        }).catch((error) => { })
    }

    return (
        <div className="container mx-auto bg-white md:w-8/12 shadow rounded-xl mb-5 py-4 px-3">
            <form onSubmit={handleSubmit(search)} className="grid grid-cols-1 md:grid-cols-4 gap-3">

                <div className="flex flex-col">
                    <ShowErrorMessage error={errors.start_date?.message} />
                    <label htmlFor="start_date" className="text-gray-400 font-medium">Data inicial</label>
                    <input type="date" className="w-full border-gray-300 rounded mr-5 border-4 focus:outline-none focus:ring-0 focus:border-[#06DD83]" {...register("start_date")} />
                </div>

                <div className="flex flex-col">
                    <ShowErrorMessage error={errors.end_date?.message} />
                    <label htmlFor="end_date" className="text-gray-400 font-medium">Data final</label>
                    <input type="date" className="w-full border-gray-300 rounded mr-5 border-4 focus:outline-none focus:ring-0 focus:border-[#06DD83]"  {...register("end_date")} />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="type" className="text-gray-400 font-medium">Tipo</label>
                    <select {...register("invoice_type")} className="w-full border-gray-300 border-4  rounded p-2 focus:outline-none focus:ring-0 focus:border-[#06DD83]">
                        <option value="all">Todas</option>
                        <option value="income">Entrada</option>
                        <option value="expense">Saida</option>
                    </select>

                </div>
                <div className="flex flex-col justify-end mb-1 md:w-16 md:ml-2">
                    <button type="submit" className="bg-[#06DD83] p-1 rounded-md flex justify-center"><MagnifyingGlass size={35} color="#fff" /></button>

                </div>

            </form>
        </div>
    )

}

export default Filter;