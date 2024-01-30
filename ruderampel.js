const LOADING_SPINNER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="50" height="50">
<circle cx="50" cy="50" fill="none" stroke="#000" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">
  <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1" />
</circle>
</svg>
`;

const WATER_LEVEL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50">
<!-- River -->
<path d="M10 50 Q 50 90, 90 50 Q 50 10, 10 50 Z" fill="#64B5F6" />
<!-- Water -->
<path d="M10 50 Q 50 70, 90 50 Q 50 30, 10 50 Z" fill="#2196F3" />
</svg>
`;

const TEMPERATURE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50">
<!-- Thermometer body -->
<rect x="40" y="10" width="20" height="80" fill="#757575" />
<!-- Temperature bulb -->
<circle cx="50" cy="90" r="15" fill="#F44336" />
<!-- Temperature line -->
<line x1="50" y1="20" x2="50" y2="90" stroke="#fff" stroke-width="3" />
</svg>
`;

const WIND_SPEED_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50">
<!-- Wind icon body -->
<circle cx="50" cy="50" r="45" fill="#90CAF9" />
<!-- Wind lines -->
<line x1="30" y1="50" x2="70" y2="50" stroke="#fff" stroke-width="5" />
<line x1="30" y1="40" x2="70" y2="60" stroke="#fff" stroke-width="5" />
<line x1="30" y1="60" x2="70" y2="40" stroke="#fff" stroke-width="5" />
</svg>
`;

const icons = {
    'water-level': WATER_LEVEL_ICON,
    'temperature': TEMPERATURE_ICON,
    'wind-speed': WIND_SPEED_ICON,
}

const initializeAmpel = () => {
    const el = document.createElement('div');
    el.classList.add('ampel');

    const color = document.createElement('p');
    color.classList.add('color');
    
    const text = document.createElement('p');
    text.classList.add('description');
    
    el.appendChild(color);
    el.appendChild(text);

    return {
        ampel: el,
        setAmpel: (state) => {
            color.classList.remove('green');
            color.classList.remove('red');
            color.classList.remove('yellow');
            color.classList.add(state);
            text.innerText = ampelColorToDescription(state);
        }
    }
};

const createMeasurement = (label, unit, value, iconName) => {
    const el = document.createElement('div');
    el.classList.add('measurement');
    
    const labelEl = document.createElement('p');
    labelEl.classList.add('label');
    labelEl.innerText = label;

    const valueEl = document.createElement('p');
    valueEl.classList.add('value');
        
    const valueText = document.createElement('span');
    valueText.innerText = value;
    valueEl.appendChild(valueText);

    const unitEl = document.createElement('span');
    unitEl.innerText = unit;
    valueEl.appendChild(unitEl);

    const icon = document.createElement('span');
    icon.innerHTML = icons[iconName];

    el.appendChild(icon);
    el.appendChild(labelEl);
    el.appendChild(valueEl);

    return {
        element: el,
        setValue: (newValue) => {
            valueText.innerText = newValue;
        }
    }
}

const initializeWaterLevel = () => {
    const el = createMeasurement('Wasserstand', 'cm', 0, 'water-level');
    return {
        waterLevel: el.element,
        setWaterLevel: el.setValue
    }
};

const initializeTemperature = () => {
    const el = createMeasurement('Temperatur', '°C', 0, 'temperature');
    return {
        temperature: el.element,
        setTemperature: el.setValue
    }
};

const initializeWind = () => {
    const el = createMeasurement('Wind', 'km/h', 0, 'wind-speed');
    return {
        wind: el.element,
        setWind: el.setValue
    }
};

const initializeLoadingSpinner = () => {
    const el = document.createElement('div');
    el.classList.add('loading-spinner');
    el.innerHTML = LOADING_SPINNER;
    return el;
}

const initializeElements = (container) => {
    const root = document.createElement('div');
    root.classList.add('ruderampel');
    container.appendChild(root);

    const { ampel, setAmpel } = initializeAmpel();
    root.appendChild(ampel);

    const measurements = document.createElement('div');
    measurements.classList.add('measurements');
    const { waterLevel, setWaterLevel } = initializeWaterLevel();
    measurements.appendChild(waterLevel);

    const { temperature, setTemperature } = initializeTemperature();
    measurements.appendChild(temperature);

    const { wind, setWind } = initializeWind();
    measurements.appendChild(wind);

    root.appendChild(measurements);

    const loadingSpinner = initializeLoadingSpinner();
    loadingSpinner.classList.add('hidden');
    root.appendChild(loadingSpinner);

    const setLoading = (loading) => {
        if (loading) {
            ampel.classList.add('hidden');
            measurements.classList.add('hidden');
            loadingSpinner.classList.remove('hidden');
        } else {
            ampel.classList.remove('hidden');
            measurements.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
        }
    }

    return {
        root,
        setLoading,
        setAmpel,
        setTemperature,
        setWaterLevel,
        setWind
    }
};

const ampelColorToDescription = (color) => {
    if (color === 'green') {
        return 'Der Ruderbetrieb ist möglich.';
    }
}

const computeAmpel = (waterLevel, temperature, windSpeed) => {
    return 'green';
}

const renderState = (state, elements) => {
    if (state.loading) {
        elements.setLoading(true);
    } else {
        elements.setLoading(false);
        elements.setTemperature(state.temperature);
        elements.setWaterLevel(state.waterLevel);
        elements.setWind(state.windSpeed);
        elements.setAmpel(computeAmpel(state.waterLevel, state.temperature, state.windSpeed));
    }
}

const initialState = {
    loading: true,
}

const WATER_LEVEL_URL = "https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/42900201.json?includeCurrentMeasurement=true&includeTimeseries=true";

const requestWaterLevel = async () => {
    try {
        const response = await fetch(WATER_LEVEL_URL);
        const data = await response.json();
        const timeseries = data?.timeseries;

        if (!timeseries) {
            console.warn("No timeseries found");
            return null;
        }

        const waterLevelMeasurement = timeseries.find((ts) => ts.shortname === "W");
        const waterLevelCm = waterLevelMeasurement?.currentMeasurement?.value;
        if (!waterLevelCm) {
            console.warn("No water level found");
            return null;
        }
        
        return waterLevelCm;
    } catch (e) {
        console.error(e);
        return null;
    }
}

const WEATHER_URL = "https://api.open-meteo.com/v1/forecast?latitude=51.4035&longitude=9.6320&current_weather=true";

const requestWeatherData = async () => {
    try {
        const response = await fetch(WEATHER_URL);
        const data = await response.json();
        const currentWeather = data?.current_weather;

        if (!currentWeather) {
            console.warn("No current weather found");
            return null;
        }

        const temperature = currentWeather?.temperature;
        const windSpeed = currentWeather?.windspeed;

        if (!temperature || !windSpeed) {
            console.warn("No temperature or wind speed found");
            return null;
        }
        
        return {
            temperature,
            windSpeed
        };
    } catch (e) {
        console.error(e);
        return null;
    }
}

const requestData = async () => {
    const waterLevel = await requestWaterLevel();
    const weatherData = await requestWeatherData();
    const windSpeed = weatherData?.windSpeed;
    const temperature = weatherData?.temperature;

    return {
        loading: false,
        windSpeed,
        waterLevel,
        temperature,
    }
}

const initialize = (container) => {
    const elements = initializeElements(container);
    let state = initialState;
    renderState(state, elements);
    
    requestData().then((newState) => {
        state = newState;
        renderState(state, elements);
    });
};

window.ruderampel = {
    initialize
};
