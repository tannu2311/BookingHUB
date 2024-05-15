
export async function getAccessToken(base64Credentials) {

    const apiUrl = `${process.env.PAYPAL_URL}/v1/oauth2/token`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${base64Credentials}`,
      },
      body: 'grant_type=client_credentials',
    });
  
    if (response.ok) {
      const data = await response.json();
      return data.access_token;
    } else {
      return null;
    }
  }