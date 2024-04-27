const net = require("net");

function formatOSCMessage(address, ...args) {
  // OSC message format: {address pattern}\0{type tags}{arguments}\0
  let message = `${address}\0`;

  // Append type tags
  const typeTags = args
    .map((arg) => {
      if (typeof arg === "number") {
        return "f"; // Float
      } else if (typeof arg === "string") {
        return "s"; // String
      } else {
        // Handle other types as needed
        return "";
      }
    })
    .join("");

  message += `,${typeTags}`;

  // Append arguments
  args.forEach((arg) => {
    if (typeof arg === "number") {
      message += `,${arg}`;
    } else if (typeof arg === "string") {
      message += `,${arg}`;
    }
    // Handle other types as needed
  });

  // Append null terminator
  message += "\0";

  return message;
}

// Create a TCP server
const server = net.createServer((socket) => {
  // New client connected
  console.log("Client connected:", socket.remoteAddress, socket.remotePort);

  // Example OSC message
  const address = "/example";
  const arg1 = 42; // Example numeric argument
  const arg2 = "hello"; // Example string argument

  // Format the OSC message
  const oscMessage = formatOSCMessage(address, arg1, arg2);

  // Send the OSC message to the client
  socket.write(oscMessage);

  // Handle data received from the client
  socket.on("data", (data) => {
    console.log("Data received from client:", data.toString());

    // Echo the received data back to the client
    socket.write("Server received: " + data.toString());
  });

  // Handle client disconnection
  socket.on("end", () => {
    console.log(
      "Client disconnected:",
      socket.remoteAddress,
      socket.remotePort
    );
  });

  // Handle errors
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// Start listening on a specific port and host
const port = 3000;
const host = "127.0.0.1"; // Use '0.0.0.0' to listen on all available network interfaces
server.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`);
});
