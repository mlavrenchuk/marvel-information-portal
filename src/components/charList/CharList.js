import { useState, useEffect, useMemo } from "react";
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import useMarvelService from '../../services/MarvelService';
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import './charList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner />;
        case 'loading': 
            return newItemLoading ? <Component /> : <Spinner />;
        case 'error':
            return <ErrorMessage />;
        case 'confirmed': 
            return <Component />
        default:
            throw new Error('Unexpected process state')
    }
}

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [offset, setOffset] = useState(210);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [charEnded, setCharEnded] = useState(false);

    const {getAllCharacters, process, setProcess} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
        .then(onCharListLoaded)
        .then(() => setProcess('confirmed'))
    }

    const onCharListLoaded = (newCharList) => { 
        let ended = false;
        if (newCharList.length < 9) {
            ended = true
        }
        setCharList(charList => [...charList, ...newCharList]);
        setOffset(offset => offset + 9);
        setNewItemLoading(false);
        setCharEnded(ended)
    };

    function renderItems(arr) {
        console.log('render');
        const items = arr.map((item, i) => {
            const notAvailableImg = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";
            const style = (item.thumbnail === notAvailableImg) ? { objectFit: 'unset' } : null;
            return (
                <CSSTransition in={true} key={item.id} timeout={5000} classNames="char__item">
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
                </CSSTransition>
            )
        })
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }

    const elements = useMemo(() => {
        return setContent(process, () => renderItems(charList), newItemLoading)
    }, [process])

    return (
        <div className="char__list">
            {elements}
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