# Advanced Web Security Lab

**Intentionally Vulnerable & Secured Web Application**

An academic security lab designed to demonstrate real-world web application vulnerabilities, their exploitation in practice, and corresponding secure implementations.

---

## Table of Contents

- [Project Description](#project-description)
- [Project Structure](#project-structure)
- [Environment & Technologies](#environment--technologies)
- [Running the Project](#running-the-project)
- [The Two Servers](#the-two-servers)
- [Vulnerabilities & POC Scripts](#vulnerabilities--poc-scripts)
- [Running the Attacks (POC)](#running-the-attacks-poc)
- [Fixed Server – Security Improvements](#fixed-server--security-improvements)
- [Ethical Disclaimer](#ethical-disclaimer)
- [Summary](#summary)
- [References](#references)

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

- **Docker** + **Docker Compose**
- **Python 3** (for attack scripts)

### Start the environment

From the project root directory:

```bash
docker-compose up --build
```

This starts:

- MongoDB  
- Vulnerable backend server  
- Fixed backend server  
- Frontend application  

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
