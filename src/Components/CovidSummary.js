import React from "react";
import Cards from "./Cards";
import NumberFormat from "react-number-format";

const CovidSummary = (props) => {
  console.log(props);
  const { totalRecovered, totalDeaths, totalConfirmed, country } = props;
  return (
    <div>
      <div>
        <h1 style={{ textTransform: "capitalize" }}>
          {country === "" ? "COVID-19 Tracker" : country}
        </h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Cards>
            <span>Total Confirmed</span>
            <br />
            <span>
              {
                <NumberFormat
                  value={totalConfirmed}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              }
            </span>
          </Cards>
          <Cards style={{ color: "blue" }}>
            <span>Total Recovered</span>
            <br />
            <span>
              {
                <NumberFormat
                  value={totalRecovered}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              }
            </span>
          </Cards>
          <Cards>
            <span>Deaths</span>
            <br />
            <span>
              {
                <NumberFormat
                  value={totalDeaths}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              }
            </span>
          </Cards>
        </div>
      </div>
    </div>
  );
};

export default CovidSummary;
