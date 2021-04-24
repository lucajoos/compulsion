let emit = (type, data) => {
    chrome.tabs.query({ active: true }, (tabs) => {
        tabs.forEach(tab => {
            try {
                chrome.tabs.sendMessage(tab.id, {from: 'background', type: type, data: data}, () => {});
            } catch(e) {
                console.log(e);
            }
        });
    });

    try {
        chrome.runtime.sendMessage({from: 'background', type: type, data: data}, () => {});
    } catch(e) {
        console.log(e)
    }
}

let message = (from, type, callback) => {
    try {
        chrome.runtime.onMessage.addListener((request, sender) => {
            if(request.from === from && request.type === type) {
                callback(request.data, sender);
            }

            return true;
        });
    } catch(e) {
        console.log(e)
    }
};

message('content', 'fetch-data', id => {
    emit(`fetch-data--${id}`, {
        b: JSON.parse(localStorage.getItem('b') || '[]'),
        c: localStorage.getItem('c') || '0',
        a: localStorage.getItem('a'),
        s: JSON.parse(localStorage.getItem('s') || '[true]'),
        l: localStorage.getItem('l') || ''
    });
});

message('popup', 'fetch-data', id => {
    if(new Date().toDateString() !== new Date(localStorage.getItem('d' || '')).toDateString()) {
        localStorage.setItem('c', '0');
        localStorage.setItem('d', new Date().toString());
    }

    if(!localStorage.getItem('a')) {
        localStorage.setItem('a', 'true')
    }

    emit(`fetch-data--${id}`, {
        b: JSON.parse(localStorage.getItem('b') || '[]'),
        c: localStorage.getItem('c') || '0',
        a: localStorage.getItem('a'),
        s: JSON.parse(localStorage.getItem('s') || '[true]'),
        l: localStorage.getItem('l') || ''
    });
});

message('popup', 'toggle-state', state => {
    localStorage.setItem('a', state)
});

message('popup', 'add-item', item => {
    let a = JSON.parse(localStorage.getItem('b') || '[]');

    if(!a.includes(item)) {
        a.push(item);
        localStorage.setItem('b', JSON.stringify(a));
    }
});

message('popup', 'settings', item => {
    if(typeof item === 'object') {
        let oh = JSON.parse(localStorage.getItem('s') || '[true]');
        oh[item?.i] = item?.v;

        localStorage.setItem('s', JSON.stringify(oh));
    }
});

message('popup', 'allow', item => {
    if(typeof item === 'string') {
        localStorage.setItem('l', item);
    }
});

message('popup', 'remove-item', item => {
    let a = JSON.parse(localStorage.getItem('b') || '[]');

    if(typeof a === 'object') {
        a.splice(a.indexOf(item), 1);
        localStorage.setItem('b', JSON.stringify(a));
    }
});

message('content', 'close-page', (data, sender) => {
    if(!localStorage.getItem('a')) {
        localStorage.setItem('a', 'true')
    }

    if(localStorage.getItem('a') === 'true') {
        chrome.tabs.remove(sender.tab.id);

        if(!localStorage.getItem('c')) {
            localStorage.setItem('c', '0');
        }

        localStorage.setItem('c', (parseInt(localStorage.getItem('c')) + 1).toString());
    }
});

message('popup', 'check-tab', () => {
    emit('check-tab');
});

message('content', 'return-tab', data => {
    emit('return-tab', data);
});