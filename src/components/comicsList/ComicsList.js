import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const setContent = (process, Component, newComics) => {
    switch (process) {
        case 'waiting':
            return <Spinner />;
            break;
        case 'loading': 
            return newComics ? <Component /> : <Spinner />;
            break;
        case 'error':
            return <ErrorMessage />;
            break
        case 'confirmed': 
            return <Component />
        default:
            throw new Error('Unexpected process state')
    }
}

const ComicsList = () => {
    const {getAllComics, process, setProcess } = useMarvelService();

    const [comicsList, setComicsList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [newComics, setNewComics] = useState(false);
    const [listEnded, setListEnded] = useState(false);

    useEffect(() => {
        onRequest(offset, true)
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewComics(false) : setNewComics(true);
        getAllComics(offset)
        .then(onComicsListLoaded)
        .then(() => setProcess('confirmed'))
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true
        }
        setComicsList((comicsList) => [...comicsList, ...newComicsList]);
        setOffset(offset => offset + 8);
        setListEnded(ended);
        setNewComics(false)
    };

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            return (
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="comics__item-img"
                        />
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            );
        })
        return (
            <ul className="comics__grid">
                {items}
            </ul>)
    }

    return (
        <div className="comics__list">
            {setContent(process, () => renderItems(comicsList), newComics)}
            <button
                disabled={newComics}
                style={{ display: listEnded ? 'none' : 'block'}}
                className="button button__main button__long"
                onClick={() => onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    );
}

export default ComicsList;