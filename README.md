# OpenNotes

A lightweight, Notion-inspired note-taking app focused on simplicity, fast note creation, and a unique public note reuse system.

## 🚀 Features

- **Rich Text Editor**: Powered by TipTap, supporting headings, lists, todos, code blocks, and more.
- **Auto-save**: Never lose your work. Changes are saved automatically as you type.
- **Fast Note Creation**: Create notes instantly.
- **Public & Private Notes**: Keep notes private or share them publicly.
- **Forkable Templates**: "Use This Note" feature allows duplicating public notes into your workspace.

## 🛠 Tech Stack

### Frontend
- **Framework**: React + Vite (TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Editor**: TipTap with extensions
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite (Development) / PostgreSQL (Production ready with SQLAlchemy)
- **Auth**: JWT-based authentication
- **Validation**: Pydantic

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\Activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
pip install "pydantic[email]" pydantic-settings

# Start the server (runs on http://localhost:8000)
uvicorn app.main:app --reload
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to start using the app.

## 📝 Usage

1. **Register** a new account.
2. **Login** to access your dashboard.
3. Click **"+"** sidebar button to create a new note.
4. Use **slash commands** (type `/`) in the editor to format text (e.g., `/h1`, `/todo`, `/code`).
5. Notes are saved automatically.

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)
