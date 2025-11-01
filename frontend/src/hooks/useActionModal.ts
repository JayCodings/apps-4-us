import { useActionModalContext } from "@/contexts/ActionModalContext";

export function useActionModal() {
  const { openAction, closeAction, isOpen } = useActionModalContext();

  return {
    openAction,
    closeAction,
    isOpen,
  };
}
