#!/usr/bin/env node

/**
 * Local Model Agent - PowerPlay Local Model Optimizer
 * Works with Qwen, Deepseek, Ollama, LM Studio
 * Sequential execution + output validation + auto-correction
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ═══════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════

const CONFIG = {
  models: {
    qwen: {
      name: "Qwen Coder 3.5B",
      endpoint: "http://localhost:11434/api/generate",
      modelName: "qwen:latest",
      temperature: 0.1, // Lower temp = more deterministic code
      topP: 0.9,
    },
    deepseek: {
      name: "Deepseek Coder 6.7B",
      endpoint: "http://localhost:11434/api/generate",
      modelName: "deepseek-coder:latest",
      temperature: 0.1,
      topP: 0.9,
    },
    llama: {
      name: "Llama 2 7B",
      endpoint: "http://localhost:11434/api/generate",
      modelName: "llama2:latest",
      temperature: 0.2,
      topP: 0.9,
    },
  },
  timeout: 60000, // 60 seconds per request
  retries: 2,
  maxTokens: 4096,
};

// ═══════════════════════════════════════════════════════════════════
// PROMPT TEMPLATES FOR LOCAL MODELS
// ═══════════════════════════════════════════════════════════════════

const PROMPTS = {
  directCode: (task) => `TASK: Generate code directly.
DO NOT analyze, explain, or classify. Write only the code.

REQUEST: ${task}

OUTPUT FORMAT:
\`\`\`[language]
[code only]
\`\`\`
`,

  codeFile: (filename, task) => `TASK: Create ${filename}

REQUIREMENTS:
- Generate complete, working code
- Include all necessary imports and setup
- NO explanations, just code
- Ready to use immediately

REQUEST: ${task}

START CODE:
`,

  fix: (previousOutput) => `Previous output was analysis, not code.
GENERATE CODE DIRECTLY NOW.

Previous:
${previousOutput}

Generate the actual code without any explanation.
`,

  sequential: (steps) => `EXECUTE THESE STEPS SEQUENTIALLY (one at a time):

${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

For each step:
1. Complete it fully
2. Wait for confirmation
3. Move to next step

Start with Step 1:
`,
};

// ═══════════════════════════════════════════════════════════════════
// DETECTION LOGIC
// ═══════════════════════════════════════════════════════════════════

/**
 * Detect if output is analysis instead of code
 */
function isAnalysisOutput(text) {
  const analysisPatterns = [
    /classification|category|scope|reasoning/i,
    /user_intent|user_requirement|command_selection/i,
    /"(category|scope|reasoning|classification)"/,
    /json|{[\s\n]+".*":/,
    /plan:|execution:|next:/i,
  ];

  return analysisPatterns.some((pattern) => pattern.test(text));
}

/**
 * Detect if output is valid code
 */
function isValidCode(text) {
  const codePatterns = [
    /^(function|const|let|class|import|export|<!DOCTYPE|<html|def |class |function )/m,
    /```[\w]*\n/,
    /\{\s*$|function.*\{/m,
  ];

  return codePatterns.some((pattern) => pattern.test(text));
}

/**
 * Extract code from markdown blocks
 */
function extractCode(text) {
  const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/;
  const match = text.match(codeBlockRegex);
  return match ? match[1].trim() : text.trim();
}

// ═══════════════════════════════════════════════════════════════════
// LOCAL MODEL API CALLER
// ═══════════════════════════════════════════════════════════════════

/**
 * Call local model (Ollama-compatible API)
 */
async function callLocalModel(prompt, modelConfig, options = {}) {
  const {
    temperature = modelConfig.temperature,
    maxTokens = CONFIG.maxTokens,
    retryCount = 0,
  } = options;

  try {
    console.log(`\n📡 Calling ${modelConfig.name}...`);

    const response = await fetch(modelConfig.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelConfig.modelName,
        prompt: prompt,
        temperature: temperature,
        top_p: modelConfig.topP,
        num_predict: maxTokens,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.status} - Is local model running?`
      );
    }

    const data = await response.json();
    let output = data.response || "";

    // ────────────────────────────────────────────────────────────────
    // VALIDATION & CORRECTION
    // ────────────────────────────────────────────────────────────────

    if (isAnalysisOutput(output)) {
      console.log("⚠️  Output is analysis, not code. Retrying...");

      if (retryCount < CONFIG.retries) {
        const correctionPrompt = PROMPTS.fix(output);
        return callLocalModel(correctionPrompt, modelConfig, {
          temperature: Math.max(0.05, temperature - 0.05), // Even lower temp
          retryCount: retryCount + 1,
        });
      } else {
        console.error(
          "❌ Failed to generate code after retries. Model returned analysis."
        );
        return null;
      }
    }

    if (!isValidCode(output)) {
      console.warn(
        "⚠️  Output doesn't look like code. Proceeding anyway...\n"
      );
    }

    return output;
  } catch (error) {
    console.error(`❌ Error calling model: ${error.message}`);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════
// SEQUENTIAL TASK QUEUE
// ═══════════════════════════════════════════════════════════════════

class TaskQueue {
  constructor() {
    this.tasks = [];
    this.isRunning = false;
    this.results = [];
  }

  /**
   * Add task to queue
   */
  addTask(description, generator) {
    this.tasks.push({ description, generator, status: "pending" });
    return this;
  }

  /**
   * Execute tasks sequentially (NOT in parallel)
   */
  async execute(modelConfig) {
    if (this.isRunning) {
      console.error("❌ Queue already running");
      return this.results;
    }

    this.isRunning = true;
    console.log(`\n🚀 Executing ${this.tasks.length} task(s) sequentially...\n`);

    for (let i = 0; i < this.tasks.length; i++) {
      const task = this.tasks[i];
      const taskNum = i + 1;

      console.log(`\n${"═".repeat(60)}`);
      console.log(`📋 TASK ${taskNum}/${this.tasks.length}: ${task.description}`);
      console.log(`${"═".repeat(60)}`);

      try {
        const prompt = typeof task.generator === "function"
          ? task.generator()
          : task.generator;

        const result = await callLocalModel(prompt, modelConfig);

        if (result) {
          task.status = "completed";
          this.results.push({
            taskNum,
            description: task.description,
            output: result,
            status: "success",
          });
          console.log(`✅ Task ${taskNum} completed`);
        } else {
          task.status = "failed";
          this.results.push({
            taskNum,
            description: task.description,
            status: "failed",
            error: "Model returned null",
          });
          console.log(`❌ Task ${taskNum} failed`);
        }

        // WAIT before next task (give model time to recover)
        if (i < this.tasks.length - 1) {
          console.log("\n⏳ Waiting 2 seconds before next task...");
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } catch (error) {
        task.status = "error";
        this.results.push({
          taskNum,
          description: task.description,
          status: "error",
          error: error.message,
        });
        console.error(`❌ Task ${taskNum} error: ${error.message}`);
      }
    }

    this.isRunning = false;
    return this.results;
  }

  /**
   * Get results summary
   */
  getSummary() {
    const completed = this.results.filter((r) => r.status === "success").length;
    const failed = this.results.filter((r) => r.status !== "success").length;

    return {
      total: this.results.length,
      completed,
      failed,
      results: this.results,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════
// USER INTERACTION
// ═══════════════════════════════════════════════════════════════════

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

// ═══════════════════════════════════════════════════════════════════
// MAIN AGENT
// ═══════════════════════════════════════════════════════════════════

async function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║          LOCAL MODEL AGENT - PowerPlay Optimizer             ║
║     Works with Qwen, Deepseek, Llama, and more              ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  // Select model
  const modelChoice = await question(
    `\n📦 Select model:
  1. Qwen Coder 3.5B
  2. Deepseek Coder 6.7B
  3. Llama 2 7B

  Enter choice (1-3): `
  );

  const modelMap = { "1": "qwen", "2": "deepseek", "3": "llama" };
  const selectedModel = modelMap[modelChoice];

  if (!selectedModel) {
    console.error("❌ Invalid selection");
    rl.close();
    return;
  }

  const modelConfig = CONFIG.models[selectedModel];
  console.log(`\n✅ Using: ${modelConfig.name}`);

  // Get task type
  const taskType = await question(
    `\n📝 What do you want to do?
  1. Generate code directly
  2. Create file with code
  3. Execute multiple tasks (sequential)
  4. Fix bad output from previous run

  Enter choice (1-4): `
  );

  if (taskType === "1") {
    // Direct code generation
    const task = await question("\n📌 Describe what code you want: ");
    const prompt = PROMPTS.directCode(task);
    const result = await callLocalModel(prompt, modelConfig);

    if (result) {
      console.log("\n" + "═".repeat(60));
      console.log("GENERATED CODE:");
      console.log("═".repeat(60));
      console.log(result);
      console.log("═".repeat(60));
    }
  } else if (taskType === "2") {
    // Create file
    const filename = await question("\n📁 Filename (e.g., index.html): ");
    const task = await question("📌 Describe what code you want: ");
    const prompt = PROMPTS.codeFile(filename, task);
    const result = await callLocalModel(prompt, modelConfig);

    if (result) {
      const code = extractCode(result);
      fs.writeFileSync(filename, code);
      console.log(`\n✅ File created: ${filename}`);
      console.log(`📊 Size: ${code.length} bytes`);
    }
  } else if (taskType === "3") {
    // Sequential tasks
    const queue = new TaskQueue();
    let addMore = true;

    while (addMore) {
      const desc = await question("\n📋 Task description: ");
      queue.addTask(desc, PROMPTS.directCode(desc));

      const more = await question("Add another task? (y/n): ");
      addMore = more.toLowerCase() === "y";
    }

    const results = await queue.execute(modelConfig);
    const summary = queue.getSummary();

    console.log(`\n${"═".repeat(60)}`);
    console.log(`📊 RESULTS: ${summary.completed}/${summary.total} completed`);
    console.log(`${"═".repeat(60)}`);

    summary.results.forEach((r) => {
      if (r.status === "success") {
        console.log(`✅ Task ${r.taskNum}: ${r.description}`);
      } else {
        console.log(`❌ Task ${r.taskNum}: ${r.description}`);
      }
    });
  }

  console.log("\n✨ Done!");
  rl.close();
}

// Run
main().catch(console.error);
