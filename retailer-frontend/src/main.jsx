import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import LanguageProvider from "./context/LanguageContext";
import CartProvider from "./context/CartContext";
import OrderProvider from "./context/OrderContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LanguageProvider>
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </OrderProvider>
      </AuthProvider>
    </LanguageProvider>
  </BrowserRouter>
);

