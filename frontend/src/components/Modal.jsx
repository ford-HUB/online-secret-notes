
const Modal = ({ Open, setOpen, children }) => {
    if (!Open) return null;

    return (
        <dialog className="modal" open>
            <div className="modal-box">
                <h3 className="font-bold text-lg text-black">Add Category</h3>
                <div className="modal-action">
                    {children}
                </div>
            </div>
        </dialog>
    );
};

export default Modal;


