import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ShellLayout } from "./components/shell-layout";
import { UserProvider } from "./context/user-context";
import { CartRoutePage } from "./pages/cart-page";
import { HomePage } from "./pages/home-page";
import { InterviewPage } from "./pages/interview-page";
import { ProductsRoutePage } from "./pages/products-page";
import { mockUser } from "@repo/mfe-shared";

export function App() {
  return (
    <UserProvider user={mockUser}>
      <BrowserRouter>
        <Routes>
          <Route element={<ShellLayout />} path="/">
            <Route element={<HomePage />} index />
            <Route element={<ProductsRoutePage />} path="products" />
            <Route element={<CartRoutePage />} path="cart" />
            <Route element={<InterviewPage />} path="interview" />
            <Route element={<Navigate replace to="/" />} path="*" />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
