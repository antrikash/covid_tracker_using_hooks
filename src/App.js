import React, { useState, useEffect } from "react";

import "./styles.css";

import LineGraph from "./Components/LineGraph";
import CovidSummary from "./Components/CovidSummary";
import axios from "axios";
export default function App() {
  const [totalConfirmed, setTotalConfirmed] = useState(0);
  const [totalRecovered, setTotalRecovered] = useState(0);
  const [totalDeaths, setTotalDeaths] = useState(0);
  const [loading, setLoading] = useState(false);
  const [covidSummary, setCovidSummary] = useState({});
  const [country, setCountry] = useState();
  const [days, setDays] = useState(7);
  const [coronaCountAr, setCoronaCountAr] = useState([]);
  const [label, setLabel] = useState([]);

  //ComponentDidMount
  useEffect(() => {
    setLoading(true);
    axios
      .get("https://api.covid19api.com/summary")
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          setTotalConfirmed(res.data.Global.NewConfirmed);
          setTotalRecovered(res.data.Global.NewRecovered);
          setTotalDeaths(res.data.Global.NewDeaths);
          setCovidSummary(res.data);
        }
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  if (loading) {
    return "Fetching data from api...!";
  }

  //handlers

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const _date = d.getDate();
    return `${year}-${month}-${_date}`;
  };

  const countrieshandler = (e) => {
    setCountry(e.target.value);
    const d = new Date();
    const to = formatDate(d);
    const from = formatDate(d.setDate(d.getDate() - days));

    getCoronaReportByDateRange(e.target.value, from, to);
  };

  const daysHandler = (e) => {
    setDays(e.target.value);
    const d = new Date();
    const to = formatDate(d);
    const from = formatDate(d.setDate(d.getDate() - e.target.value));

    getCoronaReportByDateRange(e.target.value, from, to);
  };

  const getCoronaReportByDateRange = (countrySlug, from, to) => {
    axios
      .get(
        `https://api.covid19api.com/country/${countrySlug}/status/confirmed?from=${from}T00:00:00Z&to=${to}T00:00:00Z`
      )
      .then((res) => {
        console.log(res);
        const yAxisCoronaCount = res.data.map((d) => d.Cases);
        const xAxisLabel = res.data.map((d) => d.Date);
        const covidDetails = covidSummary.Countries.find(
          (country) => country.Slug === countrySlug
        );

        setCoronaCountAr(yAxisCoronaCount);
        setTotalConfirmed(covidDetails.TotalConfirmed);
        setTotalRecovered(covidDetails.TotalRecovered);
        setTotalDeaths(covidDetails.TotalDeaths);
        setLabel(xAxisLabel);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="App">
      <CovidSummary
        totalRecovered={totalRecovered}
        totalDeaths={totalDeaths}
        totalConfirmed={totalConfirmed}
        country={country}
      />
      <div>
        <select value={country} onChange={countrieshandler}>
          <option value="">Select an option</option>
          {covidSummary.Countries &&
            covidSummary.Countries.map((country) => (
              <option key={country.Slug} value={country.Slug}>
                {country.Country}
              </option>
            ))}
        </select>
        <select value={days} onChange={daysHandler}>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>
      <LineGraph yAxis={coronaCountAr} label={label} />
    </div>
  );
}
