# Advanced Web Security Lab

**Intentionally Vulnerable & Secured Web Application**

An academic security lab that demonstrates real-world web application vulnerabilities, their exploitation, and secure implementations side by side.

---

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [The Two Servers](#the-two-servers)
- [Vulnerabilities & POC Scripts](#vulnerabilities--poc-scripts)
- [Fixed Server – Security Measures](#fixed-server--security-measures)
- [Ethical Disclaimer](#ethical-disclaimer)
- [References](#references)

---

## Overview

This project provides:

| Component | Description |
|-----------|-------------|
| **Vulnerable Server** | Intentionally insecure backend to demonstrate attacks |
| **Fixed Server** | Hardened backend with proper security controls |
| **Frontend** | Web UI for both environments |
| **Exploits (POC)** | Automated Python scripts that demonstrate each vulnerability |
| **Docker** | Reproducible environment (MongoDB + both servers + frontend) |

> **Warning:** All vulnerabilities are intentional and for **educational use only**. Do not deploy in production or test on systems without authorization.

---

## Project Structure

```
advanced-sec-lab/
├── docker-compose.yml
├── package.json
├── .env
├── frontend/                    # Web UI
├── vulnerable/                  # Intentionally vulnerable server
│   ├── server.js
│   └── routes/
├── fixed/                       # Secured server implementation
│   ├── server.js
│   └── routes/
└── exploits/                    # Attack scripts (POC)
    ├── attack_regex.py
    ├── attack_time.py
    ├── attack_mass_assignment.py
    ├── attack_account_takeover.py
    └── attack_race_condition.py
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express |
| Database | MongoDB |
| Frontend | Web UI |
| Containers | Docker, Docker Compose |
| Attack automation | Python 3 |
| Tools | VS Code, Postman, curl |

---

## Quick Start

### Prerequisites

- **Docker** and **Docker Compose**
- **Python 3** (for running exploit scripts)

### Start the environment

From the project root (`advanced-sec-lab/`):

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

### 1. Vulnerable Server (`vulnerable/`)

**Purpose:** Demonstrate common and advanced web security vulnerabilities in a realistic setting.

**Characteristics:**

- No input validation
- No field-level authorization
- Unsafe MongoDB queries
- No concurrency protection
- Unsafe AI integration
- Business logic flaws

### 2. Fixed Server (`fixed/`)

**Purpose:** Show how the same features can be implemented securely.

**Characteristics:**

- Functionally equivalent to the vulnerable version
- Resistant to all demonstrated attacks (see [Vulnerabilities & POC Scripts](#vulnerabilities--poc-scripts) and [Fixed Server – Security Measures](#fixed-server--security-measures))

---

## Vulnerabilities & POC Scripts

| # | Vulnerability | Affected Area | POC Script |
|---|---------------|---------------|------------|
| 1 | **NoSQL Injection** | Authentication (login) | `attack_regex.py`, `attack_time.py` |
| 2 | **Mass Assignment** | User update API | `attack_mass_assignment.py` |
| 3 | **Account Takeover** | Mass Assignment → Password reset | `attack_account_takeover.py` |
| 4 | **Race Condition** | Critical operations (check-then-act) | `attack_race_condition.py` |
| 5 | **AI Prompt Injection** | AI-driven sensitive actions | Via UI + backend |

### Vulnerability details

#### 1. NoSQL Injection

- **Description:** User input is passed directly into MongoDB queries without validation or type enforcement.
- **Exploitation:** Auth bypass with query operators; password extraction via regex injection; blind extraction via time-based injection (`$where`).
- **Scripts:** `exploits/attack_regex.py`, `exploits/attack_time.py`

#### 2. Mass Assignment

- **Description:** `req.body` is copied directly into the database without field whitelisting or authorization.
- **Impact:** Unauthorized changes to sensitive fields (e.g. balance), business logic abuse.
- **Script:** `exploits/attack_mass_assignment.py`

#### 3. Account Takeover

- **Description:** Internal password-reset fields are modifiable via Mass Assignment, leading to full account takeover.
- **Script:** `exploits/attack_account_takeover.py`

#### 4. Race Condition

- **Description:** Critical operations use check-then-act logic without atomicity or synchronization.
- **Impact:** Logic bypass; same operation executed multiple times via parallel requests.
- **Script:** `exploits/attack_race_condition.py`

#### 5. AI Prompt Injection

- **Description:** User-controlled input is sent to an AI component whose output is trusted for sensitive actions.
- **Impact:** Unauthorized privileged operations; AI used as a high-privilege intermediary.
- **Demonstration:** Via the application UI and backend logic.

### Running the POC scripts

From the `exploits/` directory (with the vulnerable server running):

```bash
cd exploits
