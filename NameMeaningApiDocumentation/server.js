import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// IMPORTANT: Serve static files so endpoint HTML files can be loaded
app.use('/docs', express.static(path.join(__dirname, "docs")));
app.use(express.static(path.join(__dirname, "src")));

// ============================================
// DOCUMENTATION ROUTES
// ============================================

// Main documentation page (loads all endpoints dynamically)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "docs", "Homepage.html"));
});
app.get("/docs", (req, res) => {
  res.sendFile(path.join(__dirname, "docs", "Docs.html"));
});
app.get("/blog", (req, res) => {
  res.sendFile(path.join(__dirname, "docs", "Blog.html"));
});

app.get("/getnames", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "getnames.html"));
});

// Live testing page for Get Names


app.get("/names/:religion/:name", (req, res) => {
  const { religion, name } = req.params;

  // Optionally: validate religion
  const allowedReligions = ["christian", "islamic", "hindu"];
  if (!allowedReligions.includes(religion.toLowerCase())) {
    return res.status(400).send("Invalid religion");
  }

  // Serve your HTML page
  res.sendFile(path.join(__dirname, "src", "getnamesbyslug.html"));
});

app.get("/getnamesbysearch", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "getnamesbysearch.html"));
});
app.get("/getnamesbyletter", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "getnamesbyletter.html"));
});
app.get("/getfilteroptions", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "getfilters.html"));
});

app.get("/getnamesbyreligion", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "getnamesbyreligion.html"));
});
// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "NameVerse API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    endpoints: {
      documentation: "/",
      liveTesting: "/names",
      api: "/api/names"
    }
  });
});

// ============================================
// API ENDPOINTS
// ============================================

// GET /api/names - Retrieve filtered names
app.get("/api/names", async (req, res) => {
  try {
    const { limit = 50, alphabet, religion } = req.query;
    
    // Validation
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 500) {
      return res.status(400).json({
        error: "Limit must be between 1 and 500"
      });
    }
    
    if (alphabet && !/^[A-Za-z]$/.test(alphabet)) {
      return res.status(400).json({
        error: "Invalid alphabet parameter. Must be a single letter A-Z"
      });
    }
    
    if (religion && !['christian', 'islamic', 'hindu'].includes(religion.toLowerCase())) {
      return res.status(400).json({
        error: "Religion must be one of: christian, islamic, hindu"
      });
    }
    
    // TODO: Replace with your actual database/data source
    // This is sample data for demonstration
    const sampleNames = {
      christian: [
        'Aaron', 'Abraham', 'Adam', 'Andrew', 'Anna', 'Alice', 'Anthony', 'Abigail',
        'Benjamin', 'Bethany', 'Caleb', 'Catherine', 'Daniel', 'David', 'Deborah',
        'Elizabeth', 'Emma', 'Ethan', 'Faith', 'Gabriel', 'Grace', 'Hannah',
        'Isaac', 'Isabella', 'Jacob', 'James', 'John', 'Joseph', 'Joshua',
        'Luke', 'Mary', 'Matthew', 'Michael', 'Moses', 'Nathan', 'Noah',
        'Paul', 'Peter', 'Rachel', 'Rebecca', 'Ruth', 'Samuel', 'Sarah',
        'Simon', 'Sophia', 'Stephen', 'Thomas', 'Timothy'
      ],
      islamic: [
        'Aisha', 'Ahmad', 'Ali', 'Amira', 'Amina', 'Bilal', 'Fatima', 'Hamza',
        'Hassan', 'Hussein', 'Ibrahim', 'Ismail', 'Khadija', 'Khalid', 'Leila',
        'Mahmoud', 'Malak', 'Mariam', 'Maryam', 'Mohamed', 'Muhammad', 'Mustafa',
        'Noor', 'Omar', 'Rashid', 'Salah', 'Salma', 'Sara', 'Yasmin', 'Yusuf',
        'Zahra', 'Zainab', 'Abdullah', 'Abdul', 'Ahmed', 'Anas', 'Ayesha'
      ],
      hindu: [
        'Aarav', 'Aditya', 'Aditi', 'Ajay', 'Amit', 'Ananya', 'Anjali', 'Arjun',
        'Aryan', 'Asha', 'Deepak', 'Devi', 'Ganesh', 'Gita', 'Isha', 'Jay',
        'Kiran', 'Krishna', 'Lakshmi', 'Maya', 'Meera', 'Nisha', 'Pooja',
        'Priya', 'Raj', 'Ravi', 'Rohit', 'Sanjay', 'Sarita', 'Shiva',
        'Sita', 'Uma', 'Vijay', 'Vikram', 'Vishnu'
      ]
    };
    
    // Get names based on religion filter
    let names = religion 
      ? sampleNames[religion.toLowerCase()] || []
      : Object.values(sampleNames).flat();
    
    // Filter by alphabet if provided
    if (alphabet) {
      names = names.filter(name => 
        name.toLowerCase().startsWith(alphabet.toLowerCase())
      );
    }
    
    // Apply limit
    names = names.slice(0, limitNum);
    
    // Return response
    res.json({
      success: true,
      count: names.length,
      data: names
    });
    
  } catch (error) {
    console.error("Error in /api/names:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});

// ============================================
// ADD MORE API ENDPOINTS HERE
// ============================================

// Example: POST /api/names - Add a new name
// app.post("/api/names", async (req, res) => {
//   // Your logic here
// });

// Example: PUT /api/names/:id - Update a name
// app.put("/api/names/:id", async (req, res) => {
//   // Your logic here
// });

// Example: DELETE /api/names/:id - Delete a name
// app.delete("/api/names/:id", async (req, res) => {
//   // Your logic here
// });

// ============================================
// ERROR HANDLERS
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.path}`,
    availableRoutes: {
      documentation: "/",
      liveTesting: "/names",
      api: "/api/names",
      health: "/health"
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║     🚀 NameVerse API Server Running            ║
╠════════════════════════════════════════════════╣
║  📘 Documentation:   http://localhost:${PORT}/     ║
║  🎨 Live Testing:    http://localhost:${PORT}/names║
║  🏥 Health Check:    http://localhost:${PORT}/health║
║  🔧 API Endpoint:    http://localhost:${PORT}/api/names║
╚════════════════════════════════════════════════╝
  `);
});

export default app;