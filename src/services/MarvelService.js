class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=31e96e40ade3bffbfda9d07f8106a0b3';

    getResource = async (url) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    };

    getAllCharacters = async () => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
        return res.data.results.map(this._transformChar) 
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformChar(res.data.results[0]) 
    }

    _transformChar = (char) => {
        return({
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : "We don't have description for this character yet.",
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            detail: char.urls[0].url,
            wiki: char.urls[1].url,
            id: char.id,
            comics: char.comics.items
        })
    }
}

export default MarvelService;