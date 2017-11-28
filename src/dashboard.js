import './css/main.css'
import $ from 'jquery';
import ig from 'fetch-instagram';
import { users } from 'fetch-instagram';

//distance
const slider = document.getElementById("myRange");
const output = document.getElementById("dist");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
};

//random color for users
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// var userIcon = document.getElementById('circle');
// userIcon.style.backgroundColor = generateRandomColor();

//short username
const getShortUsername = () => {
  const username = document.getElementById('username').innerHTML;
  let firstName = username.split(' ')[0].charAt(0).toUpperCase();
  let lastName = username.split(' ')[1].charAt(0).toUpperCase();
  return firstName + lastName;
};

const user = getShortUsername();
// console.log(user);

const newNode = document.createElement("p");
const textnode = document.createTextNode(user);
newNode.appendChild(textnode);
document.getElementById("circle").appendChild(newNode);



//intagram requests
const instagram = ig({
    accessToken: '1441777407.9157211.36ec49db6d5d46f9b59ab5c856609636'
  });

//const users = instagram.user();
  
// users.then(res => console.log(res.json()));

const url = 'https://api.instagram.com/v1/users/1441777407/media/recent/?access_token=1441777407.9157211.36ec49db6d5d46f9b59ab5c856609636';
const getUser = (url,callback) => {
    $.ajax({
      url: url,

      error: function() {
        alert('error');
      },

      success: function(data) {
          callback(data);
        
      },
      type: 'GET',
      dataType: "jsonp"
    })
};

getUser(url,(response) => {
    const myNode = document.getElementById('photos');
    for(let i=0; i<response.data.length; i++){
      //console.log(response.data[i].images.standard_resolution.url);
      let newNode = document.createElement('div');
      newNode.className = 'photo';
      let imgChild = document.createElement("img");
      imgChild.setAttribute('src', response.data[i].images.standard_resolution.url);
      let alt = 'photo' + i;
      imgChild.setAttribute('alt', alt);
      imgChild.setAttribute('height', '200px');
      imgChild.setAttribute('width', '170px');
      newNode.appendChild(imgChild);
      myNode.appendChild(newNode);
    }

});



