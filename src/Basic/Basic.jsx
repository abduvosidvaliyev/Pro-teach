import style from "./App.module.css"
import { Link } from 'react-router-dom';
import back from '../assets/bac.mp4'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyC94X37bt_vhaq5sFVOB_ANhZPuE6219Vo",
    authDomain: "project-pro-7f7ef.firebaseapp.com",
    databaseURL: "https://project-pro-7f7ef-default-rtdb.firebaseio.com",
    projectId: "project-pro-7f7ef",
    storageBucket: "project-pro-7f7ef.firebasestorage.app",
    messagingSenderId: "782106516432",
    appId: "1:782106516432:web:d4cd4fb8dec8572d2bb7d5",
    measurementId: "G-WV8HFBFPND"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

function App() {
    
    return (
        <div>
            <div className={style.chat}></div>
            <aside className={style.basicAside}>
                <i className={`fa-solid fa-house ${style.icon}`}></i>
                <i className={`fa-solid fa-layer-group ${style.icon}`}></i>
                <Link to="/chat">
                    <i className={`fa-solid fa-message ${style.icon}`}></i>
                </Link>
            </aside>
            <div className={style.main}>
                <video autoPlay loop>
                    <source src={back} />
                </video>
                {[50, 20, 0].map((threshold, index) => (
                    <div className={style.levels} key={index}>
                        <h1>{index + 1}-Daraja</h1>
                        <div className={style.table}>
                            
                        </div>
                        <div className={style.level}>
                            <a href="">Level {index + 1}</a>
                        </div>
                    </div>
                ))}
                <div className={style.game}>🔁</div>
                <div className={style.userSettings} id="userSettings">
                    ⚙️
                </div>
            </div>
        </div>
    );
}

export default App;