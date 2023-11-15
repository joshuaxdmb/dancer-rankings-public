
export const customSignIn = async (provider:string, callbackUrl:string) => {
    try {
      const response = await fetch(`localhost:3000/api/auth/custom-signin?provider=${provider}&callbackUrl=${callbackUrl}`);
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
  