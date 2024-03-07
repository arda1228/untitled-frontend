import React, { useState } from 'react';
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
            <option value="normal">Normal</option>
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
    </div>
  );
};

export default App;
