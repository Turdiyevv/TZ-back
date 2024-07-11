const http = require('http');

const data = [
    { 'email': 'jim@gmail.com', 'number': '(90)221-41-22' },
    { 'email': 'jam@gmail.com', 'number': '(91)830-43-47' },
    { 'email': 'john@gmail.com', 'number': '(99)221-41-22' },
    { 'email': 'jams@gmail.com', 'number': '(94)349-44-25' },
    { 'email': 'jams@gmail.com', 'number': '(93)141-44-24' },
    { 'email': 'jill@gmail.com', 'number': '(99)822-42-87' },
    { 'email': 'jill@gmail.com', 'number': '(91)822-42-00' },
    { 'email': 'jill@gmail.com', 'number': '(91)822-42-86' }
];
let timeoutID;
let activeRes ;

const isValidNumber = (number) => {
    const regex = /^\(\d{2}\)\d{3}-\d{2}-\d{2}$/;
    return regex.test(number);
};
const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    if (req.method === 'GET' && req.url === '/api/data/all') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));
    } else if(req.method === 'POST' && req.url === '/api/data/search'){
        let body = '';
        await req.on('data',chunk => {
            body += chunk.toString();
        });
        await req.on('end', async () => {
            const {email, number} = JSON.parse(body);
            let found;
            if(number && email) {
                if (isValidNumber(number) && isValidEmail(email)){
                    found = data.filter(item => item.email === email && item.number === number);
                }
                else {
                    await res.writeHead(403, {'Content-Type' : 'application/json'});
                    await res.end('Validation error');
                    return
                }
            } else if(email && !number){
                if (isValidEmail(email)){
                    found = data.filter(item => item.email === email);
                } else {
                    await res.writeHead(403, {'Content-Type' : 'application/json'});
                    await res.end('Validation error');
                    return
                }
            }else {
                await res.writeHead(403, {'Content-Type' : 'application/json'});
                await res.end('Validation error');
                return
            }
            if (timeoutID) {
                clearTimeout(timeoutID);
                if (activeRes) {
                    activeRes .writeHead(408, { 'Content-Type': 'application/json' });
                    activeRes .end(JSON.stringify({ message: 'Request Timeout' }));
                }
            }
            if (found && found.length) {
                timeoutID = setTimeout(async () => {
                    await res.writeHead(200, {'Content-Type' : 'application/json'});
                    await res.end(JSON.stringify(found));
                }, 5000)
                activeRes  = res;
            }else {
                await res.writeHead(404, {'Content-Type' : 'application/json'});
                await res.end('Not-found');
            }
        })
    }else {
        console.log('und method !')
    }
})
server.listen(3000, () => {
    console.log('Listening on port 3000');
});
