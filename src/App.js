import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import logo from "./images/logo.png";

const App = () => {
  const [options, setOptions] = useState([]);
  const [observations, setObservations] = useState([]);
  const [probabilities, setProbabilities] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("en");
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(
          `https://purchase-probability-api-1.onrender.com/api/options?language=${language}`
        );
        setOptions(response.data.options);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, [language]);

  const handleOptionChange = (option, position) => {
    setObservations((prev) => {
      let updatedObservations = [...prev];

      if (position % 2 === 0) {
        const nextOption = options[position + 1];
        if (updatedObservations.includes(nextOption)) {
          updatedObservations = updatedObservations.filter((obs) => obs !== nextOption);
        }
        if (!updatedObservations.includes(option)) {
          updatedObservations.push(option);
        }
      } else {
        const prevOption = options[position - 1];
        if (updatedObservations.includes(prevOption)) {
          updatedObservations = updatedObservations.filter((obs) => obs !== prevOption);
        }
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
      const response = await axios.post(
        "https://purchase-probability-api-1.onrender.com/api/purchase_accuracy",
        {
          observation_sequence: observations.map((obs) => options.indexOf(obs)),
        }
      );

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
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96">
            <div className="text-center mb-4">
              <img 
                src={logo} 
                alt="Logo" 
                className="mx-auto h-12 md:h-16" 
              />
            </div>
            <p className="text-gray-700 mb-4 text-justify">
              {language === "en"
                ? "This application estimates the probability of making a purchase based on your current situation. However, the final decision to make a purchase lies entirely with you, and we are not responsible for any purchases made based on the app's suggestions."
                : "Este aplicativo estima a probabilidade de realizar uma compra com base em sua situação atual. No entanto, a decisão final de realizar uma compra é totalmente sua, e não nos responsabilizamos por nenhuma compra feita com base nas sugestões do aplicativo."}
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleCloseModal}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                {language === "en" ? "Understood" : "Entendido"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-auto items-center justify-center">
        <div className="text-center mb-4">
          <img 
            src={logo} 
            alt="Logo" 
            className="mx-auto h-28 md:h-32"
          />
        </div>
        <p className="text-gray-600 text-center mb-6">
          {language === "en"
            ? "Select your current situation to estimate the probability of making a purchase."
            : "Selecione sua situação atual para estimar a probabilidade de realizar uma compra."}
        </p>

        <div className="mb-4 text-center flex justify-center space-x-4">
          <button
            onClick={() => setLanguage("en")}
            className={`px-4 py-2 rounded ${language === "en" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("pt-br")}
            className={`px-4 py-2 rounded ${language === "pt-br" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}
          >
            PT-BR
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 items-center justify-items-center">
          {options.map((option, pos) => (
            <label
              key={option}
              className={`mt-4 block p-3 w-full sm:w-60 rounded-lg text-center cursor-pointer shadow ${
                observations.includes(option) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
              } hover:bg-blue-500 hover:text-white`}
              onClick={() => handleOptionChange(option, pos)}
            >
              {option}
            </label>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin mr-2" />
              {language === "en" ? "Calculating..." : "Calculando..."}
            </div>
          ) : (
            language === "en" ? "Get Probability" : "Obter Probabilidade"
          )}
        </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {probabilities && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
              {language === "en" ? "Results" : "Resultados"}
            </h2>
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-700 font-semibold">{language === "en" ? "Purchase:" : "Compra:"}</p>
              <p className="text-blue-600 font-bold">{(probabilities.purchase).toFixed(2)}%</p>
            </div>
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mt-2">
              <p className="text-gray-700 font-semibold">{language === "en" ? "No Purchase:" : "Não Compra:"}</p>
              <p className="text-red-600 font-bold">{(probabilities.noPurchase).toFixed(2)}%</p>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-gray-700">
            {language === "en" ? "Developer by " : "Desenvolvido por "}
            <a
              href="https://www.linkedin.com/in/igor-santos-8383941a6/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Igor Santos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
