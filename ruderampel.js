const LOADING_SPINNER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="50" height="50">
<circle cx="50" cy="50" fill="none" stroke="#000" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">
  <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1" />
</circle>
</svg>
`;

const initializeAmpel = () => {
    const el = document.createElement('div');
    el.classList.add('ampel');

    return {
        ampel: el,
        setAmpel: (state) => {}
    }
};

const createMeasurement = (label, unit, value) => {
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
    const el = createMeasurement('Wasserstand', 'cm', 0);
    return {
        waterLevel: el.element,
        setWaterLevel: el.setValue
    }
};

const initializeTemperature = () => {
    const el = createMeasurement('Temperatur', '°C', 0);
    return {
        temperature: el.element,
        setTemperature: el.setValue
    }
};

const initializeWind = () => {
    const el = createMeasurement('Wind', 'km/h', 0);
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

const renderState = (state, elements) => {
    if (state.loading) {
        elements.setLoading(true);
    } else {
        elements.setLoading(false);
    }
}

const initialState = {
    loading: true,
}

const requestData = async () => {
   return initialState;
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
