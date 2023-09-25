<template>
    <header class="header">
        <div class="header__container flex">
            <a class="logo__box flex" href="https://the-weather-dashboard.vercel.app">
                <svg class="logo__img">
                    <use xlink:href="../../assets/images/icons.svg#logo"></use>
                </svg>
                <span class="logo__text">The Weather Dashboard</span>
            </a>
            <div class="header__menu flex">
                <div class="header__btn-group flex">
                    <button v-if="route.query.preview" @click="addCity" class="btn btn__success">
                        <span class="btn__icon"><i class=" icon fa-solid fa-plus"></i></span>
                        <span class="btn__text">add</span>
                    </button>
                    <button @click="toggleModal" class="btn btn__info" aria-label="Info">
                        <span class="btn__icon"><i class="icon fa-solid fa-circle-info fa-lg"></i></span>
                        <span class="btn__text">info</span>
                    </button>
                    <div class="btn-themes">
                        <input type="checkbox" id="switch" v-model="theme"/>
                        <label for="switch">Toggle</label>
                    </div>
                </div>
                <base-modal 
                    :modal-active="modalActive">
                    <div class="modal__content">
                        <h2 class="modal__title">About:</h2>
                        <p class="modal__text">
                            The weather dashboard allows you to track the current and the future weather of the city of your choice. 
                        </p>
                        <h3 class="modal__title">How it works:</h3>
                        <ol class="modal__list">
                            <li class="modal__list-item">
                                Find your city by entering the name in the search bar field or click the "<span><i class="fa-solid fa-location-crosshairs"></i></span>"  icon to find your current location. 
                            </li>
                            <li class="modal__list-item">
                                Select a city from results and you will get information about current weather in this area. 
                            </li>
                            <li class="modal__list-item">
                                Track the city by clicking on the "<span><i class="fa-solid fa-plus"></i></span>" button in the top right. This will save the information to view later on your home page.
                            </li>
                        </ol>
                        <h3 class="modal__title">Removing a city</h3>
                        <p class="modal__text">
                            If you no longer wish to track a city, then select it within the home page. At the bottom of the page, there will be am option to delete the city.
                        </p>
                        <button class="modal__btn btn btn__info" @click="toggleModal">
                            <span class="btn__icon"><i class="fa-solid fa-xmark"></i></span>Close
                        </button>
                    </div>
                </base-modal>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, watch, onBeforeMount } from 'vue';
import { uid } from 'uid';
import { useRoute, useRouter } from 'vue-router';
import BaseModal from '../UI/BaseModal.vue';

const route = useRoute();
const router = useRouter();

const savedCities = ref([]);

//function that allows you to add a city to local storage
const addCity = () => {
    if (localStorage.getItem('savedCities')) {
        savedCities.value = JSON.parse(localStorage.getItem('savedCities'));
    }

    const localtionObj = {
        id: uid(),
        country: route.params.country,
        city: route.params.city,
        coords: {
            lat: route.query.lat,
            lng: route.query.lng,

        }

    }

    savedCities.value.push(localtionObj);

    localStorage.setItem('savedCities', JSON.stringify(savedCities.value));

//remove "preview" from url
    let query = Object.assign({}, route.query);
    delete query.preview;
    query.id = localtionObj.id;
    router.replace({ query });

};

//modal window
const modalActive = ref(false);

const toggleModal = () => {
    modalActive.value = !modalActive.value;

};

//theme swap
const theme = ref(null);

watch(theme, (newVal) => {
    console.log(newVal);
    if (newVal === true) {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        theme.value = true;

    } else {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        theme.value = false;

    }

});

onBeforeMount(() => {
    theme.value = localStorage.getItem('theme') === 'dark';
});

</script>

<style lang="scss" scoped>
    @import '../../assets/scss/layout/header.scss';
    
</style>