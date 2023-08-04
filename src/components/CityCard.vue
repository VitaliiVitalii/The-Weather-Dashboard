<template>
    <div class="list-wrapper grid" :class="weatherClass">
        <span class="city-list__date">
            {{
                new Date(currentTime).toLocaleDateString(
                    "en-us",
                        {   
                            weekday: "short", 
                            day: "numeric", 
                            month: "long" 
                        }
                )
            }}
        </span>
        <div class="city-list__city item-wrap">
            <span class="city-list__icon">
                <i class="fa-solid fa-location-dot"></i>
            </span>
            <span class="city-list__city-name">{{ city.city }}</span>
        </div>
        <p class="city-list__temp">
            {{ Math.round(city.weather.main.temp) }}&deg;C
        </p>
        <div class="city-list__temp-amplitude">
            <p>
                Max:
                {{ Math.round(city.weather.main.temp_max) }}&deg;C
            </p>
            <p>
                Min:
                {{ Math.round(city.weather.main.temp_min) }}&deg;C
            </p>
        </div>
        <div class="city-list__current-info">
            <div class="city-list__time">
                <i class="fa-regular fa-clock"></i>
                <span>
                    {{
                        new Date(currentTime).toLocaleTimeString(
                            "en-us", {
                                hour: "2-digit",
                        })
                    }}
                </span>
            </div>
            <div class="city-list__disc">
                <i :class="weatherIcon"></i>
                <span>{{ city.weather.weather[0].main }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
    city: {
        type: Object,
        default: () => { },
    },
});

console.log(props.city)

const currentTime = ref('');

onMounted(() => {
    getCurrentDateTime();
});

function getCurrentDateTime() {
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const utc = props.city.weather.dt * 1000 + localOffset;
    currentTime.value = utc + 1000 * props.city.weather.timezone;

}

    const weatherCode = ref(props.city.weather.weather[0].main);
    const weatherIcon = computed(() => {
        switch (weatherCode.value) {

            case "Clear":
                return 'fa-solid fa-sun';

            case "Clouds":
                return 'fa-solid fa-cloud';

            case "Drizzle":
                return "fa-solid fa-cloud-showers-heavy";

            case "Rain":
                return "fa-solid fa-cloud-sun-rain";

            case "Thunderstorm":
                return "fa-solid fa-cloud-bolt";

            case "Snow":
                return "fa-solid fa-snowflake";

            case "Mist":
                return "fa-solid fa-smog";

            default:
                return "";
        }
    });

const weatherClass = ref('');

const setBackgroundColorBasedOnWeather = (weatherCode) => {
    switch (weatherCode.value) {
        case "Clear":
            weatherClass.value =  "sunny" 
            break;

        case ("Rain" || "Snow" || "Thunderstorm"):
            weatherClass.value = "rainy"
            break;

        default:
            weatherClass.value = "default"
            break;

    };

}

setBackgroundColorBasedOnWeather(weatherCode);

</script>

