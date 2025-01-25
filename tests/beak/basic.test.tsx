import { describe, expect, it, vi } from "vitest"
import { act, render, renderHook } from "@testing-library/react"
import useCart from "@/hooks/useCart"

import { CartItem } from "@/types"
import { CartProvider } from "@/contexts/CartContext"
import { PropsWithChildren } from "react"
import App from "@/App"

const navigateFn = vi.fn()

vi.mock("react-router-dom", async () => {
  const original = await vi.importActual("react-router-dom")
  return { ...original, useNavigate: () => navigateFn }
})

const renderWithTheme = ({ children }: PropsWithChildren) => {
  return <CartProvider>{children}</CartProvider>
}

describe("useCart", () => {
  const newCartItem: CartItem = {
    id: 1,
    name: "test",
    price: 1000,
    category: "test",
    description: "test",
    image: "",
    quantity: 1,
  }

  it("addToCart를 호출하면 cartItems에 해당 물품이 담긴다", () => {
    render(
      <CartProvider>
        <App />
      </CartProvider>,
    )

    const { result } = renderHook(() => useCart(), { wrapper: renderWithTheme })

    act(() => {
      result.current.addToCart(newCartItem)
    })

    expect(result.current.cartItems).toEqual(expect.arrayContaining([expect.objectContaining(newCartItem)]))
  })

  it("removeFromCart 호출하면 cartItems에 해당 id를 가진 물품이 제거된다.", () => {
    const { result } = renderHook(() => useCart(), { wrapper: renderWithTheme })

    act(() => {
      result.current.addToCart(newCartItem)
    })

    expect(result.current.cartItems).toEqual(expect.arrayContaining([expect.objectContaining(newCartItem)]))

    act(() => {
      result.current.removeFromCart(1)
    })

    expect(result.current.cartItems).toEqual([])
  })

  it("clearCart 호출하면 cartItems 가 빈 배열이 된다.", () => {
    const { result } = renderHook(() => useCart(), { wrapper: renderWithTheme })

    act(() => {
      result.current.addToCart(newCartItem)
      result.current.addToCart(newCartItem)
      result.current.addToCart(newCartItem)
      result.current.addToCart(newCartItem)
      result.current.clearCart()
    })

    expect(result.current.cartItems).toEqual([])
  })

  it("total은 해당 cart 내의 물품의 가격의 총합을 반환해야한다", () => {
    const { result } = renderHook(() => useCart(), { wrapper: renderWithTheme })

    act(() => {
      result.current.addToCart(newCartItem)
      result.current.addToCart(newCartItem)
      result.current.addToCart(newCartItem)
      result.current.addToCart(newCartItem)
    })

    expect(result.current.total).toEqual(4000)
  })
})
