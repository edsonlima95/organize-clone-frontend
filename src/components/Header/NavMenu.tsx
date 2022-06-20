import Link from "next/link"
import { useContext } from "react"
import { InvoiceModalContext } from "../../contexts/InvoiceModalContext"


function NavMenu() {

    const { openInvoiceModal } = useContext(InvoiceModalContext)

    return (

        <div className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1" id="mobile-menu-2">
            <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium -my-1">
               
                <li>
                    <div className="relative group cursor-pointer w-full text-lg block py-2 pr-4 pl-3  font-bold text-white border-b border-gray-100  md:border-0 md:p-0">
                        lançar
                        <ul className="absolute top-7 p-2 hidden group-hover:block text-sm text-gray-500 bg-white  w-40 -ml-12 rounded-md shadow" aria-labelledby="dropdownLargeButton">
                            <li>
                                <button onClick={() => openInvoiceModal("expense")} className="block w-full px-4 py-2  hover:bg-[#ff6c6c] hover:text-white">Lançar Despesa</button>
                            </li>
                            <li>
                                <button onClick={() => openInvoiceModal("income")} className="block w-full px-4 py-2 hover:bg-[#06DD83]  hover:text-white">Lançar Receita</button>
                            </li>
                        </ul>
                    </div>

                </li>

                <li>
                    <Link href="/invoices" passHref>
                        <a className="text-lg block py-2 pr-4 pl-3 font-bold text-white border-b border-gray-100  md:border-0 md:p-0">Lançamentos</a>
                    </Link>
                </li>

                <li>
                    <Link href="/wallet" passHref>
                        <a className="text-lg block py-2 pr-4 pl-3 font-bold text-white border-b border-gray-100  md:border-0 md:p-0">Carteiras</a>
                    </Link>
                </li>

                <li>
                    <Link href="/category" passHref>
                        <a  className="text-lg block py-2 pr-4 pl-3 font-bold text-white border-b border-gray-100  md:border-0 md:p-0">Categorias</a>
                    </Link>
                </li>
                
                <li>
                    <Link href="/report" passHref>
                        <a  className="text-lg block py-2 pr-4 pl-3 font-bold text-white border-b border-gray-100  md:border-0 md:p-0">Relatórios</a>
                    </Link>
                </li>
            </ul>
        </div>

    )

}


export { NavMenu }
