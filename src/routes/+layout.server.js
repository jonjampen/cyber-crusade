import { redirect } from '@sveltejs/kit';
export async function load({ url }) {

    let user = false

    if (!user && !url.pathname.includes('/login')) {
        throw redirect(302, '/login');

    } else if (user && url.pathname.includes('/login')){
        throw redirect(302, '/');
    } else {
      return {}
    }

}