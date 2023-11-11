import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
 
console.log('Executing middleware')
// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {

const token = await getToken({req, secret: process.env.JWT_SECRET});
const {pathname} = req.nextUrl

//Allow access to auth routes and routes with a valid token
if(pathname.includes('/api/auth') || token){
    return NextResponse.next()
}
}