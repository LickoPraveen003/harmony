const http = require('http');
const os = require('os');

const PORT = process.env.PORT || 3000;
// const hostname = '127.0.0.1';
// const port = 3000;

const server = http.createServer((req, res) => {
    try {
        // Fetch the system username
        const username = os.userInfo().username || 'Guest';

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`Hello, ${username}!`);
    } catch (error) {
        console.error('Error:', error);
        res.statusCode = 500;
        res.end('Internal Server Error');
    }
});

// Listen for incoming requests
server.listen(PORT,() => {
    console.log(`Server running at ${PORT}`);
});
