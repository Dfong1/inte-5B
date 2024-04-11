import Echo from "laravel-echo"

<<<<<<< HEAD
export const api = 'http://127.0.0.1:8000' 
=======
export const api = 'http://192.168.253.180:8000'
>>>>>>> 6f5086645c23430ba6c6a7f7f674b302238eb2e1
export const echo: Echo = new Echo({
    broadcaster:'pusher',
    key:'123',
    cluster:'mt1',
    wsHost:'192.168.253.180',
    wsPort:6001,
    forceTLS:false,
    disableStatus:true,
  })
