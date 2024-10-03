const storage = new DataStorage();

window.onload = function () {

    const updateList = () => {

        const list = document.querySelector('#urlsList');
        const storageItems = storage.get();
        const items = [];

        if(!storageItems) return;

        for (const [key, value] of Object.entries(storageItems)) {

            items.push(`<li><a href="${value}" target="_blank"><b>${key}</b></a> - <a href="${value}" title="${value}">${value}</a></li>`);
        }

        list.innerHTML = items.join('');
    }

    updateList();

    document.querySelector('#form').addEventListener('submit', function(e) {
        
        e.preventDefault();

        const url = document.querySelector('#url').value;

        storage.save(url);

        updateList();

        e.target.reset();

    });

    document.querySelector('#clearStorage').addEventListener('click', function(e) {
        
        e.preventDefault();

        storage.clear();

        updateList();
    });
}

function DataStorage () {

    const KEY_NAME = "shortUrls";
    const isSupport = window.localStorage !== undefined;
    const parseUrl = (url) => {

        try {
    
            return new URL(url);
    
        } catch(e) {
    
            console.error(e);
    
            return '';
        }
    
    }

    let list = {};

    this.get = () => {

        if (isSupport) {

            const parsedList = JSON.parse(localStorage.getItem(KEY_NAME));

            list = parsedList || list;

        }

        return list;
    }

    this.save = (longUrl) => {

        if (isSupport) {

            const url = parseUrl(longUrl);
            const randHash = Math.random().toString(36).substring(2);
        
            if(url) {
        
                const shortUrl = `${url.protocol}//${randHash}`;
        
                list[shortUrl] = url.href;

                localStorage.setItem(KEY_NAME, JSON.stringify(list));
        
                return list;
        
            } else return '';

        }
    }

    this.clear = () => {

        if(isSupport) {

            localStorage.removeItem(KEY_NAME);

            list = {};
        }
    };

}