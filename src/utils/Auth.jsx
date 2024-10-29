// src/utils/auth.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 驗證 Token 的 Hook
export const useVerifyToken = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const verifyToken = async (token) => {
    try {
      const formBody = new URLSearchParams();
      formBody.append("token", token);

      const response = await fetch(`/api/accounts/verify_jwt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody,
        mode: "cors",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Token verification failed");
      }

      const textData = await response.text();
      const data = JSON.parse(textData);

      return data.result;
    } catch (error) {
      console.error("Token verification error:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("jwt");

      if (!token) {
        setIsVerified(false);
        setIsLoading(false);
        navigate("/accounts/signin");
        return;
      }

      const isValid = await verifyToken(token);
      setIsVerified(isValid);
      setIsLoading(false);

      if (!isValid) {
        localStorage.removeItem("jwt");
        localStorage.removeItem("username");
        navigate("/accounts/signin");
      }
    };

    checkToken();
  }, [navigate]);

  return { isVerified, isLoading };
};

// 獨立的 verifyToken 函數供外部使用
export const verifyToken = async (token) => {
  try {
    const formBody = new URLSearchParams();
    formBody.append("token", token);

    const response = await fetch(`/api/accounts/verify_jwt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
      mode: "cors",
      credentials: "include",
    });

    if (!response.ok) {
      return false;
    }

    const textData = await response.text();
    const data = JSON.parse(textData);

    return data.result;
  } catch (error) {
    console.error("Token verification error:", error);
    return false;
  }
};
