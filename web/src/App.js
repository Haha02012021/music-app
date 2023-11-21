import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Home, Login, Mymusic, Public, Playlist, ZingChartWeek, ZingChart, NewReleaseChart, GenreTopic, Top100 } from './containers/public/';
import { Routes, Route } from "react-router-dom";
import path from "./utils/path";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <div className="">
        <Routes>
          <Route path={path.PUBLIC} element={<Public />} >
            <Route path={path.HOME} element={<Home />} />
            <Route path={path.LOGIN} element={<Login />} />
            <Route path={path.MYMUSIC} element={<Mymusic />} />
            <Route path={path.PLAYLIST__TITLE__PID} element={<Playlist />} />
            <Route path={path.ALBUM__TITLE__PID} element={<Playlist />} />
            <Route path={path.ZINGCHARTWEEK__TITLE__CID} element={<ZingChartWeek />} />
            <Route path={path.ZINGCHART} element={<ZingChart />} />
            <Route path={path.NEWRELEASECHART} element={<NewReleaseChart />} />
            <Route path={path.GENRETOPIC} element={<GenreTopic />} />
            <Route path={path.TOP100} element={<Top100 />} />

            <Route path={path.STAR} element={<Home />} />
          </Route>
        </Routes>
      </div>

      <ToastContainer position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </>
  );
}

export default App;
