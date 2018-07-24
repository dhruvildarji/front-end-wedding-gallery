function handleImageUpload(e) {

  // Prevent Default Form Action
  e.preventDefault();
  
  // Create New FormData Object and append attached image
  let form_data = new FormData();
  form_data.append('image', document.querySelector('input[type=file]').files[0]);
  
  // Send image via post request to s3 bucket 
  axios({
    url: 'https://wedding-gallary.herokuapp.com/api/images/',
    method: 'post',
    headers: { "Authorization" : "Token "+localStorage.getItem("token") },
    data: form_data,
    contentType: false,
    processData: false
  })
  .then(response => {
    if (response) {
      console.log(response);

      document.querySelector('.image-upload-success-message').textContent = 'Image Uploaded Successfully! Awaiting Approval.';
      setTimeout(function() {
        document.querySelector('.image-upload-success-message').textContent = '';
      },3000);

      // Clear Form if Image Successfully Uploaded
      e.target.reset();

      // Re-render gallery with new set of images
      loadImages();

    }
  })
  .catch((error) => {
    console.log(error);
  })

}

function loadImages() {
  
  // Get images from s3 bucket
  axios({
    url: 'https://wedding-gallary.herokuapp.com/api/images/',
    method: 'get',
    headers: { "Authorization" : "Token "+localStorage.getItem("token") },
    contentType: "application/json; charset=utf-8"
  })
  .then(response => {
    
    // If response received
    if (response) {
      console.log(response);

      // Get the gallery container
      let gallery_card_container = document.querySelector('.gallery-card-container');
      gallery_card_container.innerHTML = '';

      if (response.data.length < 1) {

        // Create empty gallery text and append to gallery container
        let empty_gallery_text = document.createElement('p');
        empty_gallery_text.textContent = 'Oops! There are no images in the gallery at present';
        empty_gallery_text.style.marginLeft = '10px';
        gallery_card_container.appendChild(empty_gallery_text);
      }
      else {
        localStorage.setItem('data', JSON.stringify(response.data));
        // Iterate over the data and render the gallery images
        renderImages(response.data);
      }

    }
  })
  .catch((error) => {
    console.log(error);
  })
}

function renderImages(data) {
  let gallery_card_container = document.querySelector('.gallery-card-container');
  gallery_card_container.innerHTML = '';
  data.map(card => {

    // Create the gallery card
    let gallery_card = document.createElement('div');
    gallery_card.classList.add('gallery-card');
    gallery_card.dataset.id = card.id;
    
    // Create the gallery Image
    let gallery_img = document.createElement('img');
    gallery_img.classList.add("gallery-img");
    gallery_img.src = card.image;
    
    // Create the necessary buttons
    let image_actions = document.createElement('div');
    image_actions.classList.add("flex", "image-actions");

    let like_btn = document.createElement('button');
    like_btn.classList.add("btn", "like-img");
    like_btn.dataset.like_id = card.id;
    like_btn.value = card.up_vote;
    like_btn.textContent = 'Like ('+card.up_vote+')';

    // Conditionally render approve button
    let approve_btn = document.createElement('button');
    if(localStorage.getItem('super_user') === 'true') {
      approve_btn.classList.add("btn", "approve-img");
      if(card.is_approved === true) {
        approve_btn.textContent = 'Approved';
        approve_btn.style.pointerEvents = 'none';
      }
      else {
        approve_btn.textContent = 'Approve';
      }
    }
    else {
      approve_btn.classList.add("btn", "hide-approve-img");
    }
    approve_btn.dataset.approve_id = card.id;

    // Append buttons to the respective section
    image_actions.appendChild(like_btn);
    image_actions.appendChild(approve_btn);
    
    // Append image and buttons to the gallery card
    gallery_card.appendChild(gallery_img);
    gallery_card.appendChild(image_actions);
    
    // Append the gallery image to the container
    gallery_card_container.appendChild(gallery_card);

  });

  // Get all the like buttons and add event listeners
  let like_btns = document.querySelectorAll(".like-img");
  for (i = 0; i < like_btns.length; ++i) {
    console.log(like_btns[i]);
    like_btns[i].addEventListener('click',(e) => handleImageLike(e));
  }

  // Add event listener to approve button if user is superuser
  if(localStorage.getItem('super_user') === 'true') {
    let approve_btns = document.querySelectorAll(".approve-img");
    for (i = 0; i < approve_btns.length; ++i) {
      console.log(approve_btns[i]);
      approve_btns[i].addEventListener('click',(e) => handleImageApprove(e));
    }
  }

}

function handleImageLike(e) {

  console.log(e.target.dataset.like_id);
  
  let old_likes = parseInt(e.target.value);
  let new_likes;

  if(e.target.classList.contains("active-like-btn")) {
    new_likes = old_likes - 1;
  }
  else {
    new_likes = old_likes + 1;
  }

  let update_data = {
    id: e.target.dataset.like_id,
    up_vote: new_likes
  }

  // e.target.value = new_likes;
  // e.target.textContent = 'Like ('+new_likes+')';
  // e.target.classList.toggle("active-like-btn");
  
  axios({
    url: 'https://wedding-gallary.herokuapp.com/api/images/',
    method: 'patch',
    data: update_data,
    headers: { "Authorization" : "Token "+localStorage.getItem("token") }
  })
  .then(response => {
    if (response) {
      console.log(response);
      e.target.value = new_likes;
      e.target.textContent = 'Like ('+new_likes+')';
      e.target.classList.toggle("active-like-btn");
    }
  })
  .catch((error) => {
    console.log(error);
  })
}

function handleImageApprove(e) {

  let update_data = {
    id: e.target.dataset.approve_id,
    is_approved: true
  }
  
  axios({
    url: 'https://wedding-gallary.herokuapp.com/api/images/',
    method: 'patch',
    data: update_data,
    headers: { "Authorization" : "Token "+localStorage.getItem("token") }
  })
  .then(response => {
    if (response) {
      console.log(response);
      e.target.textContent = 'Approved';
      e.target.style.pointerEvents = 'none';
    }
  })
  .catch((error) => {
    console.log(error);
  })
}

function handleLogout() {
  
  axios({
    url: 'https://wedding-gallary.herokuapp.com/api/logout/',
    method: 'post',
    headers: { "Authorization" : "Token "+localStorage.getItem("token") },
    contentType: "application/json; charset=utf-8",
    dataType: "json"
  })
  .then(response => {
    localStorage.clear();
    window.location.replace("index.html");
  })
  .catch((error) => {
    console.log(error);
  })

}

function handleUploadFormSubmit() {
  let image_upload_form = document.querySelector('#upload-new-image-form');
  image_upload_form.addEventListener('submit', handleImageUpload);
}

function sortImages() {
  let select_value = document.getElementById('sort-by-value').value;
  let data = JSON.parse(localStorage.getItem('data'));
  
  if(select_value === 'likes') {
    data.sort(function (a,b) {
      return b.up_vote - a.up_vote;
    });
  }
  else {
    data.sort(function (a,b) {
      return Date.parse(a.created) - Date.parse(b.created);
    });
  }
  renderImages(data);
}

console.log(JSON.parse(localStorage.getItem('data')));


loadImages();
handleUploadFormSubmit();