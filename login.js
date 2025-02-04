var formdata = new FormData();
formdata.append("email", "bahodirhusainov308@gmail.com");
formdata.append("password", "QyTlLIioVRGjk165tvHzRhJ7fG4sU2KvVJoxaKqj");

var requestOptions = {
  method: 'POST',
  body: formdata,
  redirect: 'follow'
};

fetch("https://notify.eskiz.uz/api/auth/login", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));