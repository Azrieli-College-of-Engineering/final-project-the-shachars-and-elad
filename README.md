Advanced Web Security Lab

Intentionally Vulnerable & Secured Web Application

Project Description

This project is an academic security lab designed to demonstrate real-world web application vulnerabilities, their exploitation in practice, and corresponding secure implementations.

The system includes two separate backend servers:

Vulnerable Server – intentionally insecure, used to demonstrate attacks

Fixed Server – hardened version implementing proper security controls

In addition, the project includes:

A frontend web application

Automated attack scripts (POC)

Docker-based environment for reproducible execution

⚠️ All vulnerabilities were intentionally implemented for educational purposes only.

Project Structure
advanced-sec-lab/
│
├── docker-compose.yml
├── package.json
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
Environment & Technologies

Backend: Node.js + Express

Database: MongoDB

Frontend: Web UI (client-side)

Containerization: Docker & Docker Compose

Attack Automation: Python scripts

Tools: VS Code, Postman, curl

Running the Project
Prerequisites

Docker + Docker Compose installed

Python 3 (for attack scripts)

Start the Environment

From the advanced-sec-lab directory:

docker-compose up --build

This will start:

MongoDB

Vulnerable backend server

Fixed backend server

Frontend application

The Two Servers Explained
1️⃣ Vulnerable Server (Intentionally Insecure)

Location:

advanced-sec-lab/vulnerable/

Purpose:
Demonstrate common and advanced web security vulnerabilities in a realistic environment.

Key Characteristics

No input validation

No field-level authorization

Unsafe MongoDB queries

No concurrency protection

Unsafe AI integration

Business logic flaws

Implemented Vulnerabilities & Attacks
🔴 Vulnerability 1: NoSQL Injection

Endpoints: Authentication (login)

Description:
User input is passed directly into MongoDB queries without validation or type enforcement.

Attacks:

Authentication Bypass using query operators

Password extraction using Regex Injection

Blind password extraction using Time-Based Injection ($where)

Attack Scripts:

exploits/attack_regex.py
exploits/attack_time.py
🔴 Vulnerability 2: Mass Assignment

Endpoints: User update API

Description:
req.body is copied directly into the database without whitelisting or authorization checks.

Impact:

Unauthorized modification of sensitive fields (e.g., balance)

Manipulation of internal security fields

Attack Script:

exploits/attack_mass_assignment.py
🔴 Vulnerability 3: Account Takeover

Chain: Mass Assignment → Password Reset Abuse

Description:
Internal password reset fields can be modified via Mass Assignment, allowing full account takeover.

Attack Script:

exploits/attack_account_takeover.py
🔴 Vulnerability 4: Race Condition

Description:
Critical operations follow a check-then-act pattern without atomicity.

Impact:

Logic bypass

Operations executed multiple times via parallel requests

Attack Script:

exploits/attack_race_condition.py
🔴 Vulnerability 5: AI Prompt Injection

Description:
User-controlled input is processed by an AI component whose output is trusted for executing sensitive actions.

Impact:

Unauthorized privileged operations

Abuse of AI as a high-privilege intermediary

(Demonstrated via the application UI and backend logic)

Running the Attacks (POC)

From the exploits/ directory:

python attack_regex.py
python attack_time.py
python attack_mass_assignment.py
python attack_account_takeover.py
python attack_race_condition.py

Each script demonstrates real exploitation against the running vulnerable server.

2️⃣ Fixed Server (Secured Implementation)

Location:

advanced-sec-lab/fixed/

Purpose:
Demonstrate how the same functionality can be implemented securely.

Security Improvements

Strict server-side input validation

Field-level whitelisting

Proper authorization checks

Secure password reset mechanism

Atomic operations / race condition prevention

AI output validation and Human-in-the-Loop enforcement

Clear separation between advisory AI and execution logic

The fixed server is functionally equivalent, but resistant to all demonstrated attacks.

Ethical Disclaimer

This project was developed strictly for academic and educational purposes.

Do NOT deploy this code in production

Do NOT test these techniques on real systems without authorization

Summary

This project demonstrates that:

Web vulnerabilities often arise from architecture and logic, not just bad input

Modern systems introduce new attack surfaces (AI, concurrency, business logic)

Security must be enforced server-side, end-to-end
