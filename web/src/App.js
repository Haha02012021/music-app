import { Home, Login, Mymusic, Public, Playlist, NewReleaseChart, 
  GenreTopic, Top100, Singer, NewRelease, CreateSinger, CreateGenre, CreateAlbum, CreateSong, Search 
} from './containers/public/';
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
            <Route path={path.NEWRELEASECHART} element={<NewReleaseChart />} />
            <Route path={path.GENRETOPIC} element={<GenreTopic />} />
            <Route path={path.TOP100} element={<Top100 />} />
            <Route path={path.SINGER__TITLE__SID} element={<Singer />} />
            <Route path={path.NEWRELEASE} element={<NewRelease />} />
            <Route path={path.CREATESINGER} element={<CreateSinger />} />
            <Route path={path.CREATEGENRE} element={<CreateGenre />} />
            <Route path={path.CREATEALBUM} element={<CreateAlbum />} />
            <Route path={path.CREATESONG} element={<CreateSong />} />
            <Route path={path.SEARCH} element={<Search />} />

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
