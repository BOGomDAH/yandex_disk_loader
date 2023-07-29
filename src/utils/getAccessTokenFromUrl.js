export const getAccessTokenFromUrl = (location) => {
    const params = new URLSearchParams(location.hash.substring(1));
    return params.get('access_token')
}