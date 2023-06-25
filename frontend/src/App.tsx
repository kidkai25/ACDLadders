import React, { useEffect, useState } from "react";

import {
  LadderData,
  ProblemStatusMap,
  UserData,
  UserStats,
} from "./utils/types";
import httpClient from "./utils/http";
import { constants } from "./utils/constants";

import UserCard from "./components/UserCard";
import Header from "./components/Header";
import Ladder from "./components/Ladder";

import LadderSelector from "./components/LadderSelector";
import {
  assignNewStatus,
  fetchUserSubmissionsWithRetry,
  getProblemID,
} from "./utils/utils";
import Footer from "./components/Footer";

import { toast } from "react-toastify";
import Comparer from "./components/Comparer";

function App() {
  const [user, setUser] = useState<string>("");
  const [userData, setUserData] = useState<UserData>(null);
  const [userStats, setUserStats] = useState<UserStats>(null);
  const [ladderData, setLadderData] = useState<LadderData>({
    startRating: 1200,
    endRating: 1300,
  });
  const [problemStatusMap, setProblemStatusMap] = useState<ProblemStatusMap>(
    {}
  );
  const [fetchIntervalID, setfetchIntervalID] = useState<NodeJS.Timer | null>(
    null
  );

  const [selected, setSelected] = useState(1200);

  const [tag, setTag] = useState(false);

  const [isChecked, setChecked] = useState(false); 


  const loadUser = async () => {
    try {
      const userDataRes = await httpClient.request({
        method: "GET",
        url: `${constants.cfAPI}/user.info`,
        params: {
          handles: user,
          lang: "en",
        },
      });
      const userInfo = userDataRes.result[0];
      console.log(userInfo);
      setUserData({
        handle: userInfo.handle,
        image: userInfo.avatar,
        maxRating: userInfo.maxRating,
        rating: userInfo.rating,
        rank: userInfo.rank,
      });

      const startR = Math.floor(userInfo.rating / 100) * 100 + 200;

      setLadderData({
        startRating: startR,
        endRating: startR + 100,
      });

      setSelected(startR);
      toast.success("CF Handle found 😊");
    } catch (err: any) {
      toast.error("CF Handle not Found Try again");
    }
  };

  const updateProblemStatusMap = async (userData: UserData) => {
    let newMap = {} as ProblemStatusMap;
    const submissions = await fetchUserSubmissionsWithRetry(userData, 3);
    for (const submission of submissions) {
      const problem = { ...submission.problem };
      const id = getProblemID(problem);
      newMap[id] = assignNewStatus(newMap[id], submission.verdict);
    }
    setProblemStatusMap(newMap);
  };

  useEffect(() => {
    if (!userData) return;
    setProblemStatusMap({});
    if (fetchIntervalID) {
      clearInterval(fetchIntervalID);
    }
    updateProblemStatusMap(userData);
    const newFetchIntervalID = setInterval(
      () => updateProblemStatusMap(userData),
      constants.submissionFetchInterval
    );
    setfetchIntervalID(newFetchIntervalID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  




  return (
    <div className="w-full bg-color">
      <Header heading="ACD Ladders!" />
      <div className="w-full p-3 md:p-10">
        <div className="w-full top-row flex flex-col-reverse justify-between md:flex-row sticky top-0 z-10 bg-[#2b2c3e] pt-2">
          <LadderSelector
            showRating={10}
            startRating={900}
            endRating={3600}
            step={100}
            setLadderData={setLadderData}
            ladderData={ladderData}
            selected={selected}
            setSelected={setSelected}
          />

          <div className="w-full md:w-3/5 flex flex-row justify-between py-2 md:px-10 md:justify-center">
            <div className="search-bar relative w-auto justify-between mx-2">
              <input
                className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5  font-normal text-gray-100 bg-slate-900 rounded-full transition ease-in-outfocus:text-gray-100 "
                placeholder="CF Handle"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") loadUser();
                }}
              />
              <button type="submit" className="search-button" onClick={loadUser}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.0649 3.85876C15.7041 4.93518 13.4993 7.5813 12.4504 11.7971C10.8772 18.1208 8.92749 18.9272 2.57996 16.678C4.85962 20.8887 9.4801 22.5769 12.4504 22.5769C15.4208 22.5769 23.1138 18.4413 22.2323 10.5802C21.4672 8.29065 20.4114 6.05017 19.0649 3.85876Z"
                    fill="#56D6FF"
                  />
                  <path
                    d="M21.2687 19.1552L29.5651 27.4652C30.145 28.0451 30.145 28.9852 29.5651 29.5651C28.9852 30.145 28.0451 30.145 27.4652 29.5651L19.1705 21.2568C17.1578 22.824 14.6273 23.7575 11.8788 23.7575C5.3183 23.7575 0 18.4392 0 11.8788C0 5.3183 5.3183 0 11.8788 0C18.4392 0 23.7575 5.3183 23.7575 11.8788C23.7575 14.6203 22.8288 17.145 21.2687 19.1552ZM11.8788 20.7878C16.7991 20.7878 20.7878 16.7991 20.7878 11.8788C20.7878 6.95842 16.7991 2.96969 11.8788 2.96969C6.95842 2.96969 2.96969 6.95842 2.96969 11.8788C2.96969 16.7991 6.95842 20.7878 11.8788 20.7878Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>


            <div className="ml-2 pt-1.5">
              <input
                className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                onChange={(e) => setTag(e.target.checked)}
              />
              <label
                className="inline pl-[0.15rem] hover:cursor-pointer text-gray-200 text-lg mr-1"
              >{tag ? "Freq" : "Tags"}
              </label>
            </div>
          </div>
        </div>
        
        <Comparer  problemStatusMap={problemStatusMap} userData={userData} userStats={userStats}  isChecked={tag}/>

        <UserCard userData={userData} userStats={userStats} />

        <Ladder
          ladderData={ladderData}
          problemStatusMap={problemStatusMap}
          setUserStats={setUserStats}
          tagStatus={tag}
        />
      </div>
      <div className="w-full bg-[#151834] text-center text-gray-200 p-2">
        <p className="mb-2 text-base">Join our Discord Server and be a part of an evergrowing community full of hustling & talented individuals discussing Competitive programming, DSA and Development! (This is free and would always be!)</p>

        <a href="https://discord.gg/Pk3F2CW76p" target="_blank" className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-orange-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-[#151834] group">
          <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-[#2b2c3e] group-hover:h-full"></span>
          <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </span>
          <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </span>
          <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">ACodeDaily</span>
        </a>

      </div>
      <Footer />
    </div>
  );
}

export default App;
