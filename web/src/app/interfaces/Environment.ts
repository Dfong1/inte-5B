import Echo from "laravel-echo"

export const api = 'http://192.168.253.180:8000'
export const echo: Echo = new Echo({
    broadcaster:'pusher',
    key:'123',
    cluster:'mt1',
    wsHost:'192.168.253.180',
    wsPort:6001,
    forceTLS:false,
    disableStatus:true,
  })
