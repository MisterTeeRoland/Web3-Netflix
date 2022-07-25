import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import "./Player.css";
import { Icon } from "web3uikit";

const Player = () => {
    const { state: currentlyPlaying } = useLocation();

    return (
        <>
            <div className="playerPage">
                <video autoPlay controls className="videoPlayer">
                    <source src={currentlyPlaying} type={"video/mp4"} />
                </video>

                <Link to="/">
                    <div className="backHome">
                        <Icon
                            className="backButton"
                            fill="rgba(255,255,255,0.25)"
                            size={60}
                            svg="arrowCircleLeft"
                        />
                    </div>
                </Link>
            </div>
        </>
    );
};

export default Player;
