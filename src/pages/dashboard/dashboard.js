import '../../css/main.css'
import $ from 'jquery';
import ig from 'fetch-instagram';
import { users } from 'fetch-instagram';
import getUserDetails from '../../js/currentUser';
require('../../js/500px');

//service-worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./src/service-worker.js', { scope: './src/' })
    .then(function(registration) {
      console.log("Service Worker Registered with Success!");
    })
    .catch(function(err) {
      console.log("Service worker Failed to Register", err);
    })
}

//array with photos
let PHOTOS = [];
let MAP;
let inputValues = {
    location: '',
    distance: 1,
    year: 'all'
};

//distance field
const slider = document.getElementById("myRange");
const output = document.getElementById("dist");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
};

// GOOGLE MAPS!!!!

const initMap = (photos) => {
  var image = "/src/img/push-pin.png";
  var MAP = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13
  });
  var input = document.getElementById('searchInput');

  var autocomplete = new google.maps.places.Autocomplete(input);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo('bounds', MAP);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: MAP,
    icon: image,
    //animation: google.maps.Animation.BOUNCE,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();   
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      MAP.fitBounds(place.geometry.viewport);
    } else {
      MAP.setCenter(place.geometry.location);
      MAP.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindowContent.children['place-name'].textContent = "Photos from: " + place.name;
    infowindowContent.children['place-address'].textContent = address;
    infowindow.open(MAP, marker);
  });
  
};
  
//end google maps

function addMarkers() {
  const marker = new google.maps.Marker({
    position: {lat:42.4668,lng:-70.9495},
    map: MAP
  });
  marker.setMap(MAP);
}

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

function appendPhotos() {
    let location = localStorage.getItem('input-location');
    let index = 0;
    const myNode = document.getElementById('photos');
    const myMarker = document.getElementById('marker-photos');
    let DISTANCE = localStorage.getItem('input-distance') ? localStorage.getItem('input-distance') : 1;
    let year = localStorage.getItem('input-year') && localStorage.getItem('input-year') !== 'all' ? localStorage.getItem('input-year') : null;
        for (let d = 1; d <= DISTANCE; d++) {
            _500px.api('/photos/search', {term: location, image_size: 3, page: d}, function (response) {
                let photos = response.data.photos;
                if (year) {
                    photos = photos.filter(photo => photo.created_at.substr(0,4) === year);
                }
                PHOTOS = PHOTOS.concat(photos);
                for (let i = 0; i < photos.length; i++) {
                    let newNode = document.createElement('div');
                    newNode.className = 'photo';
                    let imgChild = document.createElement("img");
                    imgChild.id = "photo-img";
                    imgChild.setAttribute('src', photos[i].image_url);
                    let alt = photos[i].name;
                    imgChild.setAttribute('alt', alt);
                    imgChild.setAttribute('height', '200px');
                    imgChild.setAttribute('width', '170px');
                    imgChild.dataset.photoId = index;
                    index += 1;

                    let content = document.createElement("div");
                    content.className = 'photo--content';
                    let comments_count = photos[i].comments_count;
                    let likes = photos[i].votes_count;

                    //comm content
                    let divForComm = document.createElement("div");
                    divForComm.className = "comm-content";
                    let commIcon = document.createElement("img");
                    commIcon.setAttribute('src', "/src/img/comm.png");
                    let comm = document.createElement('p');
                    comm.innerHTML = comments_count;
                    divForComm.appendChild(commIcon);
                    divForComm.appendChild(comm);

                    let divForLikes = document.createElement("div");
                    divForLikes.className = "likes-content";
                    let heartIcon = document.createElement("img");
                    heartIcon.setAttribute('src', "/src/img/heart.png");
                    let l = document.createElement('p');
                    l.innerHTML = likes;
                    divForLikes.appendChild(heartIcon);
                    divForLikes.appendChild(l);

                    newNode.appendChild(imgChild);
                    content.appendChild(divForLikes);
                    content.appendChild(divForComm);

                    newNode.appendChild(content);
                    myNode.appendChild(newNode);


                    let imgMarkerChild = document.createElement("img");
                    imgMarkerChild.setAttribute('src', photos[i].image_url);
                    imgMarkerChild.setAttribute('alt', alt);
                    imgMarkerChild.className = "mySlides";
                    myMarker.appendChild(imgMarkerChild);
                }
                addMarkers(PHOTOS);
            });
        }
};

function searchPhotosInsta() {
  const myNode = document.getElementById('photos');
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
  getUser(url,(response) => {
      const myNode = document.getElementById('photos');
      console.log(response.data);
      localStorage.setItem("instaPhotos",response.data);
      for(let i=0; i<response.data.length; i++){
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
}


//500px requests

_500px.init({
  sdk_key: '6763229ce9c9af86b8e4f65f3365422daf36883e'
});

//geo-location
function searchPhotosByLocation(e) {
    let location = e ? document.getElementById("searchInput").value : localStorage.getItem('input-location');
    const myNode = document.getElementById('photos');
    const myMarker = document.getElementById('marker-photos');

    //remove previous photos
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
    while (myMarker.firstChild) {
      myMarker.removeChild(myMarker.firstChild);
    }
    PHOTOS = [];

    e ? location = location.split(',',1)[0] : null;

    inputValues.location = location;
    localStorage.setItem("input-location",inputValues.location);

    appendPhotos();
}



function searchPhotosByDate() {
    const select = document.getElementById('year');
    const option = select.options[select.selectedIndex].value;
    localStorage.setItem('input-year', option);
    searchPhotosByDistance();
}

const searchPhotosByDistance = (e,data) => {
    let DISTANCE;
    if (data) {
        if (data < 20) {
            DISTANCE = 1;
        }
        if (data >= 20 && data < 30) {
            DISTANCE = 2;
        }
        if (data >= 30 && data < 40) {
            DISTANCE = 3;
        }
        if (data >= 40) {
            DISTANCE = 4;
        }
        localStorage.setItem('input-distance', DISTANCE);
    } else DISTANCE = localStorage.getItem('input-distance');
    inputValues.distance = DISTANCE;
    e ? e.keyCode = 13 : null;
    searchPhotosByLocation();
};


window.onload = () => {
    const userDetails = getUserDetails(localStorage.getItem('username'));
    document.getElementById('username').innerHTML = userDetails.name;
    document.getElementById('circle').innerHTML = userDetails.initials;
    document.getElementById('year').onchange = searchPhotosByDate;

    if (localStorage.getItem('input-location')) {
        if (localStorage.getItem('input-distance') !== 1) {
            if (localStorage.getItem('input-year')) {
                searchPhotosByDate();
            } else {
                searchPhotosByDistance();
            }
        } else {
            searchPhotosByLocation();
        }
    }
  };

//marker-carousel
let slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  let i;
  const x = document.getElementsByClassName("mySlides");
  if (n > x.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";  
  }
  x[slideIndex-1].style.display = "block";  
}

//modal - information
document.addEventListener('click',function(event) {
  if(event.target && event.target.id === 'photo-img'){

    //add content for modal = information about photo
    let photoId = event.target.dataset.photoId;
    let myNewNode = document.getElementById("modal-img");
    let name = document.getElementById("modal-img-name");
    name.innerHTML = PHOTOS[photoId].name;
    let imgChild = document.createElement("img");
    imgChild.setAttribute('src', PHOTOS[photoId].image_url);
    let alt = PHOTOS[photoId].name;
    myNewNode.appendChild(imgChild);

    let date = document.getElementById("date");
    const myDate = new Date(PHOTOS[photoId].created_at).toDateString();
    date.innerHTML =  myDate ? myDate : 'empty field';
    let iso = document.getElementById("iso");
    iso.innerHTML =  PHOTOS[photoId].iso ? PHOTOS[photoId].iso : 'empty field';
    let camera = document.getElementById("camera");
    camera.innerHTML =  PHOTOS[photoId].camera ? PHOTOS[photoId].camera : 'empty field';
    let description = document.getElementById("description");
    description.innerHTML = PHOTOS[photoId].description  ? PHOTOS[photoId].description : 'empty field';
    const modal = document.getElementById('myModal');
    modal.style.display = "block";
  }
});

const closeModal = () => {
  let myNode = document.getElementById("modal-img");

  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
  const modal = document.getElementById('myModal');
  modal.style.display = "none";
};

window.plusDivs = plusDivs;
window.initMap = initMap;
window.addMarkers = addMarkers;
window.searchPhotosByLocation = searchPhotosByLocation;
window.searchPhotosByDistance = searchPhotosByDistance;
window.searchPhotosInsta = searchPhotosInsta;
window.closeModal = closeModal;
