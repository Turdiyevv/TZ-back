const http = require('http');

const data = [
    { 'email': 'jim@gmail.com', 'number': '221122' },
    { 'email': 'jam@gmail.com', 'number': '830347' },
    { 'email': 'john@gmail.com', 'number': '221122' },
    { 'email': 'jams@gmail.com', 'number': '349425' },
    { 'email': 'jams@gmail.com', 'number': '141424' },
    { 'email': 'jill@gmail.com', 'number': '822287' },
    { 'email': 'jill@gmail.com', 'number': '822286' }
];
const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/api/data') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data))
    } else if(req.method === 'POST' && req.url === 'api/data'){
        let body = '';
        req.on('data',chunk => {
            body += toString();
        });
        req.on('end', () => {
            const {email, number} = JSON.parse(body);
            const found = data.filter(item => item.email === email &&
                item.number === number);
            if (found.length > 0) {
                res.writeHead(200, {'Content-Type' : 'application/json'});
                res.end(JSON.stringify(found));
            }else {
                res.writeHead(404, {'Content-Type' : 'application/json'});
                res.end('Not-found');
            }
        })
    }else {
        console.log('und method !')
    }
})
server.listen(3000, () => {
    console.log('Listening on port 3000');
});