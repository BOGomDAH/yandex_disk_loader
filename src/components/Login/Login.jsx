import React from 'react';

const Login = () => {
    const clientId = import.meta.env.VITE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_REDIRECT_URL;

    const handleLogin = () => {
        const params = {
            response_type: 'token',
            client_id: clientId,
            redirect_uri: redirectUri,
        };
        const authUrl = `https://oauth.yandex.ru/authorize?response_type=${params.response_type}&client_id=${params.client_id}&redirect_uri=${params.redirect_uri}`;
        window.location.replace(authUrl);
    };

    return (
        <div>
            <h2>Авторизация через Yandex</h2>
            <button onClick={handleLogin}>Войти с помощью Yandex</button>
        </div>
    );
};

export default Login;