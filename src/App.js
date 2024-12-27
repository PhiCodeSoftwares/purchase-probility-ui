import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {

  const [options, setOptions] = useState([]);
  const [observations, setObservations] = useState([]);
  const [probabilities, setProbabilities] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/options");
        setOptions(response.data.options); // Update to handle flat list
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleOptionChange = (option, position) => {
    console.log(option, position);

  setObservations((prev) => {
    let updatedObservations = [...prev];

    if (position % 2 === 0) {
      // Para posições pares
      const nextOption = options[position + 1];
      if (updatedObservations.includes(nextOption)) {
        // Se o próximo item está na lista, removê-lo
        updatedObservations = updatedObservations.filter((obs) => obs !== nextOption);
      }
      // Adicionar o item atual
      if (!updatedObservations.includes(option)) {
        updatedObservations.push(option);
      }
    } else {
      // Para posições ímpares
      const prevOption = options[position - 1];
      if (updatedObservations.includes(prevOption)) {
        // Se o item anterior está na lista, removê-lo
        updatedObservations = updatedObservations.filter((obs) => obs !== prevOption);
      }
      // Adicionar o item atual
      if (!updatedObservations.includes(option)) {
        updatedObservations.push(option);
      }
    }

      return updatedObservations;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setProbabilities(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/purchase_accuracy", {
        observation_sequence: observations.map((obs) => options.indexOf(obs)),
      });
      
      setProbabilities({
        purchase: response.data.probability_purchase,
        noPurchase: response.data.probability_no_purchase,
      });
    } catch (err) {
      setError("Failed to fetch probabilities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-600 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Purchase Probability Calculator
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Select your current situation to estimate the probability of making a purchase.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          
          <div>
            {options.map((option, pos) => (
              (pos % 2) === 0 && (
                <label
                  key={option}
                  className={`mt-4 block p-3 w-60 rounded-lg text-center cursor-pointer shadow ${
                    observations.includes(option)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  } hover:bg-blue-500 hover:text-white`}
                  onClick={() => handleOptionChange(option, pos)}
                >
                  {option}
                </label>
              )
            ))}
          </div>

          <div>
            {options.map((option, pos) => (
              (pos % 2) === 1 && (
                <label
                  key={option}
                  className={`mt-4 block p-3 w-60 rounded-lg text-center cursor-pointer shadow ${
                    observations.includes(option)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  } hover:bg-blue-500 hover:text-white`}
                  onClick={() => handleOptionChange(option, pos)}
                >
                  {option}
                </label>
              )
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
          disabled={loading}
        >
          {loading ? "Calculating..." : "Get Probability"}
        </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {probabilities && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
              Results
            </h2>
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-700 font-semibold">Purchase:</p>
              <p className="text-blue-600 font-bold">{(probabilities.purchase).toFixed(2)}%</p>
            </div>
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mt-2">
              <p className="text-gray-700 font-semibold">No Purchase:</p>
              <p className="text-red-600 font-bold">{(probabilities.noPurchase).toFixed(2)}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
