import { removeCookies } from "cookies-next"
import Link from "next/link"
import  Router  from "next/router"
import { ArrowSquareIn, Browsers, House, Laptop, List, ListPlus, PhoneCall, SignOut, User, Wallet, X } from "phosphor-react"

type Aside = {
    isMenuOpen: boolean,
    onMenuToggle: (param: boolean) => void
}

export function MenuLeft({ isMenuOpen, onMenuToggle }: Aside) {

    function logout() {
        removeCookies("organize.user")
        removeCookies("organize.token")
        localStorage.removeItem("organize.wallet")
        Router.push("/auth/login")
    }
    
    return (
        <aside className={`fixed z-30 w-64 top-0 h-full ${isMenuOpen ? 'left-0 duration-1000' : '-left-80 duration-1000'}`} aria-label="Sidebar">
            <div className="overflow-y-auto  py-4 px-3 h-full bg-[#0fb673]">
                <ul className="space-y-2">
                    <li className="flex justify-end">
                        <X size={40} color="white" onClick={() => onMenuToggle(!isMenuOpen)}/>
                    </li>
                    <li>
                    <Link href="/" passHref>
                        <a onClick={() => onMenuToggle(!isMenuOpen)} className="flex items-center p-2 text-xl font-normal rounded-lg text-gray-200 hover:bg-[#11cf83]">
                            <span className="ml-3 flex items-center gap-2"><House size={20} /> Home</span>
                        </a>
                    </Link>
                    </li>
                    <li>
                        <Link href="/invoices" passHref>
                        <a onClick={() => onMenuToggle(!isMenuOpen)} className="flex items-center p-2 text-xl font-normal rounded-lg text-gray-200 hover:bg-[#11cf83]">
                            <span className="ml-3 flex items-center gap-2"><ArrowSquareIn size={20} />Lançamentos</span>
                        </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/wallet" passHref>
                        <a onClick={() => onMenuToggle(!isMenuOpen)} className="flex items-center p-2 text-xl font-normal rounded-lg text-gray-200 hover:bg-[#11cf83]">
                            <span className="ml-3 flex items-center gap-2"><Wallet size={20} />Carteiras</span>
                        </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/category" passHref>
                        <a onClick={() => onMenuToggle(!isMenuOpen)} className="flex items-center p-2 text-xl font-normal rounded-lg text-gray-200 hover:bg-neutral-700">
                            <span className="ml-3 flex items-center gap-2"><ListPlus size={20} />Categorias</span>
                        </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/user">
                        <a className="flex items-center p-2 text-xl font-normal rounded-lg text-gray-200 hover:bg-neutral-700">
                            <span className="ml-3 flex items-center gap-2"><User size={20} />Perfil</span>
                        </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/">
                        <a className="flex items-center p-2 text-xl font-normal rounded-lg text-gray-200 hover:bg-neutral-700">
                            <span onClick={logout}className="ml-3 flex items-center gap-2"><SignOut size={20} />Sair</span>
                        </a>
                        </Link>
                    </li>
                   
                </ul>
            </div>

        </aside>

    )
}
