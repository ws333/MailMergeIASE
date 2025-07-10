// Todo:_Move to addon shared?
const BACKEND_URL_PROD = new URL('https://i3c-backend.onrender.com/send-email');
const BACKEND_URL_DEV = new URL('http://localhost:5000/send-email');

export const URL_SEND_EMAIL = import.meta.env.PROD ? BACKEND_URL_PROD.href : BACKEND_URL_DEV.href;
