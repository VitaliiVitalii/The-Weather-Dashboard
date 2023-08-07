<template>
    <main class="main">
        <div class="main__container flex">
            <section class="search">
                <div class="search__bar">
                    <a href="#" class="search__link" @click="inputFocus">
                        <i class="fa-solid fa-magnifying-glass search__icon"></i>
                    </a>
                    <input
                        type="text"
                        placeholder="Enter the name of the city"
                        v-model="searchRequest"
                        @input="getSearchValue"
                        class="search__input"
                        id="input-box"
                        autocomplete="off"
                        ref="weatherInput"
                        
                    >
                    <button @click="clearText" class="search__btn search__btn_remove"><i class="fa-solid fa-xmark search__icon"></i></button>
                    <button @click="getCurrentLocation" class="search__btn"><i class="fa-solid fa-location-crosshairs search__icon"></i></button>
                </div>
                <div class="search__result-box">
                    <ul v-if="mapSearchResults">
                        <p class="search__error" v-if="searchError">
                            ERROR
                        </p>
                        <p class="search__error" v-else-if="!searchError && mapSearchResults.length === 0">
                            Please, try a different term
                        </p>
                        <template v-else>
                            <li class="search__result"
                                v-for="searchItem in mapSearchResults"
                                :key="searchItem.id"
                                @click="previewCity(searchItem)"
                            >
                                {{ searchItem.place_name }}
                            </li>
                        </template>
                    </ul>
                </div>
            </section>
            <section class="main__city-list flex">
                <Suspense class="flex">
                    <CityList/>
                    <template #fallback>
                        <BaseLoading />
                    </template>
                </Suspense>
            </section>
        </div>
    </main>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CityList from '../components/CityList.vue';
import BaseLoading from '../components/UI/BaseLoading.vue';

const router = useRouter();
const mapAPIKey = 'pk.eyJ1Ijoiam95eW8iLCJhIjoiY2xqZWhyNnozMDRyajNrcTdwNm1tMXJodyJ9.9tCt-YN29W5NR1qneGQINw';
const searchRequest = ref('');
const requestDelay = ref(null);
const mapSearchResults = ref(null); 
const searchError = ref(null);
const weatherInput = ref(null);

const getSearchValue = () => {
    clearTimeout(requestDelay.value);
    requestDelay.value = setTimeout(async () => {
        if (searchRequest.value !== '') {
            try {
                const result = await axios.get(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchRequest.value}.json?access_token=${mapAPIKey}&types=place`
                );
                mapSearchResults.value = result.data.features;
                console.log(mapSearchResults.value);
            } catch {
                searchError.value = true;
            };
            return;
        };
        mapSearchResults.value = null;
    }, 300);
};

const previewCity = (searchItem) => {
    let locationFullname = searchItem.place_name.split(",");
    if (locationFullname.length > 2) {
        locationFullname.splice(1, 1);
    }
    const [city, country] = locationFullname;
    router.push({
        name: "city",
        params: { country: country.replaceAll(" ", ""), city: city },
        query: {
            lat: searchItem.geometry.coordinates[1],
            lng: searchItem.geometry.coordinates[0],
            preview: true,
        },
    })
};


const getCurrentLocation = async () => {
    try {
        const position = await new Promise((resolve, reject) => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            } else {
                reject(new Error("Geolocation is not available in this browser."));
            }
        });

        const { latitude, longitude } = position.coords;
        console.log(`Latitude: ${latitude}`);
        console.log(`Longitude: ${longitude}`);

        const cityName = await getCityNameFromCoordinates(latitude, longitude);
        console.log(`City Name: ${cityName}`);
        searchRequest.value = cityName;
        getSearchValue();
    } catch (error) {
        console.error(error.message);
    }
};

const getCityNameFromCoordinates = async (latitude, longitude) => {
    const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapAPIKey}`;

    try {
        const response = await axios.get(apiUrl);
        const cityData = response.data.features.find(
            (feature) => feature.place_type.includes("place")
            
        );

        if (cityData) {
            const cityName = cityData.text;
            return cityName;
        } else {
            throw new Error("City not found for the given coordinates.");
        }
    } catch (error) {
        throw new Error("Error fetching city information.");

    }

};

const clearText = () => {
    mapSearchResults.value = null;
    searchRequest.value = null;
    weatherInput.value.focus()

}

const inputFocus = () => {
    weatherInput.value.focus();

}

</script>

<style lang="scss" scoped>
    @import '../assets/scss/layout/main.scss';

</style>