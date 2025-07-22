let xhr;

function handleFile() {
const file = document.getElementById('fileInput').files[0];
if (!file) return;

document.getElementById('fileInfo').classList.remove('hidden');
document.getElementById('fileInfo').innerText = `Selected: ${file.name} (${Math.round(file.size / 1024)} KB)`;
}

function uploadFile() {
const file = document.getElementById('fileInput').files[0];
if (!file) {
    alert("Please select a file.");
    return;
}

const formData = new FormData();
formData.append('file', file);
xhr = new XMLHttpRequest();

  // Upload progress tracking
xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const percent = Math.round((e.loaded / e.total) * 100);
    document.getElementById('progressBar').value = percent;
    document.getElementById('status').innerText = `Uploading: ${percent}%`;
    }
});

  // On successful upload
xhr.onload = () => {
    if (xhr.status === 200) {
    const { filename } = JSON.parse(xhr.responseText);
    document.getElementById('status').innerText = `✅ Upload complete: ${filename}`;
    document.getElementById('cancelBtn').classList.add('hidden');
      loadHistory(); // 🟢 Refresh history after upload
    } else {
    document.getElementById('status').innerText = '❌ Upload failed.';
    }
};

  // On upload error
xhr.onerror = () => {
    document.getElementById('status').innerText = '❌ Upload failed.';
    document.getElementById('cancelBtn').classList.add('hidden');
};

xhr.open('POST', 'http://localhost:3000/upload');
xhr.send(formData);
document.getElementById('cancelBtn').classList.remove('hidden');
}

function cancelUpload() {
if (xhr) {
    xhr.abort();
    document.getElementById('status').innerText = '🚫 Upload cancelled.';
    document.getElementById('cancelBtn').classList.add('hidden');
}
}

// Load upload history from server
function loadHistory() {
fetch('http://localhost:3000/history')
    .then(res => res.json())
    .then(files => {
    const ul = document.getElementById('uploadHistory');
    ul.innerHTML = '';
    files.forEach(file => {
        const li = document.createElement('li');
        li.textContent = file;
        ul.appendChild(li);
    });
    })
    .catch(err => {
    console.error('Error loading history:', err);
    });
}

// Automatically load history when page loads
window.addEventListener('DOMContentLoaded', loadHistory);
