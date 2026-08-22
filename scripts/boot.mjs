import { spawn } from "node:child_process";
import { existsSync } from "node:fs";

const port = process.env.PORT || "3000";

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", env: process.env });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} exited ${code}`));
    });
  });
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./prisma/dev.db";
}

await run("npx", ["prisma", "db", "push", "--skip-generate"]);
await run("npx", ["tsx", "prisma/seed.ts"]);

const nextBin = existsSync("node_modules/next/dist/bin/next")
  ? "node_modules/next/dist/bin/next"
  : "next";

const child = spawn(process.execPath, [nextBin, "start", "-H", "0.0.0.0", "-p", String(port)], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 0));
