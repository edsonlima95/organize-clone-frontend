import { IconProps, Trash } from "phosphor-react"
import { ComponentType } from "react"

type ModalType = {
    invoice_type?: string | undefined,
    title: string,
    icon: ComponentType<IconProps>
}

function ModalHeader({invoice_type, icon: Icon, title}: ModalType){

    return (
        <h1 className={`text-zinc-500 text-xl mb-6 font-semibold flex flex-col`}>
        <div className="flex">
            <Icon size={25}/> {invoice_type === 'expense' ? `${title} despesa` : (invoice_type === 'income' ? `${title} receita` : `${title}`)}
        </div>
        <span className="border-b-2 w-full mt-4"></span>
    </h1>
    )

}

export default ModalHeader