import { getCookie, setCookies } from "cookies-next"
import { useContext, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
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

    //Mostra o preview da imagem que será enviada
    const [showImage, setShowImage] = useState("")

    //Recebe a imagem para ser enviada do formulario
    const [Image, setImage] = useState()

    //Recebe a imagem do usuario logado caso exista
    const [cover, setCover] = useState<string | undefined>()

    const { handleSubmit, register, setValue, control, formState: { errors } } = useForm<User>()

    useEffect(() => {
        try {

            const user = JSON.parse(getCookie("organize.user") as string)
            setProfile(user)

            setValue('id', user.id)
            setValue('name', user.name)
            setValue('email', user.email)

            setCover(user.cover)
        } catch (error) {

        }
    }, [])

    async function updateProfile(data: User) {


        const dataForm = new FormData();

        dataForm.append('id', String(data.id));
        dataForm.append('cover', Image);
        dataForm.append('name', data.name);
        dataForm.append('email', data.email);
        dataForm.append('password', data.password as string);

        const response = await api.post(`/profile`, dataForm)
        setCookies('organize.user', response.data.profile)

        setProfile(response.data.profile)

        toast.success(response.data.message)
    }

    function handleInputCover(event: any) {

        setImage(event.target.files[0])
        if (event.target.files[0]) {
            setShowImage(URL.createObjectURL(event.target.files[0]))
        }
    }
    return (
        <Layout>

            <div className="container mx-auto shadow-md h-full md:w-5/12 rounded-lg bg-white p-5">
                <form onSubmit={handleSubmit(updateProfile)}>
                    <div className="flex flex-col items-center mb-5">                        
                         <div className="flex flex-col w-5/12 ">
                            <div className="flex flex-col  items-center justify-center">

                                {cover && !showImage ? (<img src={`${process.env.NEXT_PUBLIC_APP_URL_API}/profile/${cover}`} className="w-[90px] h-[90px] rounded-full" alt="" />) : (<></>)}

                                {showImage ? (<img src={showImage} alt="" className="w-[90px] h-[90px] rounded-full" />)
                                    : (!cover ? <img src="/images/profile.png" alt="" className="w-[90px] h-[90px] rounded-full" /> : (<></>))}
                                <label htmlFor="cover" className="mt-5 text-[#613387] font-semibold">Alterar foto</label>

                            </div>
                            <Controller
                                control={control}
                                name="cover"
                                render={({ field }) => (
                                    <input type="file" {...field} onChange={handleInputCover} id="cover" className="border rounded h-12 px-3 focus:outline-none hidden" />
                                )}
                            />
                            <ShowErrorMessage error={errors.cover?.message} />
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