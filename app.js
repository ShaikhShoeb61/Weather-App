// Select DOM elements
const input = document.querySelector("input");
const temp = document.querySelector(".temp");
const loc = document.querySelector(".location");
const des = document.querySelector(".description");
const time = document.querySelector(".time");
const sun_time = document.querySelector(".sunset-time");
const days = document.querySelector(".Day");
const humidity = document.querySelector(".humidity-percent");
const weatherIcon = document.querySelector(".weatherIcon");
const pressure = document.querySelector(".pressure-speed");
const feels = document.querySelector(".feels-percent");
const visibility = document.querySelector(".visibility-speed");
const daysContainer = document.querySelector(".forcast-days-container");
const max = document.querySelector(".value-max");
const min = document.querySelector(".value-min");
const empty = document.querySelector(".forecast-empty");
const inputContainer = document.querySelector(".input-container");
const percentCircle = document.querySelector(".temp-circle");

// API Keys
const apiKey = "b4c595ccf6ea755329d16f69340243ab";
const apiKeyDateTime = "567286207bdb4874af34d3ecca192253";

// Fetch Data From API
const checkWeather = async (city) => {
  try {
    // Fetch current weather data for the city
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data for the city.");
    }
    const data = await response.json();
    // Update the DOM with current weather data
    updateDom(data);
    // Fetch date and time data for the city
    dateTime(data);
    // Fetch forecast data for the city
    checkForcast(city, data);
  } catch (error) {
    // Handle errors by displaying error message on the DOM
    showErrorMessage("Please enter correct city name.");
  }
};

// Fetch Data From Forcast API & Update on DOM
const checkForcast = async (city, data) => {
  const apiForcast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiForcast);
  if (!response.ok) {
    throw new Error("Failed to fetch forecast data for the city.");
  }
  const forcastData = await response.json();
  const forecastList = forcastData.list;

  if (data) {
    const uniqueDates = [];
    for (let i = 0; i < forecastList.length; i++) {
      const forecastData = forecastList[i];
      const currentDate = forecastData.dt_txt.slice(0, 10);

      if (!uniqueDates.includes(currentDate)) {
        uniqueDates.push(currentDate);

        const dateTime = new Date(forecastData.dt_txt);
        const dayOfWeek = dateTime.toLocaleDateString("en-US", {
          weekday: "short",
        });
        const forecastTemp = forecastData.main.temp;

        // Create DOM elements to display forecast data
        const day = document.createElement("div");
        day.classList.add("days");
        day.textContent = dayOfWeek.toUpperCase();

        const icon = document.createElement("div");
        icon.innerHTML = `<img class="forcasticon" src="https://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png" alt="icon"></img>`;

        const temp = document.createElement("label");
        temp.classList.add("forcast-temp");
        temp.textContent = `${Math.round(forecastTemp)}°`;

        daysContainer.appendChild(day);
        day.appendChild(icon);
        day.appendChild(temp);
      }
      empty.remove();
    }
  }
};

// Fetch Date & Time From API
const dateTime = async (data) => {
  try {
    const apiUrlDt = `https://timezone.abstractapi.com/v1/current_time/?api_key=${apiKeyDateTime}&location=${data.name}`;
    const response = await fetch(apiUrlDt);
    if (!response.ok) {
      throw new Error("Failed to fetch time data.");
    }
    const dataTime = await response.json();

    const { datetime: currentDateTime } = dataTime;
    let currentTime = currentDateTime.slice(11, 16);

    // Update the DOM with the current time
    updateDom(data, currentTime);
  } catch (error) {
    showErrorMessage("Your time limit exceeded. Please try again later.");
  }
};

// Update DOM
const updateDom = (data, currentTime) => {
  if (data) {
    if (currentTime) {
      let date = new Date();
      let hour = parseInt(currentTime.slice(0, 2));

      let day = date.toLocaleDateString("en-US", { weekday: "long" });

      // Update DOM with current weather data
      weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon"></img>`;

      const temperature = data.main.temp;
      temp.innerHTML = Math.round(temperature);
      percentCircle.style.display = "unset";

      const location = data.name;
      loc.innerHTML = location;

      let ampm = "";

      if (hour < 12) {
        ampm = "AM";
        sun_time.innerHTML = "Sunrise Time";
      } else {
        ampm = "PM";
        hour -= 12;
        sun_time.innerHTML = "Sunset Time";
      }

      const formattedTime =
        hour.toString().padStart(2, "0") + currentTime.slice(2) + " " + ampm;

      time.innerHTML = formattedTime;
      days.innerHTML = day;

      const humidityPercentage = data.main.humidity;
      humidity.innerHTML = `${humidityPercentage}%`;

      const description = data.weather[0].description;
      des.innerHTML = description;

      const pressureValue = `${data.main.pressure}hPa`;
      pressure.innerHTML = pressureValue;

      const feelsLikePercentage = `${Math.round(data.main.feels_like)}%`;
      feels.innerHTML = feelsLikePercentage;

      const visibilityValue = `${(data.visibility / 1000).toFixed(1)}km`;
      visibility.innerHTML = visibilityValue;

      const maxTemperature = `${Math.round(data.main.temp_max)}°`;
      max.innerHTML = maxTemperature;

      const minTemperature = `${Math.round(data.main.temp_min)}°`;
      min.innerHTML = minTemperature;
    }
  }
};

// Define a function to handle error
const showErrorMessage = (message) => {
  let errorMessage = document.querySelector(".error");
  if (!errorMessage) {
    errorMessage = document.createElement("p");
    errorMessage.classList.add("error");
    errorMessage.innerHTML = message;
    inputContainer.appendChild(errorMessage);
  }
};

// Define a function to handle keypress events
const handleInput = (e) => {
  if (e.keyCode === 13) {
    const city = e.target.value;
    if (!city) {
      showErrorMessage("Please enter a city name.");
      return;
    } else {
      let errorMessage = document.querySelector(".error");
      if (errorMessage) {
        errorMessage.remove();
      }
    }
    checkWeather(city);
  }
};

// Add event listener to the input field
const searchCity = () => {
  input.addEventListener("keyup", handleInput);
  updateDom();
};

// Call the function to initialize the search
searchCity();
