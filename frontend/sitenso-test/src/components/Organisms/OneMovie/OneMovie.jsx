import React, { useEffect, useState } from 'react'
import './OneMovie.css'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CommentsMovie } from '../../Molecules/CommentsMovie/CommentsMovie';
import { Button } from '../../Atoms/Button/Button';

const URL_API = "https://api.tvmaze.com/shows/";
const URL_DB = "http://localhost/new/comments?select=*";
const URL_POST_OPINION = "http://localhost/new/comments";


export const OneMovie = () => {

    const { movie_id } = useParams();
    const [movieData, setMovieData] = useState();
    const [commentData, setCommentData] = useState([]);
    const userId = JSON.parse(localStorage.getItem("userData")).id;
    const [opinionData, setOpinionData] = useState();
    const [alert, setAlert] = useState(false);

    const textArea = document.getElementById("textAreaOpinion");

    const handleChangeTextArea = (e) => {
        setOpinionData(e.target.value);
    };

    const handleOpinion = () => {
        if (textArea.value.length < 1) {

        } else {
            postOpinion();
            textArea.value = ""
            setAlert(true);
        }

    }

    const postOpinion = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("comment", opinionData);
        urlencoded.append("id_user_comment", userId);
        urlencoded.append("id_movie_comment", movie_id);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(URL_POST_OPINION, requestOptions)
            .then(response => response.text())
            .catch(error => console.log('error', error));
    }

    useEffect(() => {
        if (alert) {
            setTimeout(() => {
                setAlert(false);
            }, 2000)
        }
        axios.get(`${URL_API}${movie_id}`,).then((data) => {
            setMovieData(data.data);
        });
        axios.get(`${URL_DB}`).then((data) => {
            setCommentData(data.data.result)
        });

    }, [movie_id, alert]);

    function removeTags(str) {
        if ((str === null) || (str === ''))
            return false;
        else
            str = str.toString();

        return str.replace(/(<([^>]+)>)/ig, '');
    }

    return (
        <>
            {movieData ?
                (
                    <div className="peliculaContainer">
                        <div className="oneMovie">
                            <div className="oneMovie-img">
                                <img src={movieData.image.original} alt={movieData.name} />
                            </div>
                            <h1>{movieData.name}</h1>
                            <div className='oneMovie-sections'>
                                <h4>
                                    Lenguaje:
                                    <span>{` ${movieData.language}`}</span>
                                </h4>
                                <h4>
                                    Géneros:
                                    <span>{`${movieData.genres.map(item => ` ${item}`)}`}</span>
                                </h4>
                                <h4>
                                    Fecha de Estreno: <span>{` ${movieData.ended}`}</span>
                                </h4>
                            </div>
                            <div className="oneMovie-summary">
                                <h1>Sinópsis</h1>
                                <p>{removeTags(movieData.summary)}</p>
                            </div>
                        </div>
                        <div className="comments">
                            <h1>Comentarios</h1>
                            {commentData ? commentData.map((item) => {
                                if (movie_id === item.id_movie_comment.toString()) {
                                        return <CommentsMovie user_id={item.id_user_comment} comment={item.comment} />
                                }
                            }) : "no anda"}
                            <div className="leaveOpinions">
                                <textarea placeholder='Deja aquí tu opinion' name="" id="textAreaOpinion" cols="30" rows="2" onChange={handleChangeTextArea} />
                                <Button label="Enviar" onClick={handleOpinion} />
                            </div>
                            {alert ? "Opinion enviada" : ""}
                        </div>
                    </div>

                ) : "Hubo un problema, por favor intente mas tarde."}
        </>
    )
}
