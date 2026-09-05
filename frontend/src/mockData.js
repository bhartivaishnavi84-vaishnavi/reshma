export const MOCK_USER = {
  id: 1,
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  targetRole: "Software Developer",
  experienceLevel: "Intermediate",
  resumeUploaded: true,
  resumeFileName: "Alex_Morgan_Resume_2025.pdf",
  skills: ["JavaScript", "React", "Python", "SQL", "Docker", "REST APIs"],
  createdAt: "2025-01-15T10:00:00Z"
};

export const JOB_ROLES = [
  { id: "software_dev", name: "Software Developer", category: "Engineering" },
  { id: "data_analyst", name: "Data Analyst", category: "Data" },
  { id: "data_scientist", name: "Data Scientist", category: "Data" },
  { id: "web_dev", name: "Web Developer", category: "Engineering" },
  { id: "python_dev", name: "Python Developer", category: "Engineering" },
  { id: "java_dev", name: "Java Developer", category: "Engineering" },
  { id: "business_analyst", name: "Business Analyst", category: "Management" },
  { id: "ml_engineer", name: "ML Engineer", category: "Data & AI" }
];

export const INTERVIEW_TYPES = [
  { id: "Technical", label: "Technical", description: "Algorithm design, data structures, and role-specific architecture" },
  { id: "HR", label: "HR", description: "Culture fit, salary expectations, career background" },
  { id: "Behavioral", label: "Behavioral", description: "STAR method, leadership, teamwork and conflict resolution" },
  { id: "Technical+HR", label: "Technical + HR", description: "Combined technical proficiency and workplace alignment" },
  { id: "Mixed", label: "Mixed", description: "Comprehensive interview covering diverse real-world situations" }
];

export const DIFFICULTY_LEVELS = [
  { id: "Beginner", label: "Beginner", badge: "badge-info" },
  { id: "Intermediate", label: "Intermediate", badge: "badge-primary" },
  { id: "Advanced", label: "Advanced", badge: "badge-warning" }
];

export const MOCK_ACTIVE_INTERVIEW = {
  id: "int-mock-101",
  role: "Software Developer",
  type: "Technical",
  difficulty: "Intermediate",
  mode: "text",
  totalQuestions: 4,
  questions: [
    {
      id: 1,
      order: 1,
      category: "System Design & REST",
      difficulty: "Intermediate",
      text: "Explain the difference between optimistic and pessimistic locking. In what scenarios would you choose optimistic locking in a web application?",
      sampleAnswer: "Optimistic locking assumes that multiple transactions rarely conflict with each other. It verifies that no other transaction has modified the data by checking a version column before committing. If conflict occurs, it aborts or retries. Pessimistic locking locks the database record upfront using SELECT FOR UPDATE until the transaction completes. I would choose optimistic locking in high-throughput web applications with low concurrency contention, such as e-commerce product views or user profile updates, to avoid blocking database connections."
    },
    {
      id: 2,
      order: 2,
      category: "Database & SQL",
      difficulty: "Intermediate",
      text: "How do database indexes improve query performance, and what are the trade-offs when indexing high-write tables?",
      sampleAnswer: ""
    },
    {
      id: 3,
      order: 3,
      category: "Concurrency & Async",
      difficulty: "Intermediate",
      text: "What is an event loop in Node.js or Python AsyncIO, and how does it handle non-blocking I/O operations?",
      sampleAnswer: ""
    },
    {
      id: 4,
      order: 4,
      category: "Architecture",
      difficulty: "Intermediate",
      text: "Can you describe the circuit breaker pattern in microservices, including the Open, Half-Open, and Closed states?",
      sampleAnswer: ""
    }
  ]
};

export const MOCK_EVALUATION_RESULT = {
  interviewId: "int-mock-101",
  overallScore: 8.4,
  durationMinutes: 18,
  completedAt: "2025-05-12T14:30:00Z",
  categoryBreakdown: [
    { category: "System Design", score: 8.8 },
    { category: "Database & SQL", score: 7.5 },
    { category: "Concurrency", score: 8.5 },
    { category: "Architecture", score: 8.8 }
  ],
  generalFeedback: "Strong conceptual clarity on distributed systems and concurrency. Good grasp of trade-offs, though database indexing query execution plans could include deeper details on B-Tree internals.",
  answers: [
    {
      questionId: 1,
      question: "Explain the difference between optimistic and pessimistic locking. In what scenarios would you choose optimistic locking?",
      candidateAnswer: "Optimistic locking assumes that multiple transactions rarely conflict with each other. It verifies that no other transaction has modified the data by checking a version column before committing. If conflict occurs, it aborts or retries. Pessimistic locking locks the database record upfront using SELECT FOR UPDATE until the transaction completes. I would choose optimistic locking in high-throughput web applications with low concurrency contention, such as e-commerce product views or user profile updates, to avoid blocking database connections.",
      score: 9,
      correctness: "Excellent",
      strengths: [
        "Clear definition of both locking mechanisms.",
        "Mentioned version column / timestamp check for optimistic locking.",
        "Provided practical scenarios where optimistic locking minimizes thread contention."
      ],
      weaknesses: [
        "Did not discuss exponential backoff retry strategies when collisions occur."
      ],
      missing_points: [
        "Handling ABA problem in low-level memory compare-and-swap vs DB version numbers."
      ],
      suggestions: [
        "Mention retry handling and how deadlocks are prevented in distributed caches."
      ]
    },
    {
      questionId: 2,
      question: "How do database indexes improve query performance, and what are the trade-offs when indexing high-write tables?",
      candidateAnswer: "Indexes create B-Tree structures so queries don't do full table scans. But writes become slower because every INSERT or UPDATE has to rewrite the index tree.",
      score: 7,
      correctness: "Good",
      strengths: [
        "Correctly cited B-Tree data structures and avoiding table scans.",
        "Identified write degradation during INSERT/UPDATE."
      ],
      weaknesses: [
        "A bit brief; omitted composite indexing rules and storage overhead."
      ],
      missing_points: [
        "Clustered vs Non-Clustered index distinction.",
        "Query planner EXPLAIN output and index cardinality."
      ],
      suggestions: [
        "In interviews, illustrate with an example like 'indexing an email column with high cardinality'."
      ]
    }
  ]
};

export const MOCK_PERSONALIZED_PLAN = {
  id: "plan-505",
  targetRole: "Software Developer",
  status: "Active",
  progressPercentage: 57,
  totalDays: 7,
  dailyTimeMinutes: 45,
  weakAreas: ["Database & SQL", "System Design Scalability"],
  days: [
    {
      day: 1,
      title: "Core Data Structures & Complexity",
      objective: "Master Big-O analysis and hash collision resolution",
      tasks: [
        { id: "t1-1", text: "Review Hash Map collision strategies (Chaining vs Open Addressing)", estimatedMinutes: 20, completed: true },
        { id: "t1-2", text: "Practice 3 two-pointer algorithmic interview questions", estimatedMinutes: 25, completed: true }
      ]
    },
    {
      day: 2,
      title: "Relational DBs & Query Optimization",
      objective: "Strengthen database indexing and isolation levels",
      tasks: [
        { id: "t2-1", text: "Study B+ Tree vs Hash indexes and composite index prefix rule", estimatedMinutes: 20, completed: true },
        { id: "t2-2", text: "Analyze SQL execution plan (EXPLAIN ANALYZE) on a joined query", estimatedMinutes: 25, completed: true }
      ]
    },
    {
      day: 3,
      title: "Transaction Concurrency & Locking",
      objective: "Deep dive into ACID isolation levels and locking mechanisms",
      tasks: [
        { id: "t3-1", text: "Simulate dirty read, non-repeatable read, and phantom reads", estimatedMinutes: 20, completed: true },
        { id: "t3-2", text: "Mock practice: 2 questions on Optimistic vs Pessimistic locking", estimatedMinutes: 25, completed: true }
      ]
    },
    {
      day: 4,
      title: "Distributed Systems & Caching",
      objective: "Understand cache invalidation and distributed lock patterns",
      tasks: [
        { id: "t4-1", text: "Compare Cache-Aside, Write-Through, and Write-Back patterns", estimatedMinutes: 20, completed: false },
        { id: "t4-2", text: "Study Redis distributed locking via Redlock algorithm", estimatedMinutes: 25, completed: false }
      ]
    },
    {
      day: 5,
      title: "API Design & Microservices Resiliency",
      objective: "Master Circuit Breaker, Rate Limiting, and Idempotency keys",
      tasks: [
        { id: "t5-1", text: "Design idempotent payment webhook handling", estimatedMinutes: 20, completed: false },
        { id: "t5-2", text: "Practice answering Circuit Breaker state machine questions", estimatedMinutes: 25, completed: false }
      ]
    },
    {
      day: 6,
      title: "Behavioral & STAR Method",
      objective: "Format past project triumphs and challenges into STAR framework",
      tasks: [
        { id: "t6-1", text: "Draft answers for 'Tell me about a technical disagreement you had'", estimatedMinutes: 20, completed: false },
        { id: "t6-2", text: "Perform 1 Voice-based behavioral practice run on PrepAI", estimatedMinutes: 25, completed: false }
      ]
    },
    {
      day: 7,
      title: "Full Mock Interview Simulation",
      objective: "Complete comprehensive 6-question Technical+HR simulation",
      tasks: [
        { id: "t7-1", text: "Run full 30-min timed interview on PrepAI", estimatedMinutes: 30, completed: false },
        { id: "t7-2", text: "Review AI scorecard and calibrate final plan", estimatedMinutes: 15, completed: false }
      ]
    }
  ]
};

export const MOCK_INTERVIEW_HISTORY = [
  {
    id: "int-001",
    date: "2025-05-12",
    role: "Software Developer",
    type: "Technical",
    mode: "Text",
    difficulty: "Intermediate",
    score: 8.4,
    questionsCount: 4,
    status: "Completed"
  },
  {
    id: "int-002",
    date: "2025-05-09",
    role: "Software Developer",
    type: "Behavioral",
    mode: "Voice",
    difficulty: "Intermediate",
    score: 7.8,
    questionsCount: 3,
    status: "Completed"
  },
  {
    id: "int-003",
    date: "2025-05-05",
    role: "Software Developer",
    type: "Technical",
    mode: "Text",
    difficulty: "Beginner",
    score: 9.1,
    questionsCount: 5,
    status: "Completed"
  },
  {
    id: "int-004",
    date: "2025-04-28",
    role: "Web Developer",
    type: "Technical+HR",
    mode: "Voice",
    difficulty: "Intermediate",
    score: 7.2,
    questionsCount: 4,
    status: "Completed"
  }
];

export const MOCK_PERFORMANCE_METRICS = {
  averageScore: 8.1,
  interviewsCompleted: 4,
  practiceHours: 3.5,
  strongestTopic: "Architecture & Concurrency",
  weakestTopic: "Database & SQL Optimization",
  trend: [
    { session: "Session 1", score: 7.2, date: "Apr 28" },
    { session: "Session 2", score: 9.1, date: "May 05" },
    { session: "Session 3", score: 7.8, date: "May 09" },
    { session: "Session 4", score: 8.4, date: "May 12" }
  ],
  topics: [
    { topic: "System Design", score: 8.8, status: "Strong" },
    { topic: "Architecture", score: 8.8, status: "Strong" },
    { topic: "Concurrency", score: 8.5, status: "Good" },
    { topic: "Behavioral & STAR", score: 7.8, status: "Good" },
    { topic: "Database & SQL", score: 7.2, status: "Needs Practice" }
  ]
};
