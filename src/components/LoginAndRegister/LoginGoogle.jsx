import React, { useEffect} from "react"
import { useNavigate } from "react-router-dom";
import axiosClient from "../../services/config/axios";
const SignInGoogle = () => {
    const navigate = useNavigate();

    useEffect(() => {

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const refreshToken = urlParams.get("refresh_token");
        if(token && refreshToken){
            axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            localStorage.setItem("token", token);
            localStorage.setItem("refresh_token", refreshToken);
            window.location.href = "/";
        } 
    }, [navigate]);
}

export default SignInGoogle;