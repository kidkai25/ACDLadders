import { ProblemStatusMap, UserData, UserStats } from "../utils/types";
import React, { useEffect, useState } from "react";
import "./Comparer.css";
import * as d3 from "d3";
import BarChart from "./BarChart";

function Comparer(props: { problemStatusMap: ProblemStatusMap,userData: UserData; userStats: UserStats, isChecked: boolean }){
    const { problemStatusMap, userData, userStats, isChecked } = props;
    const [showModal, setShowModal] = useState(isChecked);

    //alert(isChecked);
    const handleOpenModal = () => {
      setShowModal(true);
    };

    useEffect(() => {
        // This code will be run after the component has been rendered
        if (isChecked !== showModal) {
          setShowModal(isChecked);
        }

        const handleKeyDown = (event: { key: string; }) => {
          if (event.key === 'Escape') {
            handleCloseModal();
          }
        };
        document.addEventListener('keydown', handleKeyDown);

      }, [isChecked]);
  
    const handleCloseModal = () => {
      setShowModal(false);
    };

    const users = [
        { name: "User1", problemsSolved: 150 },
        { name: "User2", problemsSolved: 200 },
        { name: "User3", problemsSolved: 100 },
        { name: "User4", problemsSolved: 180 },
        { name: "User5", problemsSolved: 120 }
      ];
  


    //CHART
// Sample user data
console.log(userData);
//const person1Data :number[] = new Array(9);
const person1Data = [70, 10, 25, 9, 99, 33,21,8];
// Iterate over the data array and count the items for each rating range
//problemStatusMap.forEach(item => {
//  const rating = item.problem.rating;
//  const verdict = item.verdict;

//  if (rating >= 800 && rating <= 900 && verdict === "OK") {
//    person1Data[0]++;
//  } else if (rating >= 900 && rating <= 1000 && verdict === "OK") {
//    person1Data[1]++;
//  } else if (rating >= 1000 && rating <= 1100 && verdict === "OK") {
//    person1Data[2]++;
//  }
//});


    if (!isChecked) return <div><h1>No data</h1></div>;
    return (
       <div>
        {showModal && (
        <div className= "modal">
          <div className= "modalContent">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            {/* <p>Modal content goes here</p> */}
            <div>
      {/* <h1>Simple Bar Chart Example</h1> */}
       <BarChart person1Data={person1Data}/>
    </div>
          </div>
        </div>
      )}
      </div>    
    );
}

export default Comparer;
