import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextRequest, NextResponse, } from 'next/server';
import { redirectToLogin } from './utilities/middleware/auth';  

export default async function middleware(request: NextRequest) {
  
  // const authRedirect = redirectToLogin(request);
  // if (authRedirect) {
  //   return authRedirect;
  // }

  const { pathname } = request.nextUrl;

  if (!pathname.includes('/task/two-sum')) {
    const locale = routing.locales.find((l) => pathname.startsWith(`/${l}`));
    const redirectPath = locale ? `/${locale}/task/two-sum` : '/task/two-sum';
    return NextResponse.redirect(new URL(redirectPath, request.url));

  }
 
  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);
 
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/', 
    '/(ru|en)/:path*'
  ]
};