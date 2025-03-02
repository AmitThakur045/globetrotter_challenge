# Globetrotter - The Ultimate Travel Guessing Game

## Project Overview
Globetrotter is a full-stack web app where users receive cryptic clues about famous destinations and must guess the correct place. Upon answering, they unlock fun facts, trivia, and surprises!

## Technologies Used
- **Backend:** Django (SQLite for the database)
- **Frontend:** React.js (with Tailwind CSS for styling)

---
## Backend Setup (Django)

### Prerequisites
- Python 3.8+
- pip
- virtualenv

### Installation
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows, use `env\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run database migrations:
   ```bash
   python manage.py migrate
   ```
5. Create a superuser (optional, for admin panel access):
   ```bash
   python manage.py createsuperuser
   ```
6. Start the server:
   ```bash
   python manage.py runserver
   ```

---
## Frontend Setup (React.js)

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd ../globetrotter-frontend
   ```
2. Install dependencies:
   ```bash
   npm install  # or yarn install
   ```
3. Start the React development server:
   ```bash
   npm start  # or yarn start
   ```

---
## API Contract Documentation

### User Authentication
#### Register a User
**Endpoint:** `POST /api/register/`

**Request Body:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Password123",
  "first_name": "John",
  "last_name": "Doe"
}
```
**Response:**
```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### Login
**Endpoint:** `POST /api/login/`

**Request Body:**
```json
{
  "username": "testuser",
  "password": "Password123"
}
```
**Response:**
```json
{
  "token": "your-auth-token",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

### Game API
#### Start a Game
**Endpoint:** `POST /api/game/start/`

**Headers:**
```
Authorization: Token your-auth-token
Content-Type: application/json
```

**Response:**
```json
{
    "id": 13,
    "questions": [
        {
            "id": 61,
            "options": ["London", "Prague", "Barcelona", "Vienna"],
            "destination": {
                "id": 27,
                "country": "Czech Republic",
                "clues": [
                    "This city is known for its historic Old Town Square and medieval castle.",
                    "Features a famous astronomical clock that dates back to the 15th century."
                ],
                "fun_facts": [
                    "Prague Castle is the largest ancient castle in the world, covering an area of over 18 acres."
                ],
                "trivia": [
                    "The city's historic center is a UNESCO World Heritage Site."
                ]
            }
        }
    ],
    "total_questions": 5
}
```

#### Submit an Answer
**Endpoint:** `POST /api/game/{game_id}/submit/`

**Request Body:**
```json
{
    "question_id": 61,
    "answer": "London"
}
```
**Response:**
```json
{
    "is_correct": false,
    "correct_answer": "Prague"
}
```