import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as apis from "../../apis";
import * as actions from '../../store/actions';
import { useSelector, useDispatch } from 'react-redux';

const Login = () => {
  const [loginUrl, setLoginUrl] = useState("");
  const popupRef = useRef(null);
  const dispatch = useDispatch();
  const {token, info} = useSelector(state => state.user);
  const [login, setLogin] = useState(token ? true : false);

  useEffect(() => {
    window.addEventListener("message", (e) => {
      if (e.source === popupRef.current) {
        const res = e.data;
        if (res.success) {
          setLogin(true);
          localStorage.setItem('accessToken', res?.data?.tokens?.access_token)
          dispatch(actions.getAccessToken(res?.data?.tokens?.access_token));
          dispatch(actions.getUserInfo(res?.data?.user));
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
      }
      } catch (error) {
        //console.error('Error fetching login QR:', error);
      }
  };

  const handleLogin = () => {
    if (!login) {
      fetchLoginQr();
    } else {
      localStorage.removeItem('accessToken');
      setLogin(false);
      dispatch(actions.getAccessToken([]));
      dispatch(actions.getUserInfo({}));
    }
  };

  return (
    <div className="w-full flex items-center justify-end gap-4">
      {login && <div>
        <img src={info?.avatar} className="w-10 h-10 rounded-full border-[#9431C6] border-[2px]"></img>
      </div>}
      <span
        onClick={handleLogin}
        className="px-8 py-2 bg-[#9431C6] rounded-md text-white"
      >
        <button type="button"> {login ? 'Đăng xuất' : 'Đăng nhập'} </button>
      </span>
    </div>
  );
};

export default Login;
