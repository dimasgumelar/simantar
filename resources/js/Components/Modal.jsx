import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from "@headlessui/react";

export default function Modal({
    children,
    show = false,
    maxWidth = "2xl",
    closeable = true,
    onClose = () => {},
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "2xl": "sm:max-w-2xl",
    }[maxWidth];

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-50 flex transform items-center overflow-y-auto px-4 py-6 transition-all sm:px-0"
                onClose={close}
            >
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-gray-500/75 dark:bg-gray-900/75" />
                </TransitionChild>

                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel
                        className={`mb-6 w-full mx-auto transform overflow-hidden rounded-lg bg-white shadow-xl transition-all dark:bg-gray-800 ${maxWidthClass}`}
                    >
                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}

export function FileModal({ selectedFile = {} }) {
    return (
        <dialog id="preview_file_modal" className="modal">
            <div className="modal-box w-11/12 max-w-5xl place-items-center">
                {selectedFile &&
                selectedFile.file_path.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img
                        src={`/storage/${selectedFile.file_path}`}
                        alt="Preview"
                        className="max-h-[80vh] object-contain"
                    />
                ) : selectedFile &&
                  selectedFile.file_path.match(/\.(mp4|mov|avi|mkv|webm)$/i) ? (
                    <video
                        src={`/storage/${selectedFile.file_path}`}
                        controls
                        autoPlay
                        className="max-h-[80vh] object-contain"
                    />
                ) : (
                    <div>Tipe file tidak didukung</div>
                )}
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}
