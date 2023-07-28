import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

interface FormData {
  carReg: string;
  startingPoint: string;
  destination: string;
}

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    carReg: '',
    startingPoint: '',
    destination: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(process.env.REACT_APP_API_URL!, formData);
      console.log(response.data); // Optional: Display the response data

      // Reset the form
      setFormData({
        carReg: '',
        startingPoint: '',
        destination: '',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="container">
      <h1 className="title">summer</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="carReg" className="label">
            Car Registration:
          </label>
          <input
            type="text"
            id="carReg"
            name="carReg"
            value={formData.carReg}
            onChange={handleChange}
            className="input"
          />
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
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default App;
