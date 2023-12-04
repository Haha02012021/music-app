import React, { useEffect, useRef } from "react";
import * as apis from "../../../apis";
import * as actions from '../../../store/actions';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const popupWidth = 600;
const popupHeight = 600;
const left = (screenWidth - popupWidth) / 2;
const top = (screenHeight - popupHeight) / 2;

const Login = () => {
  const popupRef = useRef(null);
  const dispatch = useDispatch();
  const {login, info} = useSelector(state => state.user);

  useEffect(() => {
    window.addEventListener("message", (e) => {
      if (e.source === popupRef.current) {
        const res = e.data;
        console.log(res);
        if (res?.success) {
          localStorage.setItem('accessToken', res?.data?.tokens?.access_token)
          dispatch(actions.getLogin(true));
          dispatch(actions.getUserInfo(res?.data?.user));
          popupRef.current.close();
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

        popupRef.current = window.open(
          qrCodeData,
          "Zalo login",
          `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`,
        );
      }
      } catch (error) {
        console.error('Error fetching login QR:', error);
      }
  };

  const handleLogin = () => {
    if (login === false) {
      fetchLoginQr();
    } else {
      localStorage.removeItem('accessToken');
      dispatch(actions.getLogin(false));
      dispatch(actions.getUserInfo({}));
    }
  };

  return (
    <div className="w-full flex items-center justify-end gap-4">
      {login && <div>
        <img src={info?.avatar} alt='avatar' className="w-10 h-10 rounded-full border-[#9431C6] border-[2px]"></img>
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
