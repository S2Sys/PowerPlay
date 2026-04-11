#!/usr/bin/env python3

"""
Local Model Agent - PowerPlay Local Model Optimizer
Works with Qwen, Deepseek, Ollama, LM Studio
Sequential execution + output validation + auto-correction
"""

import json
import requests
import time
import sys
from typing import Optional, List, Dict, Any
from pathlib import Path
import re

# ═══════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════

CONFIG = {
    "models": {
        "qwen": {
            "name": "Qwen Coder 3.5B",
            "endpoint": "http://localhost:11434/api/generate",
            "model_name": "qwen:latest",
            "temperature": 0.1,
            "top_p": 0.9,
        },
        "deepseek": {
            "name": "Deepseek Coder 6.7B",
            "endpoint": "http://localhost:11434/api/generate",
            "model_name": "deepseek-coder:latest",
            "temperature": 0.1,
            "top_p": 0.9,
        },
        "llama": {
            "name": "Llama 2 7B",
            "endpoint": "http://localhost:11434/api/generate",
            "model_name": "llama2:latest",
            "temperature": 0.2,
            "top_p": 0.9,
        },
    },
    "timeout": 60,
    "retries": 2,
    "max_tokens": 4096,
}

# ═══════════════════════════════════════════════════════════════════
# PROMPT TEMPLATES
# ═══════════════════════════════════════════════════════════════════

PROMPTS = {
    "direct_code": lambda task: f"""TASK: Generate code directly.
DO NOT analyze, explain, or classify. Write only the code.

REQUEST: {task}

OUTPUT FORMAT:
```[language]
[code only]
```
""",
    "code_file": lambda filename, task: f"""TASK: Create {filename}

REQUIREMENTS:
- Generate complete, working code
- Include all necessary imports and setup
- NO explanations, just code
- Ready to use immediately

REQUEST: {task}

START CODE:
""",
    "fix": lambda prev_output: f"""Previous output was analysis, not code.
GENERATE CODE DIRECTLY NOW.

Previous:
{prev_output}

Generate the actual code without any explanation.
""",
    "sequential": lambda steps: f"""EXECUTE THESE STEPS SEQUENTIALLY (one at a time):

{chr(10).join(f'{i+1}. {s}' for i, s in enumerate(steps))}

For each step:
1. Complete it fully
2. Wait for confirmation
3. Move to next step

Start with Step 1:
""",
}

# ═══════════════════════════════════════════════════════════════════
# DETECTION FUNCTIONS
# ═══════════════════════════════════════════════════════════════════


def is_analysis_output(text: str) -> bool:
    """Detect if output is analysis instead of code"""
    analysis_patterns = [
        r"classification|category|scope|reasoning",
        r"user_intent|user_requirement|command_selection",
        r'"(category|scope|reasoning|classification)"',
        r"plan:|execution:|next:",
    ]

    for pattern in analysis_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return True
    return False


def is_valid_code(text: str) -> bool:
    """Detect if output is valid code"""
    code_patterns = [
        r"^(function|const|let|class|import|export|<!DOCTYPE|<html|def |class |function )",
        r"```[\w]*\n",
        r"\{\s*$|function.*\{",
    ]

    for pattern in code_patterns:
        if re.search(pattern, text, re.MULTILINE):
            return True
    return False


def extract_code(text: str) -> str:
    """Extract code from markdown blocks"""
    code_block_regex = r"```[\w]*\n([\s\S]*?)```"
    match = re.search(code_block_regex, text)
    return match.group(1).strip() if match else text.strip()

# ═══════════════════════════════════════════════════════════════════
# LOCAL MODEL API CALLER
# ═══════════════════════════════════════════════════════════════════


def call_local_model(
    prompt: str,
    model_config: Dict[str, Any],
    options: Optional[Dict[str, Any]] = None
) -> Optional[str]:
    """Call local model (Ollama-compatible API)"""

    if options is None:
        options = {}

    temperature = options.get("temperature", model_config["temperature"])
    max_tokens = options.get("max_tokens", CONFIG["max_tokens"])
    retry_count = options.get("retry_count", 0)

    try:
        print(f"\n📡 Calling {model_config['name']}...")

        response = requests.post(
            model_config["endpoint"],
            json={
                "model": model_config["model_name"],
                "prompt": prompt,
                "temperature": temperature,
                "top_p": model_config["top_p"],
                "num_predict": max_tokens,
                "stream": False,
            },
            timeout=CONFIG["timeout"],
        )

        if response.status_code != 200:
            print(f"❌ API Error: {response.status_code}")
            print("   Is local model running? (ollama serve)")
            return None

        data = response.json()
        output = data.get("response", "")

        # ────────────────────────────────────────────────────────────────
        # VALIDATION & CORRECTION
        # ────────────────────────────────────────────────────────────────

        if is_analysis_output(output):
            print("⚠️  Output is analysis, not code. Retrying...")

            if retry_count < CONFIG["retries"]:
                correction_prompt = PROMPTS["fix"](output)
                return call_local_model(
                    correction_prompt,
                    model_config,
                    {
                        "temperature": max(0.05, temperature - 0.05),
                        "retry_count": retry_count + 1,
                    },
                )
            else:
                print("❌ Failed to generate code after retries.")
                print("   Model returned analysis instead of code.")
                return None

        if not is_valid_code(output):
            print("⚠️  Output doesn't look like code. Proceeding anyway...\n")

        return output

    except requests.exceptions.ConnectionError:
        print("❌ Connection failed. Is local model running?")
        print("   Try: ollama serve")
        return None
    except requests.exceptions.Timeout:
        print("❌ Request timeout. Local model is too busy.")
        return None
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None

# ═══════════════════════════════════════════════════════════════════
# TASK QUEUE
# ═══════════════════════════════════════════════════════════════════


class TaskQueue:
    """Sequential task execution queue"""

    def __init__(self):
        self.tasks: List[Dict[str, Any]] = []
        self.is_running = False
        self.results: List[Dict[str, Any]] = []

    def add_task(self, description: str, generator):
        """Add task to queue"""
        self.tasks.append({
            "description": description,
            "generator": generator,
            "status": "pending"
        })
        return self

    async def execute(self, model_config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Execute tasks sequentially"""
        if self.is_running:
            print("❌ Queue already running")
            return self.results

        self.is_running = True
        print(f"\n🚀 Executing {len(self.tasks)} task(s) sequentially...\n")

        for i, task in enumerate(self.tasks):
            task_num = i + 1
            print(f"\n{'═' * 60}")
            print(f"📋 TASK {task_num}/{len(self.tasks)}: {task['description']}")
            print(f"{'═' * 60}")

            try:
                # Generate prompt
                if callable(task["generator"]):
                    prompt = task["generator"]()
                else:
                    prompt = task["generator"]

                # Call model
                result = call_local_model(prompt, model_config)

                if result:
                    task["status"] = "completed"
                    self.results.append({
                        "task_num": task_num,
                        "description": task["description"],
                        "output": result,
                        "status": "success",
                    })
                    print(f"✅ Task {task_num} completed")
                else:
                    task["status"] = "failed"
                    self.results.append({
                        "task_num": task_num,
                        "description": task["description"],
                        "status": "failed",
                        "error": "Model returned None",
                    })
                    print(f"❌ Task {task_num} failed")

                # Wait between tasks
                if i < len(self.tasks) - 1:
                    print("\n⏳ Waiting 2 seconds before next task...")
                    time.sleep(2)

            except Exception as e:
                task["status"] = "error"
                self.results.append({
                    "task_num": task_num,
                    "description": task["description"],
                    "status": "error",
                    "error": str(e),
                })
                print(f"❌ Task {task_num} error: {str(e)}")

        self.is_running = False
        return self.results

    def get_summary(self) -> Dict[str, Any]:
        """Get results summary"""
        completed = len([r for r in self.results if r["status"] == "success"])
        failed = len([r for r in self.results if r["status"] != "success"])

        return {
            "total": len(self.results),
            "completed": completed,
            "failed": failed,
            "results": self.results,
        }

# ═══════════════════════════════════════════════════════════════════
# MAIN CLI
# ═══════════════════════════════════════════════════════════════════


def print_header():
    """Print welcome header"""
    print("""
╔═══════════════════════════════════════════════════════════════╗
║          LOCAL MODEL AGENT - PowerPlay Optimizer             ║
║     Works with Qwen, Deepseek, Llama, and more              ║
╚═══════════════════════════════════════════════════════════════╝
    """)


def select_model() -> Dict[str, Any]:
    """Prompt user to select model"""
    print("\n📦 Available models:")
    for i, (key, model) in enumerate(CONFIG["models"].items(), 1):
        print(f"  {i}. {model['name']}")

    while True:
        try:
            choice = input("\nSelect model (1-3): ").strip()
            model_key = list(CONFIG["models"].keys())[int(choice) - 1]
            return CONFIG["models"][model_key]
        except (ValueError, IndexError):
            print("❌ Invalid selection")


def main():
    """Main CLI"""
    print_header()

    # Select model
    model_config = select_model()
    print(f"\n✅ Using: {model_config['name']}")

    # Get task
    print("\n📝 What do you want to do?")
    print("  1. Generate code directly")
    print("  2. Create file with code")
    print("  3. Execute multiple tasks (sequential)")

    task_type = input("\nEnter choice (1-3): ").strip()

    if task_type == "1":
        # Direct code generation
        task = input("\n📌 Describe what code you want: ").strip()
        prompt = PROMPTS["direct_code"](task)
        result = call_local_model(prompt, model_config)

        if result:
            print("\n" + "═" * 60)
            print("GENERATED CODE:")
            print("═" * 60)
            print(result)
            print("═" * 60)

    elif task_type == "2":
        # Create file
        filename = input("\n📁 Filename (e.g., index.html): ").strip()
        task = input("📌 Describe what code you want: ").strip()
        prompt = PROMPTS["code_file"](filename, task)
        result = call_local_model(prompt, model_config)

        if result:
            code = extract_code(result)
            Path(filename).write_text(code)
            print(f"\n✅ File created: {filename}")
            print(f"📊 Size: {len(code)} bytes")

    elif task_type == "3":
        # Sequential tasks
        queue = TaskQueue()
        add_more = True

        while add_more:
            desc = input("\n📋 Task description: ").strip()
            queue.add_task(desc, PROMPTS["direct_code"](desc))

            more = input("Add another task? (y/n): ").strip().lower()
            add_more = more == "y"

        # Note: async not properly handled in sync context, so execute directly
        for i, task in enumerate(queue.tasks):
            task_num = i + 1
            print(f"\n{'═' * 60}")
            print(f"📋 TASK {task_num}/{len(queue.tasks)}: {task['description']}")
            print(f"{'═' * 60}")

            result = call_local_model(task["generator"], model_config)
            if result:
                queue.results.append({
                    "task_num": task_num,
                    "description": task["description"],
                    "output": result,
                    "status": "success",
                })
                print(f"✅ Task {task_num} completed")
            else:
                queue.results.append({
                    "task_num": task_num,
                    "description": task["description"],
                    "status": "failed",
                })
                print(f"❌ Task {task_num} failed")

            if i < len(queue.tasks) - 1:
                print("\n⏳ Waiting 2 seconds before next task...")
                time.sleep(2)

        summary = queue.get_summary()
        print(f"\n{'═' * 60}")
        print(f"📊 RESULTS: {summary['completed']}/{summary['total']} completed")
        print(f"{'═' * 60}")

    print("\n✨ Done!")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Cancelled by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Fatal error: {str(e)}")
        sys.exit(1)
