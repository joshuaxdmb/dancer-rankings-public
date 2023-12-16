import { getUrl } from "./helpers";

export const customSignIn = async (provider:string, callbackUrl:string) => {
    try {
      const response = await fetch(`${getUrl()}api/auth/custom-signin?provider=${provider}&callbackUrl=${callbackUrl}`);
      if (response.ok) {
        const data = await response.json();
        // Redirect to the URL returned from the server or handle the token
        window.location.href = data.url;
      } else {
        // Handle errors
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error('Error during custom sign-in:', error);
    }
  };

export async function OPTIONS(req:Request, res:Response) {
  return new Response(null,{status:200})
}

export const handleCors = (fn:any) => async (req:Request, res:Response) => {
  if (req.method === 'OPTIONS') {
    return new Response(null,{status:200})
  }
  return await fn(req, res)
}