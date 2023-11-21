import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import icons from "../../utils/icons";
import * as apis from "../../apis";
import path from "../../utils/path";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loginUrl, setLoginUrl] = useState("");
  const popupRef = useRef(null);

  useEffect(() => {
    // Hàm này sẽ được gọi mỗi khi địa chỉ URL thay đổi
    console.log("URL changed:", location.pathname);

    // Kiểm tra nếu URL chứa "code"
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");

    if (code) {
      // Xử lý logic khi đăng nhập thành công
      console.log("Đăng nhập thành công. Code:", code);
      navigate(path.PUBLIC);

      // Nếu cần chuyển hướng sau khi đăng nhập thành công, sử dụng react-router-dom
      // Ví dụ: window.location.href = '/dashboard';
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    window.addEventListener("message", (e) => {
      if (e.source === popupRef.current) {
        const res = e.data;
        if (res.success) {
          console.log(res.data);
          popupRef.current.close();
          setLoginUrl(null);
        }
      }
    });

    return () => {
      window.removeEventListener("message", () => {
        popupRef.current = null;
      });
    };
  }, []);

  const fetchLoginQr = async () => {
    try {
      const response = await apis.getLogin();
      if (response.status === 200) {
        const qrCodeData = response?.data?.data;
        setLoginUrl(qrCodeData);

        popupRef.current = window.open(
          qrCodeData,
          "Zalo login",
          "width=600,height=600,left=calc(50% - 300px)",
        );
        // if (qrCodeData) {
        //   window.location.href = qrCodeData;
        // }
        // console.log(window.location.href);

        //islo
      }
    } catch (error) {
      //console.error('Error fetching login QR:', error);
    }
  };

  const handleLogin = () => {
    fetchLoginQr();
  };

  return (
    <div>
      <span
        onClick={handleLogin}
        className="px-8 py-2 bg-[#9431C6] rounded-md text-white"
      >
        <button type="button"> Login </button>
      </span>
    </div>
  );
};

export default Login;
