import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const TokenChecker = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const protectedRoutes = ["/create", "/list"];

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/users/CheckToken", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          throw new Error("Token invalid");
        }
        
      } catch (error) {
        console.warn("Token hiba:", error);
        localStorage.removeItem("token");
        window.location.reload()
        
        if (protectedRoutes.includes(location.pathname)) {
          navigate("/");
        }
      }
    };

    const interval = setInterval(checkToken, 60000);
    return () => clearInterval(interval);
  }, [navigate, location]);

  return null;
};

export default TokenChecker;
