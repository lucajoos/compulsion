let options = {};

let emit = (type, data) => {
    chrome.runtime.sendMessage({from: 'popup', type: type, data: data}, () => {});
}

let message = (from, type, callback) => {
    chrome.runtime.onMessage.addListener((request, sender) => {
        if(request.from === from && request.type === type) {
            callback(request.data, sender);
        }

        return true;
    });
}

let load = (page, callback) => {
    let render = document.querySelector('.render');
    let request = new XMLHttpRequest();

    request.addEventListener('readystatechange', () => {
        if(request.readyState === 4 && request.status === 200) {
            render.innerHTML = request.responseText;
            callback();
        }
    });

    request.open('GET', page);
    request.send();
}
let back = () => {
    document.querySelector('.fa-arrow-left').addEventListener('click', () => {
        load('./pages/main.html', main);
    });
}

let main = () => {
    let list, input;
    let blacklist = [];

    let id = Math.random().toString(36).substr(2, 9);

    let add = current => {
        let element = document.createElement('p');
        element.classList.add('list-item');

        let text = document.createElement('span');
        text.innerHTML = current;

        let icon = document.createElement('i');
        icon.classList.add('fas');
        icon.classList.add('fa-times');

        element.appendChild(text);
        element.appendChild(icon);

        element.addEventListener('click', () => {
            element.remove();
            emit('remove-item', current);
        });

        list.appendChild(element);
    };

    let send = () => {
        let value = input.value;

        if(value) {
            input.value = '';

            if(!blacklist.includes(value)) {
                emit('add-item', value);
                add(value);
                blacklist.push(value);
            }
        }
    };

    list = document.querySelector('.list');
    input = document.querySelector('input');

    input.focus();

    emit('fetch-data', id);

    message('background', `fetch-data--${id}`, data => {
        if(typeof data === 'object') {
            options = data;
            blacklist = data.b;

            document.querySelector('.count').innerHTML = data.c;

            if(data.a === 'true') {
                document.querySelector('.fa-power-off').classList.add('active');
            }

            blacklist.forEach(current => {
                add(current);
            });
        }
    });

    document.querySelector('.submit').addEventListener('click', () => {
        send();
    });

    window.addEventListener('keydown', event => {
        if(document.activeElement === input && event.key === 'Enter') {
            send();
        }
    });

    document.querySelector('.fa-chart-line').addEventListener('click', () => {
        load('./pages/stats.html', () => {
            back();
        });
    });

    document.querySelector('.fa-cog').addEventListener('click', () => {
        load('./pages/settings.html', () => {
            let b = document.querySelector('a');
            let id = '';
            emit('check-tab');

            options.s?.forEach((value, index) => {
                if(value) {
                    document.querySelectorAll('input')[index].setAttribute('checked', value);
                }
            });

            [...document.querySelectorAll('input')].forEach((current, index) => {
                current.addEventListener('change', () => {
                    emit('settings', {
                        i: index,
                        v: current.checked
                    });
                });
            });

            message('background', 'return-tab', current => {
                id = current;
                console.log(options.l)

                if(b.classList.contains('invisible')) {
                    if(options.l.includes(current)) {
                        b.innerText = 'Remove';
                    } else {
                        b.innerText = 'Allow';
                    }

                    b.classList.remove('invisible');
                }
            });

            b.addEventListener('click', () => {
                if(id.length > 0) {
                    let s = options.l;

                    if(options.l.includes(id)) {
                        s = s.replace(id, '')
                    } else {
                        s = `${s} ${id}`;
                    }

                    emit('allow', s.trim());
                    window.close();
                }
            });

            back();
        });
    });

    document.querySelector('.fa-power-off').addEventListener('click', () => {
        emit('toggle-state', !document.querySelector('.fa-power-off').classList.contains('active'));

        if(document.querySelector('.fa-power-off').classList.contains('active')) {
            document.querySelector('.fa-power-off').classList.remove('active');
        } else {
            document.querySelector('.fa-power-off').classList.add('active');
        }
    });
}

window.addEventListener('load', () => {
    load('./pages/main.html', main);
})