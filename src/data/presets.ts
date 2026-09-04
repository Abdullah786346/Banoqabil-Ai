import { PresetBug } from '../types';

export const STUDENT_BUG_PRESETS: PresetBug[] = [
  {
    id: 'react-infinite-useeffect',
    title: 'Infinite useEffect Re-render Loop with Objects',
    stack: 'React',
    difficulty: 'Beginner',
    description: 'Passing an unmemoized object or triggering state setter inside useEffect causes an endless re-render cycle.',
    fileName: 'UserProfileCard.tsx',
    code: `import React, { useState, useEffect } from 'react';

export function UserProfileCard({ userId }: { userId: string }) {
  const [userData, setUserData] = useState<{ name: string; score: number } | null>(null);
  const [fetchCount, setFetchCount] = useState(0);

  // BUG: Creating options object inside component recreation every render
  const fetchOptions = { headers: { 'Authorization': 'Bearer token_xyz' } };

  useEffect(() => {
    async function loadData() {
      // Simulating API fetch
      const res = await fetch(\`/api/users/\${userId}\`, fetchOptions);
      const data = await res.json();
      setUserData(data);
      // Updating state unconditionally inside useEffect
      setFetchCount(fetchCount + 1);
    }
    loadData();
  }, [fetchOptions, fetchCount]); // Dependency triggers every single time!

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2>User: {userData?.name || 'Loading...'}</h2>
      <p>Fetches performed: {fetchCount}</p>
    </div>
  );
}`,
    errorLog: `Warning: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
    at UserProfileCard (UserProfileCard.tsx:14)
    at div
    at App (App.tsx:8)
Error: Uncaught Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.`,
    studentQuestion: 'Why does my browser freeze with "Maximum update depth exceeded" when I add fetchOptions and fetchCount to my useEffect dependency array?'
  },
  {
    id: 'nextjs-hydration-window',
    title: 'Next.js App Router Hydration Mismatch with Window / LocalStorage',
    stack: 'Next.js',
    difficulty: 'Intermediate',
    description: 'Accessing browser globals like window or localStorage during Server Component or initial client hydration.',
    fileName: 'app/components/ThemeToggle.tsx',
    code: `'use client';

import { useState } from 'react';

export default function ThemeToggle() {
  // BUG: Direct window/localStorage access during initial render produces SSR mismatch
  const storedTheme = window.localStorage.getItem('app-theme') || 'light';
  const [theme, setTheme] = useState(storedTheme);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    window.localStorage.setItem('app-theme', next);
  };

  return (
    <button onClick={toggle} className="px-4 py-2 border rounded">
      Current Theme: {theme} {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}`,
    errorLog: `Server Error
ReferenceError: window is not defined
   7 | export default function ThemeToggle() {
>  8 |   const storedTheme = window.localStorage.getItem('app-theme') || 'light';
     |                       ^
   9 |   const [theme, setTheme] = useState(storedTheme);

Warning: Text content did not match. Server: "Current Theme: light" Client: "Current Theme: dark"
See more info here: https://nextjs.org/docs/messages/react-hydration-error`,
    studentQuestion: 'Why am I getting "ReferenceError: window is not defined" in Next.js even though I put "\'use client\'" at the top of the file?'
  },
  {
    id: 'nodejs-unhandled-promise',
    title: 'Node.js Express Async Route Error Crashing Server',
    stack: 'Node.js',
    difficulty: 'Intermediate',
    description: 'In Express 4, asynchronous errors thrown inside async route handlers are not caught by default middleware without wrapping.',
    fileName: 'server/routes/products.js',
    code: `const express = require('express');
const router = express.Router();
const db = require('../db');

// BUG: Unhandled async rejection in Express 4 crashes node process
router.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  
  // If db.query fails or throws an exception, it crashes the server process!
  const product = await db.findProductById(id);
  
  if (!product) {
    throw new Error(\`Product \${id} not found in inventory\`);
  }

  res.json({ success: true, data: product });
});

// Centralized error handler never gets called for unhandled async rejections
router.use((err, req, res, next) => {
  console.error('Error caught in middleware:', err.message);
  res.status(500).json({ error: err.message });
});

module.exports = router;`,
    errorLog: `(node:14280) UnhandledPromiseRejectionWarning: Error: Product 99 not found in inventory
    at /server/routes/products.js:12:11
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
(node:14280) UnhandledPromiseRejectionWarning: Unhandled promise rejection. In future versions, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
[nodemon] app crashed - waiting for file changes before starting...`,
    studentQuestion: 'Why does my Express error handling middleware not catch errors thrown from my async function, and instead crashes my nodemon server?'
  },
  {
    id: 'python-fastapi-keyerror',
    title: 'Python FastAPI / Pydantic Payload Missing Key & Validation',
    stack: 'Python',
    difficulty: 'Beginner',
    description: 'Accessing dictionary keys directly without validation or proper Pydantic schemas causes unhandled KeyError and 500 status.',
    fileName: 'api/endpoints/students.py',
    code: `from fastapi import FastAPI, Request, HTTPException
import uvicorn

app = FastAPI()

# In-memory database
students_db = {}

# BUG: Using raw Request and direct dictionary indexing instead of Pydantic model
@app.post("/api/students/enroll")
async def enroll_student(request: Request):
    payload = await request.json()
    
    # Direct dictionary key access will raise KeyError if user sends incomplete payload
    student_id = payload["student_id"]
    courses = payload["enrolled_courses"]
    semester = payload["details"]["semester"]
    
    students_db[student_id] = {
        "courses": courses,
        "semester": semester
    }
    
    return {"status": "enrolled", "id": student_id}`,
    errorLog: `INFO:     127.0.0.1:53210 - "POST /api/students/enroll HTTP/1.1" 500 Internal Server Error
ERROR:    Exception in ASGI application
Traceback (most recent call last):
  File "fastapi/routing.py", line 273, in app
    raw_response = await run_endpoint_function(...)
  File "api/endpoints/students.py", line 16, in enroll_student
    semester = payload["details"]["semester"]
KeyError: 'details'`,
    studentQuestion: 'My API crashes with a 500 error and KeyError when the client doesn\'t pass the "details" object. How do I make this robust and type-safe in FastAPI?'
  },
  {
    id: 'typescript-array-never',
    title: 'TypeScript: "Property does not exist on type \'never\'"',
    stack: 'TypeScript',
    difficulty: 'Beginner',
    description: 'Initializing an empty array in useState without a generic type parameter infers never[], causing build failures on property access.',
    fileName: 'src/components/StudentList.tsx',
    code: `import React, { useState, useEffect } from 'react';

interface Student {
  id: number;
  name: string;
  enrolledCourse: string;
  gpa: number;
}

export function StudentList() {
  // BUG: useState([]) without generic argument defaults to never[]
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bano-qabil/students')
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading roster...</p>;

  return (
    <ul>
      {students.map(student => (
        // TypeScript Error: Property 'id' does not exist on type 'never'.
        <li key={student.id}>
          {student.name} - {student.enrolledCourse} (GPA: {student.gpa})
        </li>
      ))}
    </ul>
  );
}`,
    errorLog: `src/components/StudentList.tsx:28:18 - error TS2339: Property 'id' does not exist on type 'never'.
28         <li key={student.id}>
                    ~~
src/components/StudentList.tsx:29:20 - error TS2339: Property 'name' does not exist on type 'never'.
29           {student.name} - {student.enrolledCourse} (GPA: {student.gpa})
                      ~~~~
src/components/StudentList.tsx:29:37 - error TS2339: Property 'enrolledCourse' does not exist on type 'never'.
29           {student.name} - {student.enrolledCourse} (GPA: {student.gpa})
                                       ~~~~~~~~~~~~~~`,
    studentQuestion: 'Why does TypeScript say property "id" does not exist on type "never", even though I created an interface called Student?'
  },
  {
    id: 'fullstack-cors-auth',
    title: 'Full-Stack MERN CORS Policy & Authorization Header Rejection',
    stack: 'Full-Stack',
    difficulty: 'Intermediate',
    description: 'Browser preflight OPTIONS request fails because CORS headers do not allow Authorization or Content-Type headers from custom origin.',
    fileName: 'backend/server.js',
    code: `const express = require('express');
const app = express();

// BUG: Incomplete CORS setup without handling preflight OPTIONS or Authorization header
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  // Missing Access-Control-Allow-Headers for Authorization & custom headers!
  // Missing Access-Control-Allow-Methods for PUT/DELETE/PATCH!
  next();
});

app.use(express.json());

app.post('/api/auth/profile', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'No authorization header provided' });
  }
  res.json({ user: 'Student Developer', role: 'FullStack Trainee' });
});

app.listen(5000, () => console.log('Server on 5000'));`,
    errorLog: `Access to XMLHttpRequest at 'http://localhost:5000/api/auth/profile' from origin 'http://localhost:5173' has been blocked by CORS policy: Request header field authorization is not allowed by Access-Control-Allow-Headers in preflight response.
Failed to load resource: net::ERR_FAILED
POST http://localhost:5000/api/auth/profile net::ERR_FAILED 403 (Forbidden)`,
    studentQuestion: 'I set Access-Control-Allow-Origin to my frontend URL, but my POST request with Bearer token is blocked by CORS. Why is the preflight failing?'
  }
];
