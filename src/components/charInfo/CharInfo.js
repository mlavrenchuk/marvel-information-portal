import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import useMarvelService from "../../services/MarvelService";
import setContent from "../../utils/setContent";
import "./charInfo.scss";

const CharInfo = (props) => {
    const [char, setChar] = useState(null);

    const {getCharacter, clearError, process, setProcess } = useMarvelService();

    useEffect(() => {
        updateChar()
    }, [props.charId])

    const updateChar = () => {
        const { charId } = props;
        if (!charId) {
            return;
        }
        clearError();
        getCharacter(charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    };

    const onCharLoaded = (char) => {
        setChar(char);
    };

    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    );
}

const View = ({ data }) => {
    const { name, description, thumbnail, detail, wiki, comics } = data;
    const notAvailableImg = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";
    const style = (thumbnail === notAvailableImg) ? {objectFit: 'contain'} : null;
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={style} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={detail} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">{description}</div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : "There is no comics with this character"}
                {
                    comics.map((item, i) => {
                        if (i > 9) return;
                        return (
                            <li className="char__comics-item" key={i}>
                                <Link to={`/comics/${item.resourceURI.substring(43)}`}>
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })
                }
            </ul>
        </>
    );
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;
