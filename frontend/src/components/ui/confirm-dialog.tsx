import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "danger" | "primary"
  loading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-6 border border-white/10 bg-zinc-950 p-8 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-3xl",
          )}
        >
          <div className="flex flex-col gap-2">
            <DialogPrimitive.Title className="text-xl font-bold tracking-tight text-white">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-zinc-400 text-sm leading-relaxed">
              {description}
            </DialogPrimitive.Description>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-2">
            <button
              disabled={loading}
              onClick={onClose}
              className="px-6 py-2.5 rounded-full text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all outline-none focus:ring-2 focus:ring-white/10 disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
              }}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-bold transition-all outline-none focus:ring-2 disabled:opacity-50 flex items-center justify-center gap-2",
                variant === "danger"
                  ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-900"
                  : "bg-white text-black hover:bg-zinc-200 focus:ring-zinc-400"
              )}
            >
              {loading && <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              {confirmText}
            </button>
          </div>

          <DialogPrimitive.Close className="absolute right-6 top-6 rounded-full opacity-40 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground outline-none">
            <X className="h-5 w-5 text-white" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
