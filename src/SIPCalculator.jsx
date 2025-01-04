import React, { useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { FaRupeeSign } from "react-icons/fa";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

Chart.register(...registerables);

const SIPCalculator = () => {
  const [sipAmount, setSipAmount] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(10);
  const [lumpSum, setLumpSum] = useState(0);
  const [stepUp, setStepUp] = useState(0);
  const [inflationRate, setInflationRate] = useState(0);
  const [darkMode, setDarkMode] = useState(true);

  const calculateSIP = () => {
    const monthlyRate = annualReturn / 100 / 12;
    const months = years * 12;
    let futureValue = 0;
    let sip = sipAmount;
    let yearlyIncrement = 1 + stepUp / 100;
    let totalInvested = 0;

    for (let i = 0; i < months; i++) {
      if (i % 12 === 0 && i !== 0) sip *= yearlyIncrement;
      futureValue = (futureValue + sip) * (1 + monthlyRate);
      totalInvested += sip;
    }

    const lumpSumFuture = lumpSum * Math.pow(1 + annualReturn / 100, years);
    const adjustedFutureValue =
      (futureValue + lumpSumFuture) / Math.pow(1 + inflationRate / 100, years);
    const totalInterest = futureValue + lumpSumFuture - (totalInvested + lumpSum);

    return { futureValue, lumpSumFuture, adjustedFutureValue, totalInvested, totalInterest };
  };

  const { futureValue, lumpSumFuture, adjustedFutureValue, totalInvested, totalInterest } = calculateSIP();

  const chartData = {
    labels: Array.from({ length: years }, (_, i) => i + 1),
    datasets: [
      {
        label: "Investment Growth",
        data: Array.from({ length: years }, (_, i) => calculateSIP().futureValue / (i + 1)),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
      },
    ],
  };

  const donutData = {
    labels: ["Total Invested", "Total Interest"],
    datasets: [
      {
        data: [totalInvested, totalInterest],
        backgroundColor: ["#4CAF50", "#FF6384"],
      },
    ],
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
        }`}
    >
      <div
        className={`w-full max-w-4xl p-6 shadow-lg rounded-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          } flex flex-col md:flex-row gap-6`}
      >
        <div className="w-full md:w-1/2 p-5">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-green-600">SIP Calculator</h2>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-2xl text-green-600 dark:text-yellow-400"
            >
              {darkMode ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <label>SIP Amount (₹):</label>
              <FaRupeeSign />
            </div>
            <input
              type="number"
              value={sipAmount}
              onChange={(e) => setSipAmount(e.target.value)}
              className={`border p-2 w-full ${darkMode ? "dark:bg-gray-700 dark:text-white" : "bg-gray-50 text-black"
                }`}
            />

            <label>Annual Return (%):</label>
            <input
              type="number"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(e.target.value)}
              className={`border p-2 w-full ${darkMode ? "dark:bg-gray-700 dark:text-white" : "bg-gray-50 text-black"
                }`}
            />

            <label>Investment Duration (Years):</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className={`border p-2 w-full ${darkMode ? "dark:bg-gray-700 dark:text-white" : "bg-gray-50 text-black"
                }`}
            />

            <label>Initial Lump Sum (₹):</label>
            <input
              type="number"
              value={lumpSum}
              onChange={(e) => setLumpSum(e.target.value)}
              className={`border p-2 w-full ${darkMode ? "dark:bg-gray-700 dark:text-white" : "bg-gray-50 text-black"
                }`}
            />

            <label>Annual Step-Up (%):</label>
            <input
              type="number"
              value={stepUp}
              onChange={(e) => setStepUp(e.target.value)}
              className={`border p-2 w-full ${darkMode ? "dark:bg-gray-700 dark:text-white" : "bg-gray-50 text-black"
                }`}
            />

            <label>Inflation Rate (%):</label>
            <input
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(e.target.value)}
              className={`border p-2 w-full ${darkMode ? "dark:bg-gray-700 dark:text-white" : "bg-gray-50 text-black"
                }`}
            />
          </div>
        </div>

        <div
          className={`w-full md:w-1/2 p-5 flex flex-col justify-center items-center ${darkMode ? "bg-gray-700 text-white" : "bg-green-50 text-black"
            } rounded-lg text-center`}
        >
          <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">
            Future Value: ₹{futureValue.toFixed(2)}
          </h3>
          <h3 className="text-lg text-gray-700 dark:text-gray-300">
            Lump Sum Future Value: ₹{lumpSumFuture.toFixed(2)}
          </h3>
          <h3 className="text-lg text-gray-700 dark:text-gray-300">
            Inflation Adjusted: ₹{adjustedFutureValue.toFixed(2)}
          </h3>
          <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">
            Total Invested: ₹{totalInvested.toFixed(2)}
          </h3>
          <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
            Total Interest Earned: ₹{totalInterest.toFixed(2)}
          </h3>
        </div>
      </div>

      <div className="mt-5 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          className={`shadow-lg rounded-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            } p-4`}
        >
          <Line data={chartData} options={{ maintainAspectRatio: false }} height={300} />
        </div>
        <div
          className={`shadow-lg rounded-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            } p-4`}
        >
          <Doughnut data={donutData} options={{ maintainAspectRatio: false }} height={300} />
        </div>
      </div>

      {/* SIP Calculation Explanation */}
      <div className="mt-5 ">
        <h3 className="text-xl font-semibold mb-3">How We Calculate SIP?</h3>
        <p>
          The future value of an SIP investment is calculated using the formula:
        </p>
        <p className="mt-2 font-mono">FV = P × [( (1 + r)^n - 1 ) / r] × (1 + r)</p>
        <ul className="mt-3 list-disc list-inside">
          <li><strong>FV</strong> = Future Value</li>
          <li><strong>P</strong> = Monthly SIP Amount</li>
          <li><strong>r</strong> = Monthly Rate of Return (Annual Return / 12 / 100)</li>
          <li><strong>n</strong> = Number of Months</li>
        </ul>
        <p className="mt-3">Lump sum future value is calculated using:</p>
        <p className="font-mono">FV = P × (1 + r)^n</p>
        <p className="mt-3">We also adjust for inflation using:</p>
        <p className="font-mono">Inflation Adjusted Value = FV / (1 + Inflation Rate)^n</p>
      </div>

    </div>
  );
};

export default SIPCalculator;
