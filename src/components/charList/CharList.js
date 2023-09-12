import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './charList.scss';

class CharList extends Component {

    state = {
        charList: [], 
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.marvelService
        .getAllCharacters()
        .then(this.onCharListLoaded)
        .catch(this.onError)
    }

    onCharListLoaded = (charList) => {
        this.setState({charList, loading: false});
    };

    onError = () => {
        this.setState({ loading: false, error: true });
    };

    renderItems(arr) {
        const items = arr.map((item) => {
            const notAvailableImg = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";
            const style = (item.thumbnail === notAvailableImg) ? {objectFit: 'contain'} : null;
            return (
                <li className="char__item" key={item.id}>
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
        const {charList, loading, error} = this.state;
        const items = this.renderItems(charList);
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(error || loading) ? items : null;
        return (
            <div className="char__list">
                {content}
                {errorMessage}
                {spinner}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;