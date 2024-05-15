import { NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt";
import Cookies from 'js-cookie';

export async function middleware(request) {

    const path = request.nextUrl.pathname

    const isPublicPath = path === '/login' || path === '/registration' || path === '/reset-password'
    const isadmin = path.startsWith('/admin') 
    const isuser = path.startsWith('/user')

    const token = await getToken({ req: request });


    if (token && path !== "/login") {

        if ((token.exp * 1000 ) <= Date.now() && path !== "/login") {
            Cookies.remove('next-auth.session-token');
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }


    if ((isadmin || isuser) && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token) {
        if (token.role == 1 && (isPublicPath || isuser)) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
        if (token.role == 0 && (isPublicPath || isadmin)) {
            return NextResponse.redirect(new URL('/user/dashboard', request.url))
        }

    }

}