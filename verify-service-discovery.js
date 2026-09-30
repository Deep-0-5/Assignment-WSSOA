/**
 * Service Discovery Verification Script
 * Proves that changing service locations via configuration/environment variables
 * automatically updates the gateway's routing table without any code changes.
 */

const http = require("http");
const { spawn } = require("child_process");
const path = require("path");

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on("error", reject);
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTest() {
  console.log("==================================================");
  console.log(" LAB 7 - SERVICE DISCOVERY CONFIGURATION TEST");
  console.log("==================================================");

  const gatewayDir = path.join(__dirname, "api-gateway");

  // TEST 1: Default configuration
  console.log("\n[Test 1] Starting Gateway with Standard Configuration...");
  const child1 = spawn(process.execPath, ["server.js"], {
    cwd: gatewayDir,
    env: {
      ...process.env,
      PORT: "8000",
      USER_SERVICE_URL: "http://localhost:3001",
      PRODUCT_SERVICE_URL: "http://localhost:3002",
      ORDER_SERVICE_URL: "http://localhost:3003",
    },
  });
  child1.stdout.on("data", (d) => process.stdout.write(d));
  child1.stderr.on("data", (d) => process.stderr.write(d));

  await wait(2000);

  const res1 = await getJson("http://127.0.0.1:8000/health");
  console.log("Test 1 Gateway /health Response:");
  console.log(JSON.stringify(res1.data, null, 2));

  // Check 502 target URL on unreachable service
  const errRes1 = await getJson("http://127.0.0.1:8000/users");
  console.log("\nTest 1 Downstream Routing Target for /users:");
  console.log(`Target URL: ${errRes1.data.targetUrl} (Status: ${errRes1.status})`);

  child1.kill();
  await wait(1500);

  // TEST 2: Altered configuration (no code change!)
  console.log("\n--------------------------------------------------");
  console.log("[Test 2] Starting Gateway with ALTERED Service Discovery Configuration...");
  console.log("Changing USER_SERVICE_URL to 'http://custom-node-user:9090'");
  console.log("Changing PRODUCT_SERVICE_URL to 'http://custom-node-product:7070'");

  const child2 = spawn(process.execPath, ["server.js"], {
    cwd: gatewayDir,
    env: {
      ...process.env,
      PORT: "8000",
      USER_SERVICE_URL: "http://custom-node-user:9090",
      PRODUCT_SERVICE_URL: "http://custom-node-product:7070",
      ORDER_SERVICE_URL: "http://localhost:3003",
    },
  });
  child2.stdout.on("data", (d) => process.stdout.write(d));
  child2.stderr.on("data", (d) => process.stderr.write(d));

  await wait(2000);

  const res2 = await getJson("http://127.0.0.1:8000/health");
  console.log("Test 2 Gateway /health Response:");
  console.log(JSON.stringify(res2.data, null, 2));

  const errRes2 = await getJson("http://127.0.0.1:8000/users");
  console.log("\nTest 2 Downstream Routing Target for /users:");
  console.log(`Target URL: ${errRes2.data.targetUrl} (Status: ${errRes2.status})`);

  child2.kill();
  await wait(1000);

  console.log("\n==================================================");
  if (
    errRes1.data.targetUrl === "http://localhost:3001" &&
    errRes2.data.targetUrl === "http://custom-node-user:9090"
  ) {
    console.log(">>> SUCCESS: Configuration-based service discovery verified!");
    console.log(">>> Routing targets changed dynamically without modifying source code.");
  } else {
    console.log(">>> FAILURE: Routing target did not match expected dynamic config.");
  }
  console.log("==================================================");
}

runTest().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
