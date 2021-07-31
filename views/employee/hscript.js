const mymap = L.map('mapid').setView([0, 0], 1);

  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const tiles = L.tileLayer(tileUrl, {
    attribution
  });

  tiles.addTo(mymap);

  fetch('employees.json').then(function(response) {
    return response.json();
  }).then(function(obj) {
    console.log(obj.employees);
    const html = obj.employees
      .map(user => {
        const lan = `${user.latitude}`;
        const lon = `${user.longitude}`;
        var popupContent = "Latitude: " + `${user.latitude}` + " Longitude: " + `${user.longitude}` + "<br>" + " Driver Name: " + `${user.fullName}`;
        L.marker([lan, lon]).addTo(mymap).bindPopup(popupContent);
      }).join("");

    console.log(html);
  }).catch(function(error) {
    console.log("error");
    console.log(error);
  });