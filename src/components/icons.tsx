export const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
)

export const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-lineca="round" stroke-linejoin="round" className="w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
)

export const DropdownIcon = ({ rotate }: { rotate: boolean }) => (
    <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="#000000"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className={`w-5 h-5 text-black transition-transform duration-[.3s] ${rotate ? "rotate-180": ""}`}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 9l6 6l6 -6" /></svg>
)