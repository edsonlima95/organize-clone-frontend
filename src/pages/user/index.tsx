import { getCookie, setCookies } from "cookies-next"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import ShowErrorMessage from "../../components/Message"
import ModalHeader from "../../components/Modal/ModalHeader"
import { AuthContext } from "../../contexts/AuthContext"
import api from "../../services/axios"
import Layout from "../layout"


type User = {
    id: number,
    name: string,
    email: string,
    cover?: string
    password?: string,
}


function Profile() {

    const {profile, setProfile} = useContext(AuthContext)

    const { handleSubmit, register, setValue, reset, formState: { errors } } = useForm<User>()

    useEffect(() => {
        try {

            const user = JSON.parse(getCookie("organize.user") as string)
            setProfile(user)

            setValue('id', user.id)
            setValue('name', user.name)
            setValue('email', user.email)
        } catch (error) {

        }
    }, [])

    async function updateProfile(data: User) {


        const dataForm = new FormData();

        dataForm.append('id', String(data.id));
        dataForm.append('cover', data.cover[0]);
        dataForm.append('name', data.name);
        dataForm.append('email', data.email);
        dataForm.append('password', data.password as string);

        const response = await api.post(`/profile`, dataForm)
        setCookies('organize.user', response.data.profile)

        setProfile(response.data.profile)

        toast.success(response.data.message)
    }

    return (
        <Layout>

            <div className="container mx-auto shadow-md h-full md:w-5/12 rounded-lg bg-white p-5">
                <form onSubmit={handleSubmit(updateProfile)}>
                    <div className="flex flex-col items-center mb-5">
                        <label htmlFor="cover">
                            {profile?.cover ? (
                                <img src={`${process.env.NEXT_PUBLIC_APP_URL_API}/profile/${profile.cover}`} className="block mr-3 h-20 sm:w-20 rounded-full" alt="Flowbite Logo" />
                            ) : 
                            (<img src="images/profile.png" className=" block mr-3 h-9 h-24 rounded" alt="Flowbite Logo" />)}
                            <input type="file" className="hidden" {...register('cover')} id="cover" />
                        </label>
                        <div className="mt-4">
                            <small className="text-gray-400  font-semibold">Editar foto</small>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">

                        {/* nome */}
                        <div className="md:w-6/12">
                            <label htmlFor="" className="text-gray-400 font-medium"> Nome</label>
                            <input type="text" {...register("name")} className="w-full border-gray-200 border-4  rounded p-3 focus:outline-none focus:ring-0 focus:border-[#06DD83]" />
                            <ShowErrorMessage error={errors.name?.message} />
                        </div>

                        {/* email */}
                        <div className="md:w-6/12">
                            <label htmlFor="" className="text-gray-400 font-medium"> E-mail</label>
                            <input type="email" disabled {...register("email")} className="w-full border-gray-200 border-4  rounded p-3 focus:outline-none focus:ring-0 focus:border-[#06DD83]" />
                            <ShowErrorMessage error={errors.email?.message} />
                        </div>
                    </div>

                    <div className="w-full mt-2">
                        <label htmlFor="" className="text-gray-400 font-medium"> Senha</label>
                        <input type="password" {...register("password")} className="w-full border-gray-200 border-4  rounded p-3 focus:outline-none focus:ring-0 focus:border-[#06DD83]" />
                    </div>

                    <div className="flex gap-3 mt-5 justify-center">
                        <button type="submit" className="w-full md:w-6/12 focus:outline-none text-white bg-[#06DD83] hover:bg-[#14ca7e] focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-2xl px-5 py-2.5 mb-2 ">{'Atualizar'}</button>
                    </div>
                </form>
            </div>
        </Layout>
    )

}

export default Profile