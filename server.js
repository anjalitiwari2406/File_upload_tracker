const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// ✅ Enable CORS and parse JSON
app.use(cors());
app.use(express.json());

// ✅ Ensure uploads folder exists
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
fs.mkdirSync(uploadPath, { recursive: true });
}

// ✅ Path to JSON file to store history
const historyFilePath = path.join(__dirname, 'uploads.json');

// ✅ Load existing upload history
let uploadedFiles = [];
if (fs.existsSync(historyFilePath)) {
const rawData = fs.readFileSync(historyFilePath);
uploadedFiles = JSON.parse(rawData);
}

// ✅ Serve static frontend files
app.use(express.static(path.join(__dirname, '../client')));

// ✅ Serve uploaded files
app.use('/uploads', express.static(uploadPath));

// ✅ Multer Storage
const storage = multer.diskStorage({
destination: uploadPath,
filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
}
});
const upload = multer({ storage });

// ✅ Upload Endpoint
app.post('/upload', upload.single('file'), (req, res) => {
if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
}

const fileEntry = {
    filename: req.file.originalname,
    storedName: req.file.filename,
    timestamp: new Date().toISOString()
};

uploadedFiles.push(fileEntry);
fs.writeFileSync(historyFilePath, JSON.stringify(uploadedFiles, null, 2));

res.status(200).json({
    message: 'File uploaded successfully',
    file: fileEntry
});
});

// ✅ History Endpoint
app.get('/history', (req, res) => {
res.json(uploadedFiles);
});

// ✅ Start Server
app.listen(PORT, () => {
console.log(`🚀 Server running at http://localhost:${PORT}`);
});

