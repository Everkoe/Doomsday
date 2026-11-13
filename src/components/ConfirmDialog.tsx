import { Modal } from './Modal';

type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ isOpen, title, message, confirmLabel, onConfirm, onCancel }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} labelledBy="confirm-title" panelClassName="sm:max-w-md">
      <div className="p-6 sm:p-7">
        <h2 id="confirm-title" className="text-lg font-semibold text-snow">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-mist">{message}</p>
        <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="h-11 rounded-md px-5 text-sm font-semibold text-snow ring-1 ring-white/15 hover:bg-snow/8">
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} className="h-11 rounded-md bg-marvel px-5 text-sm font-semibold text-white hover:bg-marvel-deep">
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
