# ExamPulse
### Exam Hall Irregularity Reporting and Management System

**ExamPulse** is a web-based examination hall irregularity reporting and management system developed using the MERN stack. It aims to streamline the reporting, classification, prioritization, and management of examination-related incidents through automated workflows and priority-based scheduling.

The system provides a centralized platform for invigilators to report examination irregularities, administrators to monitor incidents, and designated department personnel to manage and resolve assigned reports.

The project integrates concepts from **Theory of Computation (TOC), Computer Networks (CN), and Full Stack Development (FSD)** to demonstrate the practical application of academic concepts in solving real-world institutional problems.

---

## 1. Problem Statement

During examinations, incidents such as malpractice, medical emergencies, technical failures, disturbances, and missing answer scripts require timely attention and appropriate intervention.

Traditional reporting and handling mechanisms may involve manual communication, delayed escalation, inefficient personnel assignment, and difficulties in tracking the resolution of incidents.

These challenges can affect examination operations and administrative efficiency.

ExamPulse addresses these issues through a centralized digital system that enables structured incident reporting, priority-based scheduling, automatic department mapping, and report tracking.

---

## 2. Proposed Solution

ExamPulse provides an integrated web application through which invigilators can report examination-related irregularities.

The system organizes reports based on predefined categories, assigns priority levels, places reports in a scheduling queue, and routes them to the appropriate departments.

Administrators can monitor reports, manage dispatch operations, and view analytical information, while department personnel can access and resolve reports assigned to their respective departments.

### Key Features

- **Invigilator Authentication:** Login using a structured invigilator identification format.
- **Irregularity Reporting:** Submit examination incidents with relevant details and supporting evidence.
- **Automatic Category-Based Routing:** Map irregularity categories to their designated departments.
- **Priority-Based Scheduling:** Process reports using Critical, High, and Medium priority levels.
- **FIFO Scheduling:** Maintain First-In-First-Out ordering among reports with equal priority.
- **Non-Preemptive Processing:** Allow the currently processing report to finish before selecting the next report.
- **Admin Dashboard:** Monitor reports, categories, departments, dispatch activities, and analytics.
- **Department Staff Dashboard:** View and manage reports assigned to the respective department.
- **Report Tracking:** Monitor report status and resolution progress.
- **Dispatch Management:** View current processing reports, waiting queues, and dispatch history.

---

## 3. Irregularity Categories

The system supports five examination irregularity categories:

| Category | Description |
|---|---|
| Malpractice | Unfair practices or examination misconduct |
| Medical | Medical emergencies or health-related incidents |
| Technical | Technical failures affecting examination operations |
| Disturbance | Disruptions within the examination environment |
| Missing Script | Missing or unaccounted answer scripts |

Each category is associated with a designated department through a configurable category-to-department mapping.

The department mapping is maintained centrally so that it can be adapted to the institution's actual departmental structure.

---

## 4. Priority-Based Scheduling

ExamPulse uses a priority-based scheduling mechanism to determine the order in which waiting reports are processed.

### Priority Levels

| Priority | Description |
|---|---|
| Critical | Requires immediate attention |
| High | Requires urgent attention |
| Medium | Requires normal attention |

### Scheduling Algorithm

The proposed scheduling mechanism follows **Non-Preemptive Priority Scheduling with FIFO ordering**.

The scheduling rules are:

1. Critical reports receive the highest scheduling priority.
2. High-priority reports are processed after Critical reports.
3. Medium-priority reports are processed after High-priority reports.
4. Reports with equal priority are processed in their order of arrival (FIFO).
5. A newly arriving higher-priority report moves ahead of lower-priority reports that are waiting.
6. A report already being processed is not interrupted.

### Scheduling Order

**Critical → High → Medium**

FIFO is used within each priority level.

### Example

Consider the following reports:

| Report ID | Priority | Arrival Time |
|---|---|---|
| R101 | Medium | 10:00 AM |
| R102 | Critical | 10:02 AM |
| R103 | High | 10:03 AM |
| R104 | Critical | 10:04 AM |

If all four reports are waiting, the processing order will be:

**R102 → R104 → R103 → R101**

If R101 was already being processed when R102 arrived, R101 would finish first because the scheduling policy is non-preemptive.

*Note: Priority assignment conditions are configurable and should follow the severity and impact rules approved by the institution. Category alone does not determine priority.*

---

## 5. Automatic Department Assignment

The system uses category-based department mapping to identify the appropriate department for each irregularity report.

The intended workflow is:

1. An invigilator submits an irregularity report.
2. The system identifies its category.
3. The category-to-department mapping determines the destination department.
4. The report is assigned to the appropriate department.
5. Department personnel access and manage the assigned report.

Department names and codes are configurable according to the institution's requirements.

---

## 6. System Modules

### A. Invigilator Portal

- Invigilator login and authentication.
- Examination irregularity report submission.
- Examination branch and hall information.
- Supporting evidence submission.
- View previously submitted reports.
- Track report status.

### B. Admin Portal

- Administrative authentication.
- Dashboard with report statistics.
- View and filter all submitted reports.
- Category management.
- Department overview.
- Report details and tracking.
- Analytics and graphical representations.
- Dispatch management.

### C. Dispatch Management

- Priority-based waiting queue.
- Current processing report.
- Queue position and waiting duration.
- Department-wise report assignment.
- Dispatch status monitoring.
- Dispatch history.
- Scheduling algorithm visualization.

### D. Department Staff Portal

- Department-specific dashboard.
- View reports assigned to the department.
- Access report details and supporting evidence.
- Accept and process assigned reports.
- Add remarks.
- Update report status.
- Mark resolved reports as completed.

---

## 7. Report Status Management

The system maintains report and dispatch information to track the progress of each incident.

### Report Status

- Submitted
- Pending
- Assigned
- In Progress
- Resolved

### Dispatch Status

- Waiting in Queue
- Currently Processing
- Dispatched
- Completed

These statuses help administrators and department personnel monitor the progress of reported incidents.

---

## 8. Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, JavaScript, HTML, CSS |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router DOM |
| UI Components | Lucide React |
| Data Visualization | Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Database Modelling | Mongoose |
| Authentication | JSON Web Token (JWT), bcryptjs |
| API Communication | REST APIs |
| Version Control | Git and GitHub |
| Development Tools | VS Code, npm, Nodemon |

---

## 9. Academic Concepts Integrated

ExamPulse demonstrates the practical application of concepts from three academic subjects.

### Theory of Computation (TOC)

- Deterministic Finite Automata (DFA).
- Regular Expressions.
- Pattern-based validation of Invigilator IDs.
- Input validation using formal patterns.

**Example Invigilator ID format:**

`INV[DEPARTMENT CODE][4 DIGITS]`

Example: `INVCSE2121`

### Computer Networks (CN)

- Client-server architecture.
- HTTP communication.
- RESTful API communication.
- Request and response handling.
- Communication between frontend and backend.
- Data exchange using JSON.

### Full Stack Development (FSD)

- React-based frontend development.
- Node.js and Express.js backend development.
- MongoDB database integration.
- Mongoose data modelling.
- JWT-based authentication.
- Password hashing.
- REST API development and integration.

---

## 10. System Workflow

```text
             INVIGILATOR LOGIN
                     |
                     v
              AUTHENTICATION
                     |
                     v
           SUBMIT IRREGULARITY
                     |
                     v
             REPORT VALIDATION
                     |
                     v
          CATEGORY IDENTIFICATION
                     |
                     v
          PRIORITY ASSIGNMENT
                     |
                     v
          PRIORITY-BASED QUEUE
                     |
                     v
       AUTOMATIC DEPARTMENT MAPPING
                     |
                     v
           DEPARTMENT ASSIGNMENT
                     |
                     v
          REPORT PROCESSING
                     |
                     v
            STATUS UPDATES
                     |
                     v
            REPORT RESOLUTION
                     |
                     v
              DATABASE
```

---

## 11. Project Structure

The following illustrates the intended logical organization of the project. Actual directory names may vary.

```text
ExamPulse/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── admin/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── data/
│   │   └── App.jsx
│   ├── package.json
│   └── README.md
│
├── Backend/
│   ├── algorithms/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── server.js
│   ├── package.json
│   └── README.md
│
└── README.md
```

---

## 12. Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm.
- MongoDB Atlas account or a local MongoDB installation.
- Git.
- Visual Studio Code (recommended).

### Clone the Repository

```bash
git clone <repository-url>
cd ExamPulse
```

### Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local development URL, usually:

```text
http://localhost:5173
```

### Backend Setup

Open a separate terminal and navigate to the backend directory:

```bash
cd Backend
npm install
```

Configure the required environment variables in the backend `.env` file according to the backend configuration.

Start the backend development server:

```bash
npm run dev
```

Refer to the backend README for the exact environment variables, API configuration, and server instructions.

*Note: The frontend and backend must be configured to communicate using the appropriate API base URL and CORS settings.*

---

## 13. Implementation Status

The project is being developed in the following stages:

| Part | Module | Status |
|---|---|---|
| Part A | Invigilator Portal | Completed |
| Part B | Admin Dashboard and Report Management | Completed |
| Part C | Priority Scheduling and Department Dispatch Interface | Completed |
| Part D | Backend Development and Database Integration | In Progress |

The frontend modules use mock data where backend integration is pending.

The final integrated application will use backend services for persistent data storage, authentication, authorization, priority assignment, scheduling, and department-specific report management.

---

## 14. Testing and Validation

The integrated application should be tested for:

- Invigilator authentication and ID validation.
- Report submission and input validation.
- Category identification.
- Priority assignment.
- Category-to-department mapping.
- Priority queue ordering.
- FIFO ordering for equal priorities.
- Non-preemptive scheduling.
- Department-specific access control.
- Report status updates.
- Database operations.
- API communication.
- Authentication and authorization.
- Error handling and invalid requests.

---

## 15. Future Enhancements

- Real-time notifications for assigned department personnel.
- Automated escalation of unresolved reports.
- Dynamic personnel workload management.
- Real-time dispatch monitoring.
- Advanced examination analytics.
- Detailed audit logs.
- Enhanced reporting and institutional performance analysis.

---

## 16. Project Information

| Attribute | Details |
|---|---|
| Project Name | ExamPulse |
| Project Domain | Full Stack Web Development |
| Architecture | MERN Stack |
| Academic Subjects | Theory of Computation, Computer Networks, Full Stack Development |
| Application Type | Web-Based Examination Management System |

---

## ExamPulse

**Making Examination Management Smarter, Faster, and More Accountable.**