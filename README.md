# AI Smart Performance Analyzer

This project implements a web-based **AI Smart Performance Analyzer** that combines **Machine Learning (Random Forest)** and **Natural Language Processing (NLP)** to predict student mental health risk based on various metrics and journaling.

## 📂 Project Structure
- `app.py`: The main Flask server application.
- `models/hybrid_model.py`: The core machine learning and NLP model implementation.
- `templates/index.html`: The main web interface, styled with Tailwind CSS.
- `static/`: Contains frontend JavaScript logic and static assets like the favicon.
- `requirements.txt`: List of required Python libraries.

## 🚀 How to Run

1. **Install Dependencies** (if not already installed):
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Web App**:
   ```bash
   python app.py
   ```

3. **Access the Application**:
   Open your browser and navigate to `http://localhost:5000`

## 🧠 How it Works
1. **Data Collection**: Collects inputs via a modern web interface (Marks, Attendance, Sleep, Screen Time, Assignment Delay, Feedback).
2. **Preprocessing**: Cleans text and handles numerical data scaling.
3. **Feature Engineering**: 
   - Numeric data -> Random Forest Model
   - Text data -> TF-IDF -> Logistic Regression
4. **Ensemble Learning**: Combines predictions from both models to generate a Risk Profile.
5. **Explainability**: Displays which factors (e.g., Sleep, Attendance) contributed most to the risk and provides tailored recommendations.
