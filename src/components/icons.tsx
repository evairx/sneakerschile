export const CartIcon = () => (
    <svg role="presentation" stroke-width="2" focusable="false" width="24" height="24" class="icon icon-cart" viewBox="0 0 22 22">
        <path d="M9.182 18.454a.91.91 0 1 1-1.818 0 .91.91 0 0 1 1.818 0Zm7.272 0a.91.91 0 1 1-1.818 0 .91.91 0 0 1 1.819 0Z" fill="currentColor"></path>
        <path d="M5.336 6.636H21l-3.636 8.182H6.909L4.636 3H1m8.182 15.454a.91.91 0 1 1-1.818 0 .91.91 0 0 1 1.818 0Zm7.272 0a.91.91 0 1 1-1.818 0 .91.91 0 0 1 1.819 0Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
)

export const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-lineca="round" stroke-linejoin="round" className="w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
)

export const DropdownIcon = ({ rotate }: { rotate: boolean }) => (
    <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="#000000"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className={`w-5 h-5 text-black transition-transform duration-[.3s] ${rotate ? "rotate-180": ""}`}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 9l6 6l6 -6" /></svg>
)