// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

export default function AppCurrency() {
  const [base, setBase] = useState("EUR");
  const [target, setTarget] = useState("USD");
  const [amount, setAmount] = useState(1);
  const [output, setOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      async function convertCurrency() {
        setIsLoading(true);
        try {
          const res = await fetch(
            `https://api.frankfurter.app/latest?${amount}=100&from=${base}&to=${target}`
          );
          if (!res.ok) throw new Error(`Fetching problem!`);
          const data = await res.json();
          console.log(data.rates[target]);
          setOutput(data.rates[target]);
        } catch (err) {
          console.log(err);
        } finally {
          console.log("finally");
        }
        setIsLoading(false);
      }
      if (base === target) return setOutput(amount);
      convertCurrency();
    },
    [amount, base, target]
  );

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value);
        }}
      />
      <select
        value={base}
        onChange={(e) => setBase(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>{output * amount}</p>
    </div>
  );
}
