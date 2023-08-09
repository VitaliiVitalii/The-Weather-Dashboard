<template>
    <div 
        class="city-list flex" 
        v-for="city in savedCities" 
        :key="city.id">
            <CityCard :city="city" @click="goToCityView(city)"/>
    </div>
    <p class="city-list__fallback" v-if="savedCities.length === 0"> 
        No locations added. To start tracking a location, search in
        the field above.
    </p>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CityCard from './CityCard.vue';

const weatherApiKey = 'a647bee212d162e066b8c8ad9a2453ce';
const router = useRouter();
const savedCities = ref([]);

const getCities = async () => {
    if (localStorage.getItem('savedCities')) {
        savedCities.value = JSON.parse(localStorage.getItem('savedCities'));

        const request = [];
        savedCities.value.forEach((city) => {
            request.push(
                axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=${weatherApiKey}&units=metric`)

            );

        });

        const weatherData = await Promise.all(request);

        await new Promise((res) => setTimeout(res, 600));

        weatherData.forEach((value, index) => {
            savedCities.value[index].weather = value.data;

        });

    };

};

await getCities();

const goToCityView = (city) => {
    router.push({
        name: "city",
        params: { country: city.country, city: city.city },
        query: { id: city.id, lat: city.coords.lat, lng: city.coords.lng }

    });

};

</script>

<style lang="scss">
    @import '../assets/scss/blocks/CityList.scss';
    
</style>