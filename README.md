# Advanced Web Security Lab

**Intentionally Vulnerable & Secured Web Application**

An academic security lab designed to demonstrate real-world web application vulnerabilities, their exploitation in practice, and corresponding secure implementations.

**Instructors / first-time setup:** See **[Quick Start from Zero](#quick-start-from-zero)** for step-by-step instructions to run the entire lab from a clean environment.

---

## Table of Contents

- [Quick Start from Zero](#quick-start-from-zero) *(for instructors / first-time setup)*
- [Project Description](#project-description)
- [Project Structure](#project-structure)
- [Environment & Technologies](#environment--technologies)
- [Running the Project](#running-the-project)
- [Ports & URLs](#ports--urls)
- [The Two Servers](#the-two-servers)
- [Vulnerabilities & POC Scripts](#vulnerabilities--poc-scripts)
- [Running the Attacks (POC)](#running-the-attacks-poc)
- [Fixed Server – Security Improvements](#fixed-server--security-improvements)
- [Ethical Disclaimer](#ethical-disclaimer)
- [Summary](#summary)
- [References](#references)

---

## Quick Start from Zero

This section describes how to run the entire lab from scratch. Follow the steps in order.

### Step 1: Prerequisites

Install the following on your machine:

| Requirement | Purpose | How to verify |
|-------------|---------|----------------|
| **Docker** + **Docker Compose** | Run MongoDB in a container | `docker --version` and `docker compose version` |
| **Node.js** (v18+ recommended) | Run the backend servers | `node --version` |
| **Python 3** (3.8+) | Run the exploit POC scripts | `python --version` or `python3 --version` |

### Step 2: Get the project

Open a terminal and go to the project folder:

```bash
cd path/to/advanced-sec-lab
```

*(Replace `path/to/advanced-sec-lab` with the actual path where the project is located.)*

### Step 3: Start MongoDB

From the **project root** (`advanced-sec-lab/`), start MongoDB with Docker Compose:

```bash
docker compose up -d
```

Wait until the container is running. Check with:

```bash
docker compose ps
```

You should see the `mongo` service running. Leave this terminal as-is (MongoDB keeps running in the background).

### Step 4: Install Node.js dependencies

In the **project root**, install dependencies once:

```bash
npm install
```

### Step 5: Start the backend servers

You need **two** terminal windows (or tabs), both in the project root.

**Terminal A – Vulnerable server (port 5000):**

```bash
npm run start:vuln
```

Wait until you see: `Server running: http://localhost:5000` and `Database Connected`. Leave this terminal open.

**Terminal B – Fixed server (port 5001):**

```bash
npm run start:fixed
```

Wait until you see: `Fixed Server: http://localhost:5001` and `Fixed DB Connected`. Leave this terminal open.

### Step 6: Open the frontend

**Option A – Open the HTML file directly:**  
Double-click `frontend/index.html` or open it in your browser (e.g. `file:///.../advanced-sec-lab/frontend/index.html`).

**Option B – Serve via a simple HTTP server (recommended):**  
In a **third** terminal, from the project root:

```bash
npx serve frontend -p 3000
```

Then open in your browser: **http://localhost:3000**

In the UI you can switch between **Vulnerable** (port 5000) and **Fixed** (port 5001) to compare behavior.

### Step 7: Run the exploit scripts (optional)

To demonstrate the attacks against the **vulnerable** server, use a **new** terminal. Make sure the vulnerable server (Terminal A) and MongoDB are still running.

```bash
cd exploits
python attack_regex.py
python attack_time.py
python attack_mass_assignment.py
python attack_account_takeover.py
python attack_race_condition.py
```

*(On some systems use `python3` instead of `python`.)*

Each script targets the vulnerable server on port 5000 by default.

### Summary – what runs where

| Step | Command / action | Where |
|------|------------------|--------|
| 1 | `docker compose up -d` | Project root |
| 2 | `npm install` | Project root |
| 3 | `npm run start:vuln` | Project root (Terminal A) |
| 4 | `npm run start:fixed` | Project root (Terminal B) |
| 5 | Open `frontend/index.html` or `npx serve frontend -p 3000` | Browser / Terminal C |
| 6 | `python attack_*.py` | From `exploits/` folder |

To **stop** the lab: press `Ctrl+C` in each terminal running the servers, then run `docker compose down` in the project root to stop MongoDB.

---

## Project Description

The system includes two separate backend servers:

| Component | Description |
|-----------|-------------|
| **Vulnerable Server** | Intentionally insecure — used to demonstrate attacks |
| **Fixed Server** | Hardened version implementing proper security controls |

In addition, the project includes:

- A **frontend** web application  
- **Automated attack scripts (POC)**  
- **Docker-based** environment for reproducible execution  

> ⚠️ **Warning:** All vulnerabilities were intentionally implemented for **educational purposes only**. Do not deploy in production or test on systems without authorization.

---

## Project Structure

```
advanced-sec-lab/
│
├── docker-compose.yml
├── package.json
├── .env
├── frontend/                # Web UI
│
├── vulnerable/              # Intentionally vulnerable server
│   ├── server.js
│   └── routes/
│
├── fixed/                   # Secured server implementation
│   ├── server.js
│   └── routes/
│
├── exploits/                # Attack scripts (POC)
│   ├── attack_regex.py
│   ├── attack_time.py
│   ├── attack_mass_assignment.py
│   ├── attack_account_takeover.py
│   └── attack_race_condition.py
│
└── .env
```

---

## Environment & Technologies

| Layer | Technology |
|-------|-------------|
| **Backend** | Node.js + Express |
| **Database** | MongoDB |
| **Frontend** | Web UI |
| **Containerization** | Docker & Docker Compose |
| **Attack automation** | Python scripts |
| **Tools** | VS Code, Postman, curl |

---

## Running the Project

### Prerequisites

- **Docker** + **Docker Compose** (for MongoDB)
- **Node.js** (for backend servers)
- **Python 3** (for attack scripts)

### Start the environment (short version)

1. **MongoDB:** `docker compose up -d`
2. **Dependencies:** `npm install`
3. **Backends:** In two terminals: `npm run start:vuln` and `npm run start:fixed`
4. **Frontend:** Open `frontend/index.html` or run `npx serve frontend -p 3000`

For full step-by-step instructions from a clean machine, see [Quick Start from Zero](#quick-start-from-zero).

---

## Ports & URLs

| Service | Port | URL |
|---------|------|-----|
| **MongoDB** | 27017 | `mongodb://localhost:27017` |
| **Vulnerable backend** | 5000 | http://localhost:5000 |
| **Fixed backend** | 5001 | http://localhost:5001 |
| **Frontend** (if using `npx serve`) | 3000 | http://localhost:3000 |

The exploit scripts default to the **vulnerable** server (port 5000). To target the fixed server from a script that supports it, pass `fixed` as an argument (e.g. `python attack_regex.py fixed`).

---

## The Two Servers

### 1️⃣ Vulnerable Server (Intentionally Insecure)

**Location:** `vulnerable/`

**Purpose:** Demonstrate common and advanced web security vulnerabilities in a realistic environment.

**Key characteristics:**

- No input validation  
- No field-level authorization  
- Unsafe MongoDB queries  
- No concurrency protection  
- Unsafe AI integration  
- Business logic flaws  

### 2️⃣ Fixed Server (Secured Implementation)

**Location:** `fixed/`

**Purpose:** Demonstrate how the same functionality can be implemented securely.

The fixed server is **functionally equivalent** but **resistant to all demonstrated attacks**. See [Fixed Server – Security Improvements](#fixed-server--security-improvements) below.

---

## Vulnerabilities & POC Scripts

### 🔴 Vulnerability 1: NoSQL Injection

| | |
|---|------|
| **Affected endpoint** | Authentication (login) |
| **Description** | User input is passed directly into MongoDB queries without validation or type enforcement. |
| **Exploitation** | Authentication bypass using query operators; password extraction via Regex Injection; blind password extraction via Time-Based Injection (`$where`). |
| **POC scripts** | `exploits/attack_regex.py`, `exploits/attack_time.py` |

### 🔴 Vulnerability 2: Mass Assignment

| | |
|---|------|
| **Affected endpoint** | User update API |
| **Description** | `req.body` is copied directly into the database without field whitelisting or authorization checks. |
| **Impact** | Unauthorized modification of sensitive fields (e.g. account balance); business logic abuse. |
| **POC script** | `exploits/attack_mass_assignment.py` |

### 🔴 Vulnerability 3: Account Takeover

| | |
|---|------|
| **Attack chain** | Mass Assignment → Password reset abuse |
| **Description** | Internal password reset fields can be modified via Mass Assignment, allowing full account takeover. |
| **POC script** | `exploits/attack_account_takeover.py` |

### 🔴 Vulnerability 4: Race Condition

| | |
|---|------|
| **Description** | Critical operations follow a check-then-act pattern without atomicity or synchronization. |
| **Impact** | Logic bypass; operations executed multiple times using parallel requests. |
| **POC script** | `exploits/attack_race_condition.py` |

### 🔴 Vulnerability 5: AI Prompt Injection

| | |
|---|------|
| **Description** | User-controlled input is processed by an AI component whose output is trusted for executing sensitive actions. |
| **Impact** | Unauthorized privileged operations; abuse of AI as a high-privilege intermediary. |
| **Demonstration** | Via the application UI and backend logic. |

---

## Running the Attacks (POC)

From the `exploits/` directory (with the vulnerable server running):

```bash
cd exploits
python attack_regex.py
python attack_time.py
python attack_mass_assignment.py
python attack_account_takeover.py
python attack_race_condition.py
```

Each script demonstrates **real exploitation** against the running vulnerable server.

---

## Fixed Server – Security Improvements

- Strict **server-side input validation**  
- **Field-level whitelisting**  
- Proper **authorization checks**  
- **Secure password reset** mechanism  
- **Atomic database operations** / race condition prevention  
- **AI output validation**  
- **Human-in-the-Loop** approval for sensitive actions  
- Clear **separation** between advisory AI and execution logic  

---

## Ethical Disclaimer

This project was developed **strictly for academic and educational purposes**.

- **Do not** deploy this system in production.  
- **Do not** test these techniques on real systems without authorization.  

---

## Summary

This project demonstrates that:

- Web vulnerabilities often stem from **architecture and business logic**, not only bad input.  
- Modern applications introduce new attack surfaces such as **AI** and **concurrency**.  
- Effective security requires **server-side enforcement** and **holistic design**.  

---

## References

- [OWASP Top 10 Web Application Security Risks](https://owasp.org/www-project-top-ten/)
- [OWASP NoSQL Injection](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05-Testing_for_NoSQL_Injection) & [Mass Assignment](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html)
- [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [MongoDB Official Documentation](https://www.mongodb.com/docs/)
- [MITRE CWE-20 – Improper Input Validation](https://cwe.mitre.org/data/definitions/20.html)
- [MITRE CWE-362 – Race Condition](https://cwe.mitre.org/data/definitions/362.html)
