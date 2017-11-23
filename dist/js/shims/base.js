// function initialize() {
//   var mapOptions = {
//     zoom: 11,
//     center: new google.maps.LatLng(65.588946, 22.157324)
//   };

//   var map = new google.maps.Map(document.getElementById('map-canvas'),
//       mapOptions);
// }

// function loadScript() {
//   var script = document.createElement('script');
//   script.type = 'text/javascript';
//   script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
//       '&signed_in=true&callback=initialize';
//   document.body.appendChild(script);
// }

// window.onload = loadScript;




$(function() {
    $('body').vegas({
        slides: [
            { src: '/images/skylines_blur.jpg' }
        ]
    });
});