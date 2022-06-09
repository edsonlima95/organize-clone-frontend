import { getCookie } from "cookies-next"
import { Cardholder, CheckCircle, PencilCircle, PencilLine, PencilSimple, PlusCircle, Trash } from "phosphor-react"
import { useEffect, useState } from "react"
import api from "../../services/axios"
import WalletModal from '../../components/Modal'
import ShowErrorMessage from "../../components/Message"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form"
import ModalHeader from "../../components/Modal/ModalHeader"
import { toast } from "react-toastify"
import Layout from "../layout"

type Wallet = {
    id: number,
    title: string,
    description: string,
    user_id: number
}

type User = {
    id: number,
    name: string,
    email: string,
    cover?: string
}

function Wallet() {

    const [wallets, setWallets] = useState<Wallet[]>([])
    const [walletSelected, setWalletSelected] = useState<Wallet>()
    const [walletModalOpen, setWalletModalOpen] = useState(false)
    

    const schema = yup.object({
        title: yup.string().required("Descrição é obrigatório"),
    })

    const { handleSubmit, register, reset, setValue,getValues, setError, formState: { errors } } = useForm<Wallet>({
        resolver: yupResolver(schema),
    })

    try {

        const user = JSON.parse(getCookie("organize.user") as string)

        setValue('user_id', user.id)
    } catch (error) {

    }

    useEffect(() => {

        getWalletList()

    },[])

    async function getWalletList() {

        try {
        
            const wallet = JSON.parse(localStorage.getItem("organize.wallet") as string)
            setWalletSelected(wallet)

            //BUSCA AS CATEIRAS/CONTAS
            const response = await api.get(`/wallets?user_id=${getValues('user_id')}`)
            setWallets(response.data.wallets)
        
        } catch (error) {

        }
    }

    function resetFields() {
        reset({
            title: "",
            description: "",
        })
    }

    function openModal(wallet: Wallet) {

        if (wallet?.id) {

            setValue('id', wallet?.id)
            setValue('title', wallet?.title)
            setValue('description', wallet?.description)
            setValue('user_id', wallet?.user_id)

        }

        setWalletModalOpen(true)
    }

    function closeModal() {
        setWalletModalOpen(false)
        resetFields()
    }

    async function submitWallet(data: Wallet) {

        const user = JSON.parse(getCookie("organize.user") as string)
        setValue('user_id', user.id)

        if (data.id) {
            update(data)
        } else {
            create(data)
        }

    }

    async function create(data: Wallet) {
       
        api.post("/wallets", data).then((response) => {

            toast.success(response.data.message)
            setWallets(response.data.wallets)
            closeModal()

        }).catch((error) => { })
    }

    async function update(data: Wallet) {
       
        api.put(`/wallets/${data.id}`, data).then((response) => {

            toast.success(response.data.message)
            setWallets(response.data.wallets)
            closeModal()

        }).catch((error) => { })
    }

    function selectWallet(wallet: Wallet) {
        localStorage.setItem('organize.wallet', JSON.stringify(wallet))
        setWalletSelected(wallet)
    }

    return (

        <Layout>
            <WalletModal modalIsOpen={walletModalOpen} handleCloseModal={closeModal}>
                <form onSubmit={handleSubmit(submitWallet)}>
                    <ModalHeader icon={Cardholder} title="Cadastra carteira" />

                    {/* TITULO */}
                    <div className="w-full">
                        <label htmlFor="" className="text-gray-400 font-medium"> Titulo</label>
                        <input type="text" {...register("title")} className="w-full border-gray-200 border-4  rounded p-3 focus:outline-none focus:ring-0 focus:border-[#06DD83]" />
                        <ShowErrorMessage error={errors.title?.message} />
                    </div>

                    {/* DESCRIÇÃO */}
                    <div className="w-full">
                        <label htmlFor="" className="text-gray-400 font-medium"> Descrição</label>
                        <input type="text" {...register("description")} className="w-full border-gray-200 border-4  rounded p-3 focus:outline-none focus:ring-0 focus:border-[#06DD83]" />

                    </div>

                    <div className="flex gap-3 mt-5">
                        <button type="submit" className="w-full focus:outline-none text-white bg-[#06DD83] hover:bg-[#14ca7e] focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-2xl px-5 py-2.5 mb-2 ">{getValues('id') ? 'Atualizar' : 'Cadastra'}</button>
                    </div>
                </form>
            </WalletModal>
            <div className="container m-auto">
                <div className="flex justify-center mb-5">
                    <a onClick={() => openModal({} as Wallet)} className={`flex flex-col cursor-pointer w-full justify-center items-center p-6 max-w-sm rounded-lg border border-gray-200  bg-gradient-to-rfrom-emerald-300 to-emerald-500`}>
                        <PlusCircle size={50} className="w-full text-gray-300 font-semibold" />
                        <p className="text-gray-400">Cadastrar nova carteira</p>
                    </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {wallets.map(wallet => (

                        <a key={wallet.id} className={`flex relative flex-col group text-center p-6 max-w-sm bg-white rounded-lg border border-gray-200  bg-gradient-to-r ${walletSelected?.id === wallet.id ? 'from-emerald-300 to-emerald-500' : 'from-cyan-400 to-blue-500'}`}>

                            <Cardholder size={50} className="w-full text-white font-semibold" />
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">{wallet.title}</h5>
                            <p className="text-white">{wallet.description}</p>

                            <div className="hidden group-hover:block">
                                <CheckCircle onClick={() => selectWallet(wallet)} size={40} color="white" className={`absolute top-1 left-1 cursor-pointer`} />
                                <PencilSimple size={40} color="white" onClick={() => openModal(wallet)} className={`absolute top-12 left-1 cursor-pointer`} />
                            </div>

                        </a>
                    ))}

                </div>

            </div>
        </Layout>

    )

}

export default Wallet