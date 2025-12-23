import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchRequest } from 'src/api/client/fetchRequest';
import { accessTokenApi, userInfoApi } from 'src/api/url';
import { saveAuthUser } from 'src/utils/userInfo';

const ONE_HOUR = 60 * 60 * 1000;

const CallbackRoute = () => {
  const location = useLocation();

  const fetchAccessToken = async (token: string) => {
    const res = await fetchRequest(accessTokenApi, {
      params: { token },
    });

    let userInfo: Record<string, any> = [];

    if (res?.success) {
      if (res?.result) {
        userInfo = res?.result;

        localStorage.setItem('access_token', userInfo?.access_token);

        const userInfoRes = await fetchRequest(userInfoApi, {
          requireAuth: true,
        });

        if (userInfoRes?.success) {
          saveAuthUser(userInfoRes?.result, 86400);
        }
      } else {
        console.error('failed');
      }
    } else {
      console.error('request failed');
    }

    return res;
  };

  useEffect(() => {
    async function init() {
      const searchParams = new URLSearchParams(location?.search);
      const token = String(searchParams.get('token'));

      const data = await fetchAccessToken(token);
      console.log(data);

      // Notify the opener window that login is complete
      if (window.opener) {
        window.opener.postMessage({ type: 'LOGIN_SUCCESS' }, window.location.origin);
      }

      window.close();
    }

    init();
  }, []);

  return (
    <div className="flex items-center justify-center py-12 h-100">
      <div className='flex flex-col justify-center items-center'>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nyu-700 mb-3"></div>
        <div className=''>Loading...</div>
      </div>
    </div>
  );
};

export default CallbackRoute;
