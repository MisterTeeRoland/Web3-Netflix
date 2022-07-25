import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { Logo } from "../images/Netflix";
import {
    ConnectButton,
    Icon,
    TabList,
    Tab,
    Button,
    Modal,
    useNotification,
} from "web3uikit";
import { movies } from "../helpers/library";
import { useMoralis } from "react-moralis";

const Home = () => {
    const [visible, setVisible] = useState(false);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [myMovies, setMyMovies] = useState([]);
    const { isAuthenticated, Moralis, account } = useMoralis();

    useEffect(() => {
        async function fetchMyList() {
            const b = Moralis.Object.extend("_User");
            const query = new Moralis.Query(b);
            query.equalTo("ethAddress", account);
            const results = await query.first();
            if (results.attributes.myList) {
                const theList = movies.filter(
                    (movie) =>
                        results.attributes.myList.indexOf(movie.Name) > -1
                );
                console.log("theList", theList);
                setMyMovies(theList);
            }
        }

        if (isAuthenticated) {
            fetchMyList();
        }
    }, [account]);

    const updateMyList = async (name) => {
        const user = Moralis.Object.extend("_User");
        const query = new Moralis.Query(user);
        query.equalTo("ethAddress", account);

        const data = await query.first();
        if (data.attributes.myList) {
            const { myList } = data.attributes;
            myList.push(name);
            data.set("myList", myList);
        } else {
            data.set("myList", [name]);
        }

        await data.save(null, { useMasterKey: true });
    };

    const dispatch = useNotification();

    const handleNewNotification = () => {
        dispatch({
            type: "error",
            message: "Please connect your crypto wallet",
            title: "Not Authenticated",
            position: "topL",
        });
    };

    const handleAddNotification = () => {
        dispatch({
            type: "success",
            message: "Movie added to your list",
            title: "Success",
            position: "topL",
        });
    };

    return (
        <>
            <div className="logo">
                <Logo />
            </div>
            <div className="connect">
                <Icon fill="#fff" size={24} svg="bell" />
                <ConnectButton />
            </div>

            <div className="topBanner">
                <TabList defaultActiveKey={1} tabStyle="bar">
                    <Tab tabKey={1} tabName="Movies">
                        <div className="scene">
                            <img
                                src={movies[0].Scene}
                                alt="scene"
                                className="sceneImg"
                            />
                            <img
                                className="sceneLogo"
                                src={movies[0].Logo}
                                alt="logo"
                            />
                            <p className="sceneDesc">{movies[0].Description}</p>
                            <div className="playButton">
                                <Button
                                    icon="chevronRightX2"
                                    text="Play"
                                    theme="secondary"
                                    type="button"
                                />
                                <Button
                                    icon="plus"
                                    text="Add to My List"
                                    theme="translucent"
                                    type="button"
                                    onClick={() => setVisible(true)}
                                />
                            </div>
                        </div>

                        <div className="title">Movies</div>
                        <div className="thumbs">
                            {movies &&
                                movies.map((movie, index) => {
                                    return (
                                        <img
                                            key={index}
                                            src={movie.Thumnbnail}
                                            alt="thumbnail"
                                            className="thumbnail"
                                            onClick={() => {
                                                setSelectedFilm(movie);
                                                setVisible(true);
                                            }}
                                        />
                                    );
                                })}
                        </div>
                    </Tab>
                    <Tab tabKey={2} tabName="Series" isDisabled={true}></Tab>
                    <Tab tabKey={3} tabName="My List">
                        <div className="ownListContent">
                            <div className="title">Your Library</div>
                            {myMovies && isAuthenticated ? (
                                <div className="thumbs">
                                    {myMovies.map((movie, index) => {
                                        return (
                                            <img
                                                key={index}
                                                src={movie.Thumnbnail}
                                                alt="thumbnail"
                                                className="thumbnail"
                                                onClick={() => {
                                                    setSelectedFilm(movie);
                                                    setVisible(true);
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="ownThumbs">
                                    You need to authenticate to view your own
                                    list.
                                </div>
                            )}
                        </div>
                    </Tab>
                </TabList>

                {selectedFilm && (
                    <div className="modal">
                        <Modal
                            onCloseButtonPressed={() => setVisible(false)}
                            isVisible={visible}
                            hasFooter={false}
                            width={"1000px"}
                        >
                            <div className="modalContent">
                                <img
                                    src={
                                        selectedFilm.Scene !== ""
                                            ? selectedFilm.Scene
                                            : selectedFilm.Thumnbnail
                                    }
                                    alt="scene"
                                    className="modalImg"
                                />
                                <img
                                    className="modalLogo"
                                    src={selectedFilm.Logo}
                                    alt="logo"
                                />

                                <div className="modalPlayButton">
                                    {isAuthenticated ? (
                                        <>
                                            <Link
                                                to="/player"
                                                state={selectedFilm.Movie}
                                            >
                                                <Button
                                                    icon="chevronRightX2"
                                                    text="Play"
                                                    theme="secondary"
                                                    type="button"
                                                />
                                            </Link>
                                            <Button
                                                icon="plus"
                                                text="Add to My List"
                                                theme="translucent"
                                                type="button"
                                                onClick={() => {
                                                    updateMyList(
                                                        selectedFilm.Name
                                                    );
                                                    setVisible(false);
                                                    handleAddNotification();
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                icon="chevronRightX2"
                                                text="Play"
                                                theme="secondary"
                                                type="button"
                                                onClick={handleNewNotification}
                                            />
                                            <Button
                                                icon="plus"
                                                text="Add to My List"
                                                theme="translucent"
                                                type="button"
                                                onClick={handleNewNotification}
                                            />
                                        </>
                                    )}
                                </div>

                                <div className="movieInfo">
                                    <div className="description">
                                        <div className="details">
                                            <span>{selectedFilm.Year}</span>
                                            <span>{selectedFilm.Duration}</span>
                                        </div>
                                        {selectedFilm.Description}
                                    </div>
                                    <div className="detailedInfo">
                                        Genre:{" "}
                                        <span className="deets">
                                            {selectedFilm.Genre}
                                        </span>
                                        <br />
                                        Actors:{" "}
                                        <span className="deets">
                                            {selectedFilm.Actors}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </div>
                )}
            </div>
        </>
    );
};

export default Home;
