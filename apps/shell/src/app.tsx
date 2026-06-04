import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ApiUserProvider } from "./features/auth/components/api-user-provider";
import { AuthRequired } from "./features/auth/components/auth-required";
import { SignInPage } from "./features/auth/components/sign-in-page";
import { SignUpPage } from "./features/auth/components/sign-up-page";
import { CartRoutePage } from "./features/cart-route/components/cart-route-page";
import { HomePage } from "./features/home/components/home-page";
import { InterviewPage } from "./features/interview/components/interview-page";
import { ProductsRoutePage } from "./features/products-route/components/products-route-page";
import { ShellLayout } from "./features/shell-chrome/components/shell-layout";

export function App() {
  return (
    <ApiUserProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<SignInPage />} path="/sign-in" />
          <Route element={<SignUpPage />} path="/sign-up" />
          <Route element={<ShellLayout />} path="/">
            <Route element={<HomePage />} index />
            <Route
              element={
                <AuthRequired>
                  <ProductsRoutePage />
                </AuthRequired>
              }
              path="products"
            />
            <Route
              element={
                <AuthRequired>
                  <CartRoutePage />
                </AuthRequired>
              }
              path="cart"
            />
            <Route element={<InterviewPage />} path="interview" />
            <Route element={<Navigate replace to="/" />} path="*" />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApiUserProvider>
  );
}
