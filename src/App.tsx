import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface FormData {
  carSize: string;
  fuelType: string;
  startingPoint: string;
  destination: string;
  fuelEfficiency: string; // New field for fuel efficiency in kilometers per litre
  yearlyInsurance: string; // New field for yearly insurance price
}

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    carSize: '',
    fuelType: '',
    startingPoint: '',
    destination: '',
    fuelEfficiency: '',
    yearlyInsurance: '',
  });

  const [responseMessage, setResponseMessage] = useState<string>('');
  const [error, setError] = useState<string>(''); // Add error state

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false); // State to manage advanced options visibility
  const [showFooter, setShowFooter] = useState(false); // State to manage footer visibility

  useEffect(() => {
    // Set showFooter to true after the initial render to display the footer initially
    setShowFooter(false);
  }, []);

  const validatePostcode = async (postcode: string) => {
    try {
      const response = await axios.get(`https://api.postcodes.io/postcodes/${postcode}/validate`);
      return response.data.result;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if required fields are filled
    if (!formData.carSize || !formData.fuelType || !formData.startingPoint || !formData.destination) {
      setError('Please fill in all required fields.');
      return;
    } else {
      setError(''); // Clear the error if all required fields are filled
    }

    // Check if the startingPoint and destination are valid postcodes
    const isStartingPointValid = await validatePostcode(formData.startingPoint);
    const isDestinationValid = await validatePostcode(formData.destination);

    if (!isStartingPointValid || !isDestinationValid) {
      setError('Please enter valid postcodes for starting point and destination.');
      return;
    } else {
      setError(''); // Clear the error if valid postcodes are provided
    }

    // Validate fuelEfficiency and yearlyInsurance fields
    if (isNaN(Number(formData.fuelEfficiency)) || isNaN(Number(formData.yearlyInsurance))) {
      setError('Fuel efficiency and yearly insurance must be numeric values.');
      return;
    } else {
      setError(''); // Clear the error if fuelEfficiency and yearlyInsurance are numeric
    }

    try {
      const response = await axios.post(process.env.REACT_APP_API_URL!, formData);
      setResponseMessage(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleAdvancedOptions = () => {
    setShowAdvancedOptions((prevShowAdvancedOptions) => !prevShowAdvancedOptions);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleToggleFooter = () => {
    setShowFooter(prevShowFooter => !prevShowFooter);
  };

  return (
    <div className="container">
      <h1 className="title">A Cloud-Native Web Application to Reduce Car Dependency</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="carSize" className="label">
            Car Size:
          </label>
          <select
            id="carSize"
            name="carSize"
            value={formData.carSize}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select Car Size</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="fuelType" className="label">
            Fuel Type:
          </label>
          <select
            id="fuelType"
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select Fuel Type</option>
            <option value="gasoline">Gasoline</option>
            <option value="diesel">Diesel</option>
            <option value="electricity">Electricity</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="startingPoint" className="label">
            Starting Postcode:
          </label>
          <input
            type="text"
            id="startingPoint"
            name="startingPoint"
            value={formData.startingPoint}
            onChange={handleChange}
            className="input"
            placeholder="e.g. RG10 9NY"
          />
        </div>
        <div className="form-group">
          <label htmlFor="destination" className="label">
            Destination Postcode:
          </label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            className="input"
            placeholder="e.g. RG10 9NY"
          />
        </div>

        <button
          className="toggle-button"
          onClick={handleToggleAdvancedOptions}
          style={{ marginBottom: '16px' }} // Add margin to the bottom
        >
          {showAdvancedOptions ? 'Hide Advanced Options ▲' : 'Show Advanced Options ▼'}
        </button>

        {showAdvancedOptions ? ( // Show additional fields if showAdvancedOptions is true
          <div>
            <div className="form-group">
              <label htmlFor="fuelEfficiency" className="label">
                Fuel Efficiency (KM per Litre or kWh):
              </label>
              <input
                type="text"
                id="fuelEfficiency"
                name="fuelEfficiency"
                value={formData.fuelEfficiency}
                onChange={handleChange}
                className="input"
                placeholder="e.g. 43"
              />
            </div>
            <div className="form-group">
              <label htmlFor="yearlyInsurance" className="label">
                Yearly Insurance Price (£):
              </label>
              <input
                type="text"
                id="yearlyInsurance"
                name="yearlyInsurance"
                value={formData.yearlyInsurance}
                onChange={handleChange}
                className="input"
                placeholder="e.g. 800"
              />
            </div>
          </div>
        ) : null}

        <button type="submit" className="submit-btn">
          Submit
        </button>
        {error && <div className="error-message">{error}</div>} {/* Display error message */}
      </form>

      {responseMessage && <p className="response-message">{responseMessage}</p>}

      {/* Toggle button for the footer */}
      <button className="toggle-footer-button" onClick={handleToggleFooter}>
        {showFooter ? 'Close ▲' : 'How did we get these estimates? ▼'}
      </button>

      {/* Footer */}
      {showFooter && (
        <footer className={showFooter ? 'footer' : 'footer-hidden'}>
          <p>
            <strong>Estimate Information</strong>
            <br />
            This web application estimates the cost of a car journey based on the car size, fuel type,
            starting and destination postcodes, fuel efficiency, and yearly insurance price.
            <br />
            <br />
            The application uses the following formula to estimate the cost of the journey by car:
            <br />
            <br />
            <strong>
              Cost (£) = (Fuel Needed * Fuel Price (£/Litre)) + (Yearly Insurance (£) / 365) + (MOT Price (£) / 365)
              + (Road Tax (£) / 365) + (Depreciation (£) / 365)

            </strong>
            <br />
            <br />
            Where:
            <br />
            <strong>Fuel Needed</strong> is the driving distance between the starting and destination postcodes, measured by the <a href="https://travelco2.com/documentation">CO2 API</a>, divided by the fuel efficiency (which can be changed in the advanced options) in kilometers per litre or kWh, depending on the fuel type and car size.
            <br />
            <strong>Fuel Price</strong> is the price of fuel for the selected fuel type, which is obtained using the price of the chosen fuel (petrol[E10]/diesel[B7]) at the nearest Sainsbury's fuel station to the starting postcode. The electricity price is set to a default value of £0.163 per kWh.
            <br />
            <strong>Yearly Insurance</strong> is the yearly insurance price, which is set to a default value of £561, and adjusted depending on car size and fuel type. This can be changed in the advanced options.
            <br />
            <strong>MOT Price</strong> is the yearly MOT price, which is set to a default value of £41.50 and adjusted depending on car size. Larger cars have higher MOT prices.
            <br />
            <strong>Road Tax</strong> is the yearly road tax price, which is set to a default value of £180 and adjusted depending on car size. Larger cars have higher road tax prices.
            <br />
            <strong>Depreciation</strong> is the yearly depreciation price, which is set to a default value of 15% (the average yearly depreciation) of £17,641 (the average car price).
            <br />


            <br />
            The application uses the following formula to estimate the cost of the journey by public transport:
            <br />
            <br />
            <strong>
              Cost (£) = Driving Distance (KM) * 0.175
            </strong>
            <br />
            <br />
            Where:
            <br />
            <strong>Driving Distance</strong> is the driving distance between the starting and destination postcodes, measured by the <a href="https://travelco2.com/documentation">CO2 API</a>. The cost is calculated by multiplying the driving distance by 0.175, which was estimated as the average cost per kilometre for public transport in the UK.
            <br />


            <br />
            The application uses the <a href="https://travelco2.com/documentation">CO2 API</a> to estimate the emissions of the journey by public transport compared to driving.
            <br />


            <br />
            The application uses the <a href="https://postcodes.io/">Postcodes.io</a> API to validate
            the starting and destination postcodes and to calculate the distance between the
            postcodes.
            <br />
            The application uses the <a href="https://api.sainsburys.co.uk/v1/exports/latest/fuel_prices_data.json">Sainsbury's Fuel Price API</a> to get the
            current fuel price for the selected fuel type.

            <br />

            <br />
            <strong>Author:</strong> Arda Dogan, Loughborough University
            <br />

          </p>
          <button className="close-footer-button" onClick={handleToggleFooter}>
            Close &#10006;
          </button>
        </footer>
        )}
    </div>
  );
};

export default App;
