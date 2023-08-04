<template>
  <p class="city-hint" v-if="route.query.preview">
      You are currently previewing this city, click the "+" button to start tracking this
      city.
  </p>
  <div class="weather__container">
    <div class="home-btn">
      <router-link :to="{ name: 'home' }" class="btn btn__home btn__success">
        <span class="btn__icon"><i class="fa-solid fa-house"></i></span>
        <span class="btn__text">home</span>
      </router-link>
    </div>
    <!-- Weather info card -->
    <!-- Current weather -->
    <div class="info-card grid">
      <div class="info-card__details">
        <h2 class="details__title">{{ route.params.city }}</h2>
        <span class="details__date">
          {{
            new Date(weatherData.currentTime).toLocaleDateString("en-us", {
              weekday: "long",
              day: "2-digit",
              month: "long",
            })
          }}
        </span>
        <span class="details__time">
          <i class="fa-regular fa-clock"></i>
          {{
            new Date(weatherData.currentTime).toLocaleTimeString("en-us", {
              timeStyle: "short",
              hourCycle: "h23",
            })
          }}
        </span>
      </div>
      <div class="info-card__temp">
        {{ Math.round(weatherData.current.temp) }}<span>&deg;C</span>
      </div>
      <div class="info-card__desc">
        {{ capitalizedWeatherDesc }}
      </div>
      <div class="info-card__img">
        <img
          :src="`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`"
          alt="weather icon"
        />
      </div>
      <div class="info-card__items">
        <i class="fa-solid fa-wind"></i>
        {{ weatherData.current.wind_speed }} <span>m/s</span>
      </div>
      <div class="info-card__items">
        <i class="fa-solid fa-person-burst"></i>
        {{ Math.round(weatherData.current.feels_like) }}<span>&deg;C</span>
      </div>
      <div class="info-card__items">
        <i class="fa-solid fa-arrow-up"></i>
        {{
          new Date(weatherData.current.sunrise * 1000).toLocaleTimeString("en-us", {
            timeStyle: "short",
            hour12: false,
          })
        }}
      </div>
      <div class="info-card__items">
        <i class="fa-solid fa-arrow-down"></i>
        {{
          new Date(weatherData.current.sunset * 1000).toLocaleTimeString("en-us", {
            timeStyle: "short",
            hour12: false,
          })
        }}
      </div>
    </div>
    <!-- Hourly weather -->
    <div class="hourly-weather">
      <div class="hourly-weather__wrapper">
        <h2 class="hourly-weather__title">Weather for today</h2>
        <div class="flex hourly-weather__list">
          <div
            v-for="hourlyItem in weatherData.hourly"
            :key="hourlyItem.dt"
            class="hourly-weather__items"
          >
            <p>
              {{
                new Date(hourlyItem.currentTime).toLocaleTimeString("en-us", {
                  hour: "numeric",
                })
              }}
            </p>
            <img
              :src="`http://openweathermap.org/img/wn/${hourlyItem.weather[0].icon}@2x.png`"
              alt="hourly weather term"
            />
            <p class="text-xl">{{ Math.round(hourlyItem.temp) }}&deg;C</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Daily weather -->
    <div class="daily-weather">
      <div class="daily-weather__wrapper">
        <h2 class="daily-weather__title">Forecast for 7 days</h2>
        <div class="flex daily-weather__info">
          <div
            class="flex daily-weather__card"
            v-for="dayItem in weatherData.daily"
            :key="dayItem.dt"
          >
            <div class="daily-weather__card-item">
              <img
                :src="`http://openweathermap.org/img/wn/${dayItem.weather[0].icon}@2x.png`"
                alt="day info"
              />
            </div>
            <div class="daily-weather__card-date">
              {{
                new Date(dayItem.dt * 1000).toLocaleDateString("en-us", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })
              }}
            </div>
            <div class="daily-weather__card-item">
              <span class="max-temp">{{ Math.round(dayItem.temp.max) }}&deg;C</span>
              <span class="min-temp">{{ Math.round(dayItem.temp.min) }}&deg;C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="city-remove">
      <button class="btn btn__danger" @click="removeCity">
        <span class="btn__icon"><i class="fa-solid fa-trash"></i></span>
        <span>delete</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { ref, computed } from "vue";

const route = useRoute();
const router = useRouter();
const weatherApiKey = "a647bee212d162e066b8c8ad9a2453ce";

const getWeatherData = async () => {
  try {
    const weatherData = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${route.query.lat}&lon=${route.query.lng}&exclude={part}&appid=${weatherApiKey}&units=metric`
    );

    // cal current date & time
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const utc = weatherData.data.current.dt * 1000 + localOffset;
    weatherData.data.currentTime = utc + 1000 * weatherData.data.timezone_offset;

    // cal hourly weather offset
    weatherData.data.hourly.forEach((hour) => {
      const utc = hour.dt * 1000 + localOffset;
      hour.currentTime = utc + 1000 * weatherData.data.timezone_offset;
    });

    //Loading delay
    await new Promise((res) => setTimeout(res, 600));

    return weatherData.data;

  } catch (error) {
    console.log(error);
  }
};

const weatherData = await getWeatherData();

const removeCity = () => {
  const cities = JSON.parse(localStorage.getItem("savedCities"));
  const updatedCities = cities.filter((city) => city.id !== route.query.id);
  localStorage.setItem("savedCities", JSON.stringify(updatedCities));
  router.push({
    name: "home",
  });
};

// The first letter is capitalized
const weatherDesc = ref(weatherData.current.weather[0].description);
const capitalizedWeatherDesc = computed(() => {
  if (weatherDesc.value) {
    return weatherDesc.value.charAt(0).toUpperCase() + weatherDesc.value.slice(1);
  }
  return "";
});
</script>

<style lang="scss" scoped>
@import "../assets/scss/blocks/weather/CityView.scss";

</style>
