currentWeather = [];
forecastWeather=[];

//Upon clicking the search button, the data for current weather and forecast are called
$('.search').on('click', function () {
  var search = $('#search-query').val();

  fetchCurrent(search);
  fetchForecast(search);
});

//Fetches the data from the current weather API
var fetchCurrent = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=97c439ea9e3bad16ec024d5ffae7eb51&units=imperial",
    dataType: "json",
    success: function(data) {
      addCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

//Fetches the data from the forecast weather API
var fetchForecast = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=97c439ea9e3bad16ec024d5ffae7eb51&units=imperial",
    dataType: "json",
    success: function(data) {
      addForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

//Extracts specific information from the API and pushes it to the currentWeather array
var addCurrentWeather = function (data) {
    currentWeather.push({
      degrees: Math.round(data.main.temp) + '°',
      city: data.name,
      weatherType: data.weather[0].main,
      iconURL: 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
    });

  renderWeather();
  currentWeather = [];
};

//Extracts specific information from the API and pushes it to the forecastWeather array
var addForecast = function (data) {
  var weatherByDate = groupForecast(data.list);
  console.log(weatherByDate);

  findAvgTemp(weatherByDate);

    for(i=0; i < data.list.length; i++) {
      forecastWeather.push({
        day: moment(data.list[i].dt_txt).format('dddd'),
        weatherType: data.list[i].weather[0].main,
        degrees: Math.round(data.list[i].main.temp) + '°',
        iconURL: 'https://openweathermap.org/img/wn/' + data.list[i].weather[0].icon + '@2x.png'
      });
    };
  

  renderForecast();
  forecastWeather = [];
};

var renderWeather = function () {
  $('.currentWeather').empty();

  for (var i = 0; i < currentWeather.length; i++) {
    const weather = currentWeather[i];

    // create HTML and append to .currentWeather
    var source = $('#current-weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weather);

    $('.currentWeather').append(newHTML);
  }
};


var renderForecast = function () {
  $('.forecast').empty();

  for (var i = 0; i < forecastWeather.length; i++) {
    const weatherForecast = forecastWeather[i];
    // create HTML and append to .currentWeather
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weatherForecast);

    $('.forecast').append(newHTML);
  }
};

//Function that groups the weather object from the API into objects by day
var groupForecast = function (array) {
  return array.reduce(function (acc, obj) {
    let key = obj['dt_txt'].substring(0,10);
    if (!acc[key]) {
      acc[key] = []
    };
    acc[key].push(obj)
    return acc
  }, {})
};

//Function to find the daily average temperature using the output from the groupForecast function.
var findAvgTemp = function (weatherByDate) {
  for (prop in weatherByDate) {
    var day = weatherByDate[prop];
    var temps = [];
    for(let i = 0; i < day.length; i++) {
      temps.push(day[i].main.temp);
    };
    console.log(temps);
  };
};
