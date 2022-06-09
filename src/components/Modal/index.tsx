/* eslint-disable react-hooks/exhaustive-deps */
import Modal from 'react-modal';

type ModalProps = {
    handleAfterOpenModal?: () => void,
    handleCloseModal: () => void,
    modalIsOpen: boolean,
    children: React.ReactNode
}


function ModalDefault({ children, handleCloseModal, modalIsOpen }: ModalProps) {

    return (

        <Modal
            isOpen={modalIsOpen}
            onRequestClose={handleCloseModal}
            contentLabel="Example Modal"
            overlayClassName="modal-overlay"
            className="modal-content">

            {children}

        </Modal>
    )

}

export default ModalDefault