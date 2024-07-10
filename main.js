const http = require('http');

const data = [
    { 'email': 'jim@gmail.com', 'number': '(90)221-41-22' },
    { 'email': 'jam@gmail.com', 'number': '(91)830-43-47' },
    { 'email': 'john@gmail.com', 'number': '(99)221-41-22' },
    { 'email': 'jams@gmail.com', 'number': '(94)349-44-25' },
    { 'email': 'jams@gmail.com', 'number': '(93)141-44-24' },
    { 'email': 'jill@gmail.com', 'number': '(99)822-42-87' },
    { 'email': 'jill@gmail.com', 'number': '(91)822-42-86' }
];
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
            if(number){
                found = data.filter(item => item.email === email && number ? item.number === number: '');
            }else {
                found = data.filter(item => item.email === email);
            }
            if (found.length > 0) {
                await res.writeHead(200, {'Content-Type' : 'application/json'});
                await res.end(JSON.stringify(found));
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
