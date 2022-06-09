import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import api from "../../services/axios"
import Router from 'next/router'

type Form = {
    name: string,
    email: string,
    password: string
}


function Login() {

    const { handleSubmit, setValue, register, formState: { errors } } = useForm<Form>()

    async function signin(data: Form) {
        //Efetua o cadastro
        api.post("/signin", data).then(response => {
            toast.success(response.data.message)
            Router.push("/auth/login")
        }).catch(error => {
            const {errors} = error.response.data
            for(const err of errors) {
                toast.error(err.message)
            }
        })
    }

    return (
        <div className="bg-[#ececec] p-5 flex justify-center items-center w-full h-screen">

            <form onSubmit={handleSubmit(signin)} className="bg-white w-full lg:w-3/12 min-h-96 p-6 rounded-lg shadow-md">
                <h1 className="text-3xl text-center my-3 font-bold text-gray-500">Crie sua conta</h1>
                <p className="text-center text-gray-500 mb-3">E comece a usar todas as vantagens <br /> totalmente grátis</p>

                <div className="relative z-0 w-full mb-6 group">
                    <input type="text" {...register('name')} id="name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0  peer" placeholder=" " />
                    <label htmlFor="name" className="peer-focus:font-medium absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transhtmlForm -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nome</label>
                </div>

                <div className="relative z-0 w-full mb-6 group">
                    <input type="text" {...register('email')} id="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0  peer" placeholder=" " />
                    <label htmlFor="email" className="peer-focus:font-medium absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transhtmlForm -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">E-mail</label>
                </div>

                <div className="relative z-0 w-full mb-6 group">
                    <input type="password" {...register('password')} id="password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0  peer" placeholder=" " />
                    <label htmlFor="password" className="peer-focus:font-medium absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transhtmlForm -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Senha</label>
                </div>

                <div className="flex justify-center flex-col items-center">
                    <button type="submit" className="text-white bg-[#06DD83] focus:outline-none font-semibold rounded-lg text-lg w-full hover:brightness-95 px-5 py-2.5 text-center">Cadastrar</button>
                    <p className="text-sm mt-6 text-gray-400">&copy; Todos os direitos reservados</p>
                </div>
            </form>

        </div>
    )

}

export default Login