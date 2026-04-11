# 🔧 Local Model Agent Optimization — Fix Guide

## Problem Analysis

Your local models (Qwen 3.5B, Deepseek Coder 6.7B) are failing because:

1. **Analysis Instead of Execution**: Models analyze requests (JSON classification) instead of generating code
2. **No Sequential Fallback**: Trying to run everything in parallel kills smaller models
3. **Poor Prompt Framing**: Generic prompts confuse local models
4. **No Output Validation**: Bad output passes through without correction

## Solution: 4-Layer Fix

### Layer 1: Prompt Optimization for Local Models
Local models work better with:
- **Direct requests** (no meta-analysis)
- **One task at a time** (sequential, not parallel)
- **Code-first format** (show examples, not questions)
- **Explicit structure** (clear start/end markers)

### Layer 2: Sequential Execution System
- ❌ Remove parallel execution for local models
- ✅ Add task queue system
- ✅ Wait for completion before next task
- ✅ Add retry logic for failures

### Layer 3: Output Validation & Correction
- Detect when model outputs analysis instead of code
- Auto-prompt for correction: "Generate the code directly"
- Validate file format before accepting

### Layer 4: Model-Specific Agents
- Create dedicated handlers for local models
- Different prompts for Qwen vs Deepseek
- Fallback to OpenRouter for complex tasks

---

## Implementation Plan

### Step 1: Create Local Model Detector
```bash
# Check which model is running
ollama list  # For Ollama
lm models    # For other local runners
```

### Step 2: Create Sequential Task Queue
- File: `local-model-agent.js` or `.ts`
- System: Queue tasks, execute one at a time
- Wait for response before next

### Step 3: Create Prompt Templates
- Different prompts for code generation
- Skip analysis phases
- Force direct code output

### Step 4: Create Validation Layer
- Check if output is analysis or code
- If analysis: auto-prompt for code generation
- If code: validate syntax before returning

---

## Quick Implementation

You have 2 options:

### Option A: Use Claude Code Skills (Recommended)
- Create a new skill: `/local-model-agent`
- Integrates with PowerPlay
- Uses built-in sequencing
- Can use tools directly

### Option B: Create Local Agent Script
- Standalone Node.js/Python script
- Calls local model API
- Implements validation
- Can run alongside PowerPlay

Which would you prefer?
