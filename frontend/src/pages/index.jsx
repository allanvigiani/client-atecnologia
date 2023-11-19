import Register from "./register/index";
import Login from "./login/index";
import Company from "./company/index";
import { getCookie } from 'cookies-next';
import { validadeToken } from '../services/Auth';


export default function Home() {
  return (
    <>
      <Company />
    </>
  );
}

export const getServerSideProps = async ({ req, res }) => {
	try {
		const token = getCookie('user_auth_information', (req, res));

		if (!token) {
			throw new Error('Token inválido!');
		}

		validadeToken(token);

		return {
			props: {}
		}

	} catch (error) {

		return {
			redirect: {
				permanent: false,
				destination: '/login'
			},
			props: {}
		}
	}
};