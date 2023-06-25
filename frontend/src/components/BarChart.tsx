import React from 'react';
import { CompareUser } from '../utils/types';

interface BarChartProps {
  person1Data: number[];
  //person2Data: number[];
}

const BarChart: React.FC<BarChartProps> = ({ person1Data}) => {
  const barStyles = {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '400px',
    width: '800px',
    padding: '5px',
    backgroundColor: '#2B2C3E',
    opacity: 0.8,
    zIndex: 2147483647,
  };

  const barItemStyles = {
    flex: '1 0 auto',
    marginRight: '5px',
  };


  const calculateMaxValue = (): number => {
    return Math.max(...person1Data);
  };

  const maxDataValue = 100; //calculateMaxValue();
  const scaleFactor = maxDataValue > 0 ? 100 / maxDataValue : 1;

//   const calculateMaxValue = (): number => {
//     const maxPerson1Value = Math.max(...person1Data);
//     //const maxPerson2Value = Math.max(...person2Data);
//     return Math.max(maxPerson1Value, maxPerson2Value);
//   };

  //const maxDataValue = 10;

  const getBarColor = (person1Value: number): string => {
    const scaledValue = person1Value * scaleFactor;

  if (scaledValue >= 10 &&  scaledValue < 25) {
    return '#42FF82';
  } else if (scaledValue >= 25 && scaledValue < 50) {
    return '#08A318';
  } else if (scaledValue >= 50) {
    return '#087E14';
  } else {
    return '#E4E4E4';
  }
    
  };
  

  const getXAxisLabelObject = (index: number): any => {
    //alert(person1Value);
    //var totalSolved = Math.floor(person1Value / 25);//person1Value / 25;
    //alert('totalSolved' + " " + totalSolved);
    switch (index) {
        case 0:
            return {range: "800 - 1200", bottom: 0, right: 14, color: "#CCCCCC"};
            break;
          // Code to execute when the value of value is equal to 1
          break;
        case 1: 
            return {range: "1200 - 1300", bottom: 0, right: 14, color:"#77FF78"};      
        case 2:
          //return "1400 - 1500";
          return {range: "1400 - 1500", bottom: 0, right: 14, color:"#77DDBB"};   
        case 3:
            //return "1600 - 1800";         
            return {range: "1600 - 1800", bottom: 0, right: 14, color: "#ABAAFF"};   
        case 4:
           // return "1900-2000"; 
            return {range: "1900-2000", bottom: 0, right: 14, color:"#FF88FF"};       
        case 5:
          //return "2100-2200";   
          return {range: "2000-2200", bottom: 0, right: 14, color:"#FFCC88"};    
        case 6:
          //return "2300";    
          return {range: "2300", bottom: 0, right: 30, color:"#FFBB55"};   
          case 7:
           // return "2400-2500";  
            return {range: "2400-2500", bottom: 0, right: 10, color:"#FF7777"};    
            case 8:
             // return "2600-3500";   
              return {range: "2600-3500", bottom: 0, right: 10, color:"#FF3333"};   
        default:
            return {range:"N/A",bottom: 0, right: 0, color:"#FFFFFF"};
      }
  };

  return (
    <div style={barStyles}>
      {person1Data.map((value, index) => {
        console.log(person1Data);
        const barColor = getBarColor(value);
        console.log(barColor);
        //const barHeight = Math.max((value / maxDataValue) * 100, 1); // Scale the height based on the maximum value
        const minBarHeight = 10; // Set your desired minimum height here
        const barHeight = Math.max(value * scaleFactor, minBarHeight);
        const XAxisLabelObject = getXAxisLabelObject(index);
        return (
          <div
          key={index}
          style={{
            ...barItemStyles,
            height: `${barHeight}%`,
            backgroundColor: barColor,
            display: 'flex',
            
          }}
        >
  <div style={{ position:'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
    <span style={{ color: "black", marginTop: "5px", textAlign: 'center' }}>{value}</span>
    <span style={{ position: 'absolute',
    bottom: -23,
    right:XAxisLabelObject.right , color: XAxisLabelObject.color, marginTop: "5px", textAlign: 'center',  fontSize: '12px', }}>{XAxisLabelObject.range}</span>
  </div>
        </div>
        );
      })}
    </div>
  );
};

export default BarChart;
