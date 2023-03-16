import { redirect } from '@sveltejs/kit';
export async function load({ url }) {

    let user = true

    if (user) {
        // authorized but on login
        if (url.pathname.includes('/login') || url.pathname.includes('/signup')) {
            throw redirect(302, '/');
        }
        // authorized and OK
        else {
            return {}
        }
    }
    else {
        // unauthorized
        if (!url.pathname.includes('/login') && !url.pathname.includes('/signup')) {
            throw redirect(302, '/login');
        }
        // on login
        else {
            return {}
        }
    }
}