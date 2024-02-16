import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const { request, clearError, process, setProcess } = useHttp();
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=31e96e40ade3bffbfda9d07f8106a0b3';
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformChar) 
    }

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`)
        return res.data.results.map(_transformChar)
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformChar(res.data.results[0]) 
    }

    const getAllComics = async (offset = 0) => {
        const res = await request(
            `${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`
        );
        return res.data.results.map(_transformComic)
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComic(res.data.results[0]);
    };

    const _transformChar = (char) => {
        return {
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : "We don't have description for this character yet.",
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            detail: char.urls[0].url,
            wiki: char.urls[1].url,
            id: char.id,
            comics: char.comics.items
        }
    }

    const _transformComic = (com) => {
        return {
            title: com.title,
            price: com.prices[0].price
                ? `${com.prices[0].price}$`
                : "NOT AVAILABLE",
            thumbnail: com.thumbnail.path + "." + com.thumbnail.extension,
            id: com.id,
            description: com.description,
            pageCount: com.pageCount
                ? `${com.pageCount} pages`
                : "No information about the number of pages",
            language: com.textObjects[0]?.language || 'en-us'
        };
    }

    return { 
        clearError, 
        process,
        setProcess,
        getAllCharacters,
        getCharacterByName, 
        getCharacter, 
        getAllComics, 
        getComic 
    };
}

export default useMarvelService;