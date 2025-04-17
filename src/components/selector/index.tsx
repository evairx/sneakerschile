import { useClickAway } from "@/hook/use-click-away"
import { useRef } from "preact/hooks"
import { signal, Signal } from "@preact/signals"

function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ")
}

interface SelectorItem {
  id: string
  region: string
  [key: string]: any
}

interface SelectorProps {
  items: SelectorItem[]
  onChange?: (item: SelectorItem) => void
  placeholder?: string
  className?: string
  instanceId: string
}

const selectorStates = new Map<string, {
  isOpen: Signal<boolean>
  selectedItem: Signal<SelectorItem | null>
  hoveredItemId: Signal<string | null>
}>()

function getOrCreateState(instanceId: string) {
  if (!selectorStates.has(instanceId)) {
    selectorStates.set(instanceId, {
      isOpen: signal(false),
      selectedItem: signal<SelectorItem | null>(null),
      hoveredItemId: signal<string | null>(null)
    })
  }
  return selectorStates.get(instanceId)!
}

export default function Selector({ items, onChange, placeholder = "Seleccionar", className, instanceId }: SelectorProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const state = getOrCreateState(instanceId)

  useClickAway(dropdownRef, () => state.isOpen.value = false)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      state.isOpen.value = false
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      if (items.length === 0) return

      const currentIndex = state.selectedItem.value?.id 
        ? items.findIndex((item) => item.id === state.selectedItem.value?.id) 
        : -1

      const nextIndex =
        e.key === "ArrowDown" 
          ? (currentIndex + 1) % items.length 
          : (currentIndex - 1 + items.length) % items.length

      state.hoveredItemId.value = items[nextIndex].id
    }
    if (e.key === "Enter" && state.hoveredItemId.value) {
      const item = items.find((item) => item.id === state.hoveredItemId.value)
      if (item) {
        handleSelectItem(item)
      }
    }
  }

  const handleSelectItem = (item: SelectorItem) => {
    state.selectedItem.value = item
    state.isOpen.value = false
    if (onChange) {
      onChange(item)
    }
  }

  return (
    <div className={classNames("relative w-full", className || "")} ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        onClick={() => state.isOpen.value = !state.isOpen.value}
        className={classNames(
          "w-full flex items-center justify-between px-4 py-2 h-[42px]",
          "bg-white text-black border border-gray-300",
          "hover:bg-gray-50 hover:border-black",
          "focus:outline-none focus:ring-2 focus:ring-gray-200",
          "transition-all duration-150 ease-in-out h-10",
          state.isOpen.value && "border-gray-400 ring-2 ring-gray-200",
        )}
        aria-expanded={state.isOpen.value}
        aria-haspopup="true"
      >
        <span className="truncate">
          {state.selectedItem.value ? state.selectedItem.value.region || state.selectedItem.value.name : placeholder}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"  
          className={classNames(
            "text-gray-700 transition-transform duration-200", 
            state.isOpen.value && "transform rotate-180"
          )}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {state.isOpen.value && (
        <div
          className="absolute left-0 right-0 top-full mt-2 z-10 w-full"
          style={{
            animation: "dropdownFadeIn 150ms ease-out forwards",
          }}
        >
          <div className="w-full rounded-sm border border-gray-300 bg-white p-1 shadow-lg max-h-60 overflow-y-auto">
            {items.length > 0 ? (
              <div className="py-1">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={() => state.hoveredItemId.value = item.id}
                    onMouseLeave={() => state.hoveredItemId.value = null}
                    className={classNames(
                      "w-full text-left px-3 py-2 text-sm rounded flex justify-between items-center hover:bg-gray-100",
                      "transition-colors duration-100",
                      "focus:outline-none",
                      state.hoveredItemId.value === item.id || 
                      (state.selectedItem.value && state.selectedItem.value.id === item.id)
                        ? "text-black"
                        : "text-gray-600",
                    )}
                  >
                    <span className="font-medium">{item.region || item.name}</span>
                    <span className="font-light">{item.number}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-2 px-3 text-sm text-gray-500">No hay opciones disponibles</div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}