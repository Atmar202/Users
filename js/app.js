const api = 'https://jsonplaceholder.typicode.com/users',
userTemplate = document.querySelector("[data-user-template]"),
userContainer = document.querySelector("[data-user-cards-container]"),
searchInput = document.querySelector("[data-search]");

let users = [];

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    users.forEach(user => {
        const isVisible = user.username.toLowerCase().includes(value);
        user.element.classList.toggle("hide", !isVisible);
    });
});

fetch(api).then(res => res.json())
.then(data => {
    users = data.map(user => {
        const card = userTemplate.content.cloneNode(true).children[0],
        header = card.querySelector("[data-header]"),
        body = card.querySelector("[data-body]"),
        address = card.querySelector("[data-address]"),
        company = card.querySelector("[data-company]");

        header.innerHTML = '<i class="lni lni-user"></i> ' + user.username;

        for(let prop in user) {

            if(prop == 'id' || prop == 'username') 
                continue;
            
            let para = document.createElement("p");

            // Address & Company objects
            if(user[prop] instanceof Object) {

                for(let item in user[prop]) {
                    // If there's any more objects, then stringify them
                    para.textContent = `${item}: ${user[prop][item] instanceof Object ? JSON.stringify(user[prop][item]) : user[prop][item]}`;
                    
                    switch(prop) {
                        case 'company':
                            company.appendChild(para);
                            break;
                        case 'address':
                            address.appendChild(para);
                            break;
                    }
                    
                    para = document.createElement("p");
                }

            } else {
                para.textContent = `${prop}: ${user[prop]}`;
                body.appendChild(para);
            }
        }

        // Clickable titles
        const addrTitle = card.querySelector('.addressTitle'),
        companyTitle = card.querySelector('.companyTitle');

        addrTitle.addEventListener("click", () => address.classList.toggle("hide"));
        companyTitle.addEventListener("click", () => company.classList.toggle("hide"));
        header.addEventListener("click", () => body.classList.toggle("hide"));
        userContainer.append(card);

        return { username: user.username, element: card }
    });
});