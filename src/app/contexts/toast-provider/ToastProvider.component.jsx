// ToastProvider.jsx
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContextProviderBase } from './context';

export const ToastProvider = ({ children }) => {
  const showToast = ({ message, type = 'info', duration = 4000 }) => {
    toast(message, {
      type,
      autoClose: duration,
      position: "top-center",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      pauseOnFocusLoss: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <ToastContextProviderBase value={{ showToast }}>
      {children}
      <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        toastClassName={() =>
          'relative flex text-xl items-start px-4 py-6 pr-12 rounded bg-white shadow text-black font-[robotSlab]'
        }
        bodyClassName="text-2xl"
      />
    </ToastContextProviderBase>
  );
};




