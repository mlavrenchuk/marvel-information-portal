import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [offset, setOffset] = useState(210);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
        .then(onCharListLoaded)
    }

    const onCharListLoaded = (newCharList) => { 
        let ended = false;
        if (newCharList.length < 9) {
            ended = true
        }
        setCharList(charList => [...charList, ...newCharList]);
        setOffset(offset => offset + 9);
        setNewItemLoading(false);
        setCharEnded(charEnded => ended)
    };

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            const notAvailableImg = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";
            const style = (item.thumbnail === notAvailableImg) ? { objectFit: 'unset' } : null;
            return (
                <li
                    className="char__item"
                    key={item.id}
                    tabIndex={0}
                    onFocus={() => {
                        props.onCharSelected(item.id);
                    }}>
                    <img src={item.thumbnail} alt={item.name} style={style}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }


    const items = renderItems(charList);
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !newItemLoading ? <Spinner /> : null;
    return (
        <div className="char__list">
            {items}
            {errorMessage}
            {spinner}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}
                style={{'display': charEnded ? 'none' : 'block'}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;