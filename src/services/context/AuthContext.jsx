import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true); // Thêm biến loading

  useEffect(() => {
    let role = null;
    const token = localStorage.getItem("token");
    if (token) {
      role = JSON.parse(atob(token.split(".")[1])).role;
    }

    if (role) {
      setAuth({ role });
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);
     // Đặt loading thành false sau khi xử lý xong
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading }}> {/* Truyền loading */}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
