import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchRequest } from 'src/api/client/fetchRequest';
import { accessTokenApi, userInfoApi } from 'src/api/url';
import { saveAuthUser } from 'src/utils/userInfo';

const ONE_HOUR = 60 * 60 * 1000

const CallbackRoute = () => {
	const location = useLocation();

	const fetchAccessToken = async (token: string) => {
		const res = await fetchRequest(accessTokenApi, {
			params: {token}
		})

		let userInfo: Record<string, any> = []

		if (res?.success) {
			if (res?.result) {
				userInfo = res?.result

				localStorage.setItem('access_token', userInfo?.access_token)

				const userInfoRes = await fetchRequest(userInfoApi, {
					requireAuth: true
				})

				if (userInfoRes?.success) {
					saveAuthUser(userInfoRes?.result, 86400)
				}

			} else {
				console.error('failed')
			}
		} else {
			console.error('request failed')
		}

		return res
	}

  useEffect(() => {

		async function init() {
			const searchParams = new URLSearchParams(location?.search)
			const token = String(searchParams.get("token"));

			const data = await fetchAccessToken(token)
			console.log(data)
		}

		init()
	}, []);

  return <div>asdf</div>;
};

export default CallbackRoute;
