import { getCookie, removeCookies } from "cookies-next"
import Link from "next/link"
import Router from "next/router"
import { Confetti, Gear, List, SignOut } from "phosphor-react"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/AuthContext"

type UserProps = {
    id: number,
    name: string,
    cover?: string
}


type MenuProps = {
    setMenuOpen: () => void
}

function ProfileMenu({setMenuOpen}:MenuProps) {

    // const [user, setUser] = useState({} as UserProps)
    const { profile, setProfile } = useContext(AuthContext)

    useEffect(() => {
        try {
            const user = JSON.parse(getCookie("organize.user") as string)
            setProfile(user)
        } catch (error) { }
    }, [])

    function logout() {
        removeCookies("organize.user")
        removeCookies("organize.token")
        localStorage.removeItem("organize.wallet")
        Router.push("/auth/login")
    }

    return (
        <>
            <Link href="/" passHref >
                <a className="items-center hidden md:flex">
                    {profile.cover ? (
                        <img src={`${process.env.NEXT_PUBLIC_APP_URL_API}/profile/${profile.cover}`} className="block mr-3 h-9 w-9 rounded-full" alt="Flowbite Logo" />
                    ) :
                        (<img src="/images/profile.png" className="block mr-3 h-9 w-full rounded" alt="Flowbite Logo" />)}

                    <span className="self-center text-sm font-semibold whitespace-nowrap dark:text-white">Bem-vindo {profile.name}</span>
                </a>
            </Link>
            <div className="flex items-center md:order-2 h-full pt-3">

                <div className="group relative h-full hidden md:flex">

                    <Gear size={32} />

                    <div className="hidden absolute p-1 right-0 group-hover:block w-40 z-50 my-2 text-base list-none bg-white rounded divide-y divide-gray-100 shadow" id="dropdown">

                        <ul className="py-1 flex flex-col items-center">
                            <li className="flex justify-center w-full">
                                <Link href="/user" passHref>
                                    <a className="block py-2 w-full px-4 text-sm text-gray-400 hover:bg-gray-100 text-center">Editar</a>
                                </Link>
                            </li>
                            <li className="flex justify-center items-center w-full hover:bg-gray-100">
                                <Link href="">
                                    <a onClick={logout} className="block py-2 px-4 text-sm text-gray-400  text-center"> Sair</a>
                                </Link>
                            </li>

                        </ul>
                    </div>

                </div>

                <div className="flex md:hidden mx-3">
                    <div className="bg-[#0fb673] mb-3 p-1 rounded cursor-pointer">
                        <List onClick={setMenuOpen} size={32} />
                    </div>
                </div>

            </div>
        </>
    )

}

export default ProfileMenu
