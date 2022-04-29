import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
    event.preventDefault();
    const value = event.target.value.trim();
    refs.countryList.innerHTML = '';
    if (value !== '') {
        onMurkupList(value);
    }
};
function createMurkupList(country) {
    const elMurkup = `<li class="country-list-item"><img src = '${country.flags.svg}' width = '30' alt=${country.name.common}>${country.name.common}</li>`;
    return elMurkup;
}

function createMurkupInfo(country) {
    const elMurkup = `<h2 class="country-info__title"><img class="country-info__flag" src="${country.flags.svg}" alt=${country.name.common}/>${country.name.common}</h2>
        <ul class="country-info__list">
          <li class="country-info__list-item">
            <span class="country-info__name">Capital: </span>${country.capital}
          </li>
          <li class="country-info__list-item">
            <span class="country-info__name">Population: </span>${country.population}
          </li>
          <li class="country-info__list-item">
            <span class="country-info__name">Languages: </span>${Object.values(country.languages).join(',')}
          </li>
        </ul>`;
    return elMurkup;
};

function onMurkupList(country) {
    fetchCountries(country).then(countries => {
        if (countries.length > 10) {
            Notify.info('Too many matches found. Please enter a more specific name.');
        }
        if (countries.length > 1 && countries.length <= 10) {
            const murkupList = countries.map(createMurkupList).join('');
            refs.countryList.insertAdjacentHTML('beforeend', murkupList);
        }if (countries.length === 1) {
            const murkupInfo = countries.map(createMurkupInfo).join('');
            refs.countryList.insertAdjacentHTML('beforeend', murkupInfo);
        }
    }).catch(error => {
        Notify.failure('Oops, there is no country with that name');
    })
};
