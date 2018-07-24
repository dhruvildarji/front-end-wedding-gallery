function tabInit() {
  var reel = document.querySelector('.tab_reel');
  var tab1 = document.querySelector('.tab1');
  var tab2 = document.querySelector('.tab2');
  // var panel1 = document.querySelector('.tab_panel1');
  // var panel2 = document.querySelector('.tab_panel2');

  function slideLeft(e) {
    tab2.classList.remove('active');
    this.classList.add('active');
    reel.style.transform = "translateX(0%)";
  }

  function slideRight(e) {
    tab1.classList.remove('active');
    this.classList.add('active');
    reel.style.transform = "translateX(-50%)";
  }

  tab1.addEventListener('click', slideLeft);
  tab2.addEventListener('click', slideRight);
};

function handleRegister(e) {
  e.preventDefault();

  let form_data = {
    "username": e.target.user_name.value,
    "email": e.target.user_email.value,
    "password": e.target.user_password.value,
    "confirm_password": e.target.confirm_user_password.value,
  }

  console.log(form_data);

  if(e.target.user_name.value === '') {
    e.target.user_name.nextSibling.nextSibling.style.display = 'block';
    return false;
  }
  else {
    e.target.user_name.nextSibling.nextSibling.style.display = 'none';
  }

  if(e.target.user_email.value === '') {
    e.target.user_email.nextSibling.nextSibling.style.display = 'block';
    return false;
  }
  else {
    e.target.user_email.nextSibling.nextSibling.style.display = 'none';
  }

  if (e.target.user_password.value === '') {
    e.target.user_password.nextSibling.nextSibling.style.display = 'block';
    return false;
  }
  else {
    e.target.user_password.nextSibling.nextSibling.style.display = 'none';
  }
  if (e.target.confirm_user_password.value === '') {
    e.target.confirm_user_password.nextSibling.nextSibling.style.display = 'block';
    e.target.confirm_user_password.nextSibling.nextSibling.textContent = 'Re-Enter Password!';
    return false;
  }
  else {
    e.target.confirm_user_password.nextSibling.nextSibling.style.display = 'none';
  }

  if(e.target.user_password.value !== e.target.confirm_user_password.value) {
    console.log('enter same passwords');
    console.log(e.target.confirm_user_password.nextSibling.nextSibling.style);
    e.target.confirm_user_password.nextSibling.nextSibling.textContent = 'Passwords do not match!';
    e.target.confirm_user_password.nextSibling.nextSibling.style.display = 'block';
    return false;
  }
  else {
    e.target.confirm_user_password.nextSibling.nextSibling.style.display = 'none';
  }

  axios({
    url: 'https://wedding-gallary.herokuapp.com/api/register/',
    method: 'post',
    data: form_data
  })
  .then(response => {
    if (response) {
      console.log(response.data);
      localStorage.setItem('token',response.data.auth_token);
      document.querySelector('.register-success-message').textContent = 'Successfully Registered! Please login to continue.';
      setTimeout(function() {
        document.querySelector('.register-success-message').textContent = '';
      },3000);
    }
  })
  .catch((error) => {
    console.log(error.response);
  })

}

function handleLogin(e) {
  e.preventDefault();
  console.log(e);
  console.log(e.target.user_login_email.value);
  console.log(e.target.user_login_password.value);

  let form_data = {
    "email": e.target.user_login_email.value,
    "password": e.target.user_login_password.value,
  }

  console.log(form_data);

  if(e.target.user_login_email.value === '') {
    e.target.user_login_email.nextSibling.nextSibling.style.display = 'block';
    return false;
  }
  else {
    e.target.user_login_email.nextSibling.nextSibling.style.display = 'none';
  }

  if(e.target.user_login_password.value === '') {
    e.target.user_login_password.nextSibling.nextSibling.style.display = 'block';
    return false;
  }
  else {
    e.target.user_login_password.nextSibling.nextSibling.style.display = 'none';
  }
  
  axios({
    url: 'https://wedding-gallary.herokuapp.com/api/login/',
    method: 'post',
    data: form_data
  })
  .then(response => {
    if (response) {
      console.log(response);
      console.log(Object.keys(response.data));
      localStorage.setItem('super_user',response.data.is_superuser);
      localStorage.setItem('token',response.data.auth_token);
      window.location.href="gallery.html";
    }
  })
  .catch((error) => {
    console.log(error);
  })

}

function handleUserForms() {
  let register_form = document.querySelector('#register-form');
  register_form.addEventListener('submit', handleRegister);
  let login_form = document.querySelector('#login-form');
  login_form.addEventListener('submit', handleLogin);
}

tabInit();
handleUserForms();