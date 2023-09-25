import { Component } from "react";
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './charList.scss';

class CharList extends Component {

    state = {
        charList: [], 
        loading: true,
        error: false,
        offset: 210,
        newItemLoading: false,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
        window.addEventListener('scroll', this.onScroll)
    };

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll)
    }

    onScroll = () => {
        if (this.state.offset < 219) return;
        if (this.state.newItemLoading) return;
        if (this.state.charEnded) {
            window.removeEventListener('scroll', this.onScroll)
        }
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            this.onCharListLoading();
            this.onRequest(this.state.offset)
        }
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
        .then(this.onCharListLoaded)
        .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => { 
        let ended = false;
        if (newCharList.length < 9) {
            ended = true
        }
        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharList], 
            loading: false,
            offset: offset + 9,
            newItemLoading: false,
            charEnded: ended
        }))
    };

    onError = () => {
        this.setState({ loading: false, error: true });
    };

    renderItems(arr) {
        const items = arr.map((item, i) => {
            const notAvailableImg = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";
            const style = (item.thumbnail === notAvailableImg) ? { objectFit: 'unset' } : null;
            return (
                <li
                    className="char__item"
                    key={item.id}
                    tabIndex={0}
                    onFocus={() => {
                        this.props.onCharSelected(item.id);
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

    render() {
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
        const items = this.renderItems(charList);
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(error || loading) ? items : null;
        return (
            <div className="char__list">
                {content}
                {errorMessage}
                {spinner}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    onClick={() => this.onRequest(offset)}
                    style={{'display': charEnded ? 'none' : 'block'}}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;