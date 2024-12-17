import { spawn, ChildProcess } from "child_process";

export function runCode(code: string, language: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let process: ChildProcess | undefined;

    const timer = setTimeout(() => {
      if (process) process.kill();
      reject("Execution timed out.");
    }, 5000);

    if (language === "python") {
      process = spawn("python3", ["-c", code]);
    } else if (language === "javascript") {
      process = spawn("node", ["-e", code]);
    }

    let output = "";
    let errorOutput = "";

    process?.stdout?.on("data", (data) => (output += data.toString()));
    process?.stderr?.on("data", (data) => (errorOutput += data.toString()));

    process?.on("close", (exitCode) => {
      clearTimeout(timer);

      if (exitCode === 0) {
        resolve(output.trim());
      } else {
        reject(errorOutput.trim() || "An unknown error occurred."); // Error
      }
    });

    process?.on("error", (err) => {
      clearTimeout(timer);
      reject(`Failed to start process: ${err.message}`);
    });
  });
}