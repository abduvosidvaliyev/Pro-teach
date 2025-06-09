import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import {
    getDatabase,
    ref,
    onValue,
    set,
    update,
    get
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
const firebaseConfig = {
    apiKey: "AIzaSyC94X37bt_vhaq5sFVOB_ANhZPuE6219Vo",
    authDomain: "project-pro-7f7ef.firebaseapp.com",
    databaseURL: "https://project-pro-7f7ef-default-rtdb.firebaseio.com",
    projectId: "project-pro-7f7ef",
    storageBucket: "project-pro-7f7ef.firebasestorage.app",
    messagingSenderId: "782106516432",
    appId: "1:782106516432:web:d4cd4fb8dec8572d2bb7d5",
    measurementId: "G-WV8HFBFPND",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

import Person from "../../assets/Person.png"
import { Card, CardContent, CardHeader } from "../../components/ui/card"
import { useEffect, useState } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { HiArrowLeftStartOnRectangle } from "react-icons/hi2";
import { Modal } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";


export const Profile = () => {
    return (
        <div
            style={{
                marginLeft: "var(--sidebar-width, 250px)",
                width: "var(--sidebar-width), 100%",
                transition: "all 0.5s ease, background 0.3s ease, width 0.5s ease",
            }}
        >
            <h1 className="text-5xl font-medium"> 
                Profile
            </h1>
        </div>
    )
}


