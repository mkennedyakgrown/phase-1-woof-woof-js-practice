document.addEventListener('DOMContentLoaded', () => {
    fetch(`http://localhost:3000/pups`)
    .then(res => res.json())
    .then(json => loadDogBar(json));
})

function loadDogBar(doggos) {
    doggos.forEach(dog => loadOneDog(dog));
    document.getElementById('good-dog-filter').setAttribute('class', 'filter-off');
    document.getElementById('good-dog-filter').addEventListener('click', filterDogs);
}

function filterDogs(event) {
    const btn = event.target;
    const filter = document.getElementById('filter-div');
    const dogBar = document.getElementById('dog-bar');
    if (btn.getAttribute('class') === 'filter-off') {
        console.log('filter off');
        while (dogBar.querySelector('.bad-dog') !== null) {
            const badDog = dogBar.querySelector('.bad-dog');
            badDog.setAttribute('hidden', 'hidden');
            filter.appendChild(badDog);
        };
        btn.setAttribute('class', 'filter-on');
        btn.innerText = 'Filter good dogs: ON';
    } else {
        console.log('filter on');
        while (filter.querySelector('.bad-dog') !== null) {
            const badDog = filter.querySelector('.bad-dog');
            badDog.removeAttribute('hidden');
            dogBar.appendChild(badDog);
        }
        btn.setAttribute('class', 'filter-off');
        btn.innerText = 'Filter good dogs: OFF';
    };
}

function loadOneDog(dog) {
    const dogBar = document.getElementById('dog-bar');
    const span = addElement('span', 'id', dog.id);
    if (dog.isGoodDog === true) {
        span.setAttribute('class', 'good-dog');
    } else {
        span.setAttribute('class', 'bad-dog');
    }
    span.innerText = dog.name;
    dogBar.appendChild(span);
    span.addEventListener('click', handleDogClick);
}

function handleDogClick(event) {
    const doggoDiv = document.getElementById('dog-info');
    while (doggoDiv.firstChild) {doggoDiv.removeChild(doggoDiv.firstChild)};
    const dog = event.target;
    fetch(`http://localhost:3000/pups/${dog.id}`)
    .then(res => res.json())
    .then(json => {
        const img = addElement('img', 'src', json.image);
        const name = addElement('h2', 'id', json.id, json.name);
        const btn = document.createElement('button');
        if (json.isGoodDog === true) {
            btn.innerText = 'Good Dog!';
        } else {
            btn.innerText = 'Bad Dog!';
        };
        doggoDiv.appendChild(img);
        doggoDiv.appendChild(name);
        doggoDiv.appendChild(btn);
        btn.addEventListener('click', handleGoodDog);
    });
}

function handleGoodDog(event) {
    const btn = event.target;
    const id = event.target.parentNode.querySelector('h2').id;
    const dog = document.getElementById(id);
    let goodBad;
    if (btn.innerText === "Good Dog!") {
        goodBad = true;
    } else {
        goodBad = false;
    }
    fetch(`http://localhost:3000/pups/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            accept: "application/json",
        },
        body: JSON.stringify({
            "isGoodDog": !goodBad,
        }),
    })
    .then(res => res.json())
    .then(json => {
        if (goodBad === true) {
            btn.innerText = 'Bad Dog!';
            dog.setAttribute('class', 'bad-dog');
        } else {
            btn.innerText = 'Good Dog!';
            dog.setAttribute('class', 'good-dog');
        };
    });
}

function addElement(name, att1a, att1b, text) {
    const dog = document.createElement(name);
    dog.setAttribute(att1a, att1b);
    if (text !== undefined) {
        dog.innerText = text;
    }
    return dog;
}