import React, { useEffect, useState } from "react";
import "../../css/progress.css"; 

function ProgressTracker() {
    const [progress, setProgress] = useState(localStorage.getItem("progress") || "cart");

    useEffect(() => {
        setProgress(localStorage.getItem("progress") || "cart");
    }, []);

    return (
        <div className="progress-container">
            <div className={`step ${progress === "cart" ? "active" : ""}`}>Cart</div>
            <div className={`step ${progress === "shipping" ? "active" : ""}`}>Shipping</div>
            <div className={`step ${progress === "payment" ? "active" : ""}`}>Payment</div>
            <div className={`step ${progress === "summary" ? "active" : ""}`}>Summary</div>
            <div className={`progress-line ${progress}`}></div>
        </div>
    );
}

export default ProgressTracker;
