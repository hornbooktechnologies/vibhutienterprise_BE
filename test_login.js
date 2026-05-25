const http = require("http");

const data = JSON.stringify({
  email: "admin@vibhuti.com",
  password: "admin123"
});

const options = {
  hostname: "localhost",
  port: 8001,
  path: "/api/auth/login",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
    "Origin": "http://localhost:3002"
  }
};

console.log("Sending login request to Vibhuti API...");
const req = http.request(options, (res) => {
  let body = "";
  
  res.on("data", (chunk) => {
    body += chunk;
  });

  res.on("end", () => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log("Response Body:");
    try {
      console.log(JSON.stringify(JSON.parse(body), null, 2));
    } catch {
      console.log(body);
    }
  });
});

req.on("error", (error) => {
  console.error("Error connecting to server:", error);
});

req.write(data);
req.end();
