let emit = (type, data) => {
    chrome.runtime.sendMessage({from: 'content', type: type, data: data}, () => {});
}

let message = (from, type, callback) => {
    chrome.runtime.onMessage.addListener((request, sender) => {
        if(request.from === from && request.type === type) {
            callback(request.data, sender);
        }

        return true;
    });
};

let id = Math.random().toString(36).substr(2, 9);

emit('fetch-data', id);

message('background', `fetch-data--${id}`, data => {
    if(typeof data === 'object') {
        data.b.forEach(current => {
            if(window.location.href.includes(current)) {
                emit('close-page', {
                    time: new Date(),
                    href: window.location.href
                });
            }
        });

        if(window.location.href.includes('https://www.instagram.com/') && data.s[0]) {
            if(window.location.href.includes('/direct/')) {
                setInterval(() => {
                    let d = document.querySelector("#react-root > section > div > div:first-child");
                    let e = document.querySelector("#react-root > section > div > div > div > div > div:last-child > div > div > div > div:nth-child(2)");
                    let f = [...document.querySelectorAll("#react-root > section > div > div > div > div > div:last-child > div > div._9XapR > div:nth-child(3) > div > div")];
                    let g = [...document.querySelectorAll('*[role="listbox"]')];
                    let h = [...document.querySelectorAll('img[data-testid="user-avatar"]')];

                    if(d && document.querySelector("#react-root > section > div").children.length === 2) {
                        d.remove();
                    }

                    if(g?.length > 0) {
                        g.forEach(current => {
                            if(current.querySelector('img')) {
                                current?.remove();
                            }
                        });
                    }

                    if(e) {
                        if(e.getAttribute('style') ? e.getAttribute('style')?.includes('pointer-events: none;') : true) {
                            e.setAttribute('style', 'pointer-events: none;');
                        }
                    }

                    if(f?.length > 0) {
                        f.forEach(e => {
                            if(e.getAttribute('style') ? e.getAttribute('style')?.includes('pointer-events: none;') : true) {
                                e.setAttribute('style', 'pointer-events: none;');
                            }
                        });
                    }

                    if(h?.length > 0) {
                        h.forEach(e => {
                            e = e.parentElement?.parentElement?.parentElement;

                            if(e.getAttribute('style') ? e.getAttribute('style')?.includes('pointer-events: none;') : true) {
                                console.log('SKR')
                                e.setAttribute('style', 'pointer-events: none;');
                            }
                        });
                    }
                })
            } else {
                window.location.href = 'https://www.instagram.com/direct/inbox/';
            }
        } else if(window.location.href.includes('https://www.youtube.com/') && data.s[1]) {
            let allow = data.l.split(' ');

            if(!data.l.includes(' ')) {
                allow = [data.l];
            }

            if(window.location.href === 'https://www.youtube.com/') {
                let t = setInterval(() => {
                    if(document.querySelector('#content')) {
                        [...document.querySelector('#content').children].forEach((current, index) => {
                            if(index > 0) {
                                current.remove();
                            }
                        })

                        clearInterval(t);
                    }
                })
            }
        }
    }
});

message('background', 'check-tab', () => {
    if(!document.hidden && window.location.href.includes('https://www.youtube.com/') && (window.location.href.includes('channel') || window.location.href.includes('c') || window.location.href.includes('user'))) {
        let s = window.location.href.split('/');
        
        emit('return-tab', s[s.length - 1]);
    }
})