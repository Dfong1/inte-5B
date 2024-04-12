import Echo from "laravel-echo"
export const api = 'http://127.0.0.1:8000'
export const echo: Echo = new Echo({
    broadcaster:'pusher',
    key:'123',
    cluster:'mt1',
    wsHost:'localhost',
    wsPort:6001,
    forceTLS:false,
    disableStatus:true,
  })
