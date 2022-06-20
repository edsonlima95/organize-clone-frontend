import { getCookie, setCookies } from "cookies-next"
import Link from "next/link"
import api from "../../services/axios"
import Router from 'next/router'
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { useEffect } from "react"
import Dashboard from ".."
import { GetServerSideProps } from "next"


type Credentials = {
    email: string,
    password: string
}

function Login() {

    const { handleSubmit, register, formState: { errors } } = useForm<Credentials>()

    async function login(data: Credentials) {

        await api.post("/login", data).then(response => {

            const { token, user, wallet } = response.data

            //Salva os tokens no cookie pq no next o localStorage nao e acessivel pelo getServerSideProps
            setCookies('organize.token', token, {
                maxAge: 60 * 60 * 24 * 30, // 30 dias
                path: '/'
            })

            setCookies('organize.user', user, {
                maxAge: 60 * 60 * 24 * 30, // 30 dias
                path: '/'
            })
           
            localStorage.setItem("organize.wallet", JSON.stringify(wallet))

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            Router.push("/")
        }).catch(error => {
            const { errors } = error.response.data
            for (const err of errors) {
                toast.error(err.message)
            }
        })


    }

    return (
        <>
            <div className="bg-[#ececec] p-5 flex justify-center items-center w-full h-screen flex-col">

                <form onSubmit={handleSubmit(login)} className="bg-white w-full lg:w-3/12 min-h-96 p-6 rounded-lg shadow-md" autoComplete="off">
                    <h1 className="text-3xl text-center my-3 font-bold text-gray-500">Entre na conta</h1>
                    <p className="text-center text-gray-500 mb-3">Entre com seu e-mail e senha <br /> e comece a controlar</p>

                    <div className="relative z-0 w-full mb-6 group">
                        <input type="email" {...register("email")} id="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0  peer" placeholder=" " />
                        <label htmlFor="email" className="peer-focus:font-medium absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transhtmlForm -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">E-mail</label>
                    </div>

                    <div className="relative z-0 w-full mb-6 group">
                        <input type="password" {...register("password")} id="password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0  peer" placeholder=" " />
                        <label htmlFor="password" className="peer-focus:font-medium absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transhtmlForm -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Senha</label>
                    </div>

                    <div className="flex justify-between">
                        <Link href="/auth/signin" passHref>
                            <a className="underline underline-offset-1 text-base mb-6 text-gray-600 ">Cadastrar</a>
                        </Link>

                        <Link href="/auth/login" passHref>
                            <a href="#" className="underline underline-offset-1 text-base mb-6 text-gray-600 ">Esqueci a senha</a>
                        </Link>
                    </div>
                    <div className="flex justify-center flex-col items-center">
                        <button type="submit" className="text-white bg-[#06DD83] focus:outline-none font-semibold rounded-lg text-lg w-full hover:brightness-95 px-5 py-2.5 text-center">Entrar</button>
                        <p className="text-sm mt-6 text-gray-400">&copy; Todos os direitos reservados</p>
                    </div>
                </form>
            </div>
        </>
    )

}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

    
    const token = getCookie('organize.token',ctx);
    const user = getCookie('organize.user',ctx);
    
    if(token && user){
        
     
        return {
            props:{},
            redirect: {
                destination: '/',
            }
        }
    }


    return {
        props:{}
    }

}


export default Login