import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

interface FormData {
  carSize: string;
  fuelType: string;
  startingPoint: string;
  destination: string;
  fuelPrice: string; // New field for fuel price per litre
  fuelEfficiency: string; // New field for fuel efficiency in kilometers per litre
  yearlyInsurance: string; // New field for yearly insurance price
}

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    carSize: '',
    fuelType: '',
    startingPoint: '',
    destination: '',
    fuelPrice: '', // Initialize new fields
    fuelEfficiency: '',
    yearlyInsurance: '',
  });

  const [responseMessage, setResponseMessage] = useState<string>('');
  const [dadJoke, setDadJoke] = useState<string>('');

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false); // State to manage advanced options visibility

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(process.env.REACT_APP_API_URL!, formData);
      setResponseMessage(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFetchDadJoke = async () => {
    try {
      const response = await axios.get('https://icanhazdadjoke.com/', {
        headers: {
          Accept: 'application/json',
        },
      });
      setDadJoke(response.data.joke);
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
      <h1 className="title">pt vs. DRIVING</h1> 
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
            <option value="normal">Normal</option>
            <option value="small">Small</option>
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
            Starting Point:
          </label>
          <input
            type="text"
            id="startingPoint"
            name="startingPoint"
            value={formData.startingPoint}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="destination" className="label">
            Destination:
          </label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            className="input"
          />
        </div>

        {showAdvancedOptions ? ( // Show additional fields if showAdvancedOptions is true
          <div>
            <div className="form-group">
              <label htmlFor="fuelPrice" className="label">
                Fuel Price per Litre:
              </label>
              <input
                type="text"
                id="fuelPrice"
                name="fuelPrice"
                value={formData.fuelPrice}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="fuelEfficiency" className="label">
                Fuel Efficiency (km per litre):
              </label>
              <input
                type="text"
                id="fuelEfficiency"
                name="fuelEfficiency"
                value={formData.fuelEfficiency}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="yearlyInsurance" className="label">
                Yearly Insurance Price:
              </label>
              <input
                type="text"
                id="yearlyInsurance"
                name="yearlyInsurance"
                value={formData.yearlyInsurance}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
        ) : null}

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>

      <button onClick={handleToggleAdvancedOptions}>
        {showAdvancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
      </button>

      <button onClick={handleFetchDadJoke}>Get Dad Joke</button>
      {dadJoke && <p className="dad-joke">{dadJoke}</p>}
      {responseMessage && <p className="response">{responseMessage}</p>}
    </div>
  );
};

export default App;