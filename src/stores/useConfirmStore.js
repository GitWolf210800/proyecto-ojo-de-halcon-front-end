import { defineStore } from "pinia"
import { ref } from "vue"

export const useConfirmStore = defineStore("confirm", () => {
  const isOpen = ref(false)
  const message = ref("")
  const resolveFn = ref(null)

  const open = (msg) => {
    message.value = msg
    isOpen.value = true

    return new Promise((resolve) => {
      resolveFn.value = resolve
    })
  }

  const confirm = () => {
    resolveFn.value?.(true)
    isOpen.value = false
  }

  const cancel = () => {
    resolveFn.value?.(false)
    isOpen.value = false
  }

  return {
    isOpen,
    message,
    open,
    confirm,
    cancel
  }
})