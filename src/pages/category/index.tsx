import Layout from "../layout";
import CategoryModal from '../../components/Modal'
import DeleteCategoryModal from '../../components/Modal'
import { useEffect, useState } from "react";
import ModalHeader from "../../components/Modal/ModalHeader";
import { PencilSimple, PlusCircle, Trash, Wallet } from "phosphor-react";
import { useForm } from "react-hook-form";
import ShowErrorMessage from "../../components/Message";
import { getCookie } from "cookies-next";
import api from "../../services/axios";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from "react-toastify";

type Category = {
    id: number,
    title: string,
    description?: string,
    user_id: number
}


function Category() {

    const [categoryModalOpen, setCategoryModalOpen] = useState(false)
    const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [categoryDeleteId, setCategoryDelete] = useState<number>()


    const schema = yup.object({
        title: yup.string().required("Titulo é obrigatório")
    })

    const { handleSubmit, register, reset, setValue, getValues, formState: { errors } } = useForm<Category>({
        resolver: yupResolver(schema)
    })

    try {

        const user = JSON.parse(getCookie("organize.user") as string)

        setValue('user_id', user.id)
    } catch (error) {

    }

    useEffect(() => {
        getCategoryList()
    }, [])

    async function getCategoryList() {
        try {

            const response = await api.get(`/categories?user_id=${getValues('user_id')}`)

            setCategories(response.data.categories)

        } catch (error) {

        }
    }

    async function submitCategory(data: Category) {

        if (data.id) {
            update(data)
        } else {
            create(data)
        }
    }

    async function create(data: Category) {
        const response = await api.post(`/categories`, data)

        toast.success(response.data.message)
        setCategories(response.data.categories)

        resetFields()
        closeCategoryModal()
    }

    async function update(data: Category) {

        const response = await api.put(`/categories/${data.id}`, data)

        toast.success(response.data.message)
        setCategories(response.data.categories)

        resetFields()
        closeCategoryModal()
    }

    async function handleOpenModalDelete(id: number) {
        setCategoryDelete(id)
        setDeleteCategoryModalOpen(true)
    }
    async function handleCloseModalDelete() {
        setDeleteCategoryModalOpen(false)
    }

    async function destroy(id: number) {
        const response = await api.delete(`/categories/${categoryDeleteId}`)

        toast.success(response.data.message)
        setCategories(response.data.categories)

        handleCloseModalDelete()

    }

    function resetFields() {
        reset({
            title: '',
            description: '',
        })
    }

    function openCategoryModal(category?: Category) {

        if (category?.id) {
            setValue('id', category.id)
            setValue('title', category.title)
            setValue('description', category.description)
            setValue('user_id', category.user_id)
        }

        setCategoryModalOpen(true)
    }

    function closeCategoryModal() {
        resetFields()
        setCategoryModalOpen(false)
    }


    return (
        <>
            {/* Modal de categoria */}
            <CategoryModal modalIsOpen={categoryModalOpen} handleCloseModal={closeCategoryModal}>
                <form onSubmit={handleSubmit(submitCategory)}>
                    <ModalHeader icon={Wallet} title="Cadastro de categorias" />

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
            </CategoryModal>

            <DeleteCategoryModal modalIsOpen={deleteCategoryModalOpen} handleCloseModal={handleCloseModalDelete}>
                <ModalHeader icon={Trash} title="Excluir categoria" />

                <div className="flex p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg" role="alert">
                    <svg className="inline flex-shrink-0 mr-3 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                    <div>
                        <span className="font-medium">Atenção!</span> Esta categoria será excluida permanentamente, tem certeza que deseja excluir ?
                    </div>
                </div>
                <button type="button" onClick={() => destroy(categoryDeleteId as number)} className="w-full focus:outline-none text-white bg-[#e95858] hover:bg-[#e95858] focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-2xl px-5 py-2.5 mb-2 "> Excluir</button>

            </DeleteCategoryModal>

            <Layout>
                <div className="container mx-auto w-7/12 ">
                    <span className="block mb-10">
                        <h1 className="font-bold text-gray-500 text-4xl mb-4 flex">Categorias</h1>
                        <span className="block w-full border"></span>
                    </span>
                </div>
                <div className="container mx-auto shadow-md h-full md:w-7/12 rounded-lg bg-white p-5 overflow-x-auto">
                    <button onClick={() => openCategoryModal()} className="bg-[#06DD83] px-3 py-1 rounded"><PlusCircle size={35} color="#fff" alt="Cadastro" /></button>
                    <table className={`w-full text-sm text-left text-gray-500`}>
                        <thead className="text-xs text-gray-700 uppercase text-center ">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Titulo
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    Descrição
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {categories?.map(category => (
                                <tr key={category.id} className="border-b">
                                    <td className="px-6 py-4">{category.title}</td>
                                    <td className="px-6 py-4">{category.description ? category.description : '-'}</td>
                                    <td className="px-6 py-4 flex justify-evenly">
                                        <PencilSimple size={32} color="#fff" className="cursor-pointer bg-[#3f83f8] rounded-full w-10 h-10 p-2" onClick={() => openCategoryModal(category)} />
                                        <Trash size={32} color="#fff" className="cursor-pointer bg-[#ff5454] rounded-full w-10 h-10 p-2" onClick={() => handleOpenModalDelete(category.id)} />
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </Layout>
        </>
    )

}

export default Category