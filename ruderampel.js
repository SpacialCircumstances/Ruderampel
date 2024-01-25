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

    return {
        root,
        setAmpel,
        setTemperature,
        setWaterLevel,
        setWind
    }
};

const initialize = (container) => {
    let state = initializeElements(container);
};

window.ruderampel = {
    initialize
};
