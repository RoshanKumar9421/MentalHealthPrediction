import { useState } from "react";
import "./App.css";

const initialForm = {
  age: "",
  gender: "",
  country: "",
  academic_level: "",
  most_used_platform: "",
  primary_purpose: "",
  daily_screen_time: "",
  daily_phone_usage: "",
  news_platform: "",
  entertainment_platform: "",
  daily_study_hours: "",
  daily_physical_activity: "",
  sleep_hours: "",
  sleep_time: "",
};

function App() {
  const [formData, setFormData] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age: Number(formData.age),
          gender: formData.gender,
          country: formData.country,
          academic_level: formData.academic_level,
          most_used_platform: formData.most_used_platform,
          daily_screen_time: Number(formData.daily_screen_time),
          daily_phone_usage: Number(formData.daily_phone_usage),
          news_platform: formData.news_platform,
          entertainment_platform: formData.entertainment_platform,
          daily_study_hours: Number(formData.daily_study_hours),
          daily_physical_activity: Number(
            formData.daily_physical_activity
          ),
          sleep_hours: Number(formData.sleep_hours),
          sleep_time: formData.sleep_time,
        }),
      });

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();

      setResult(data);
    } catch (err) {
      setError(
        "Could not connect to the prediction server. Please make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setResult(null);
    setError("");
  };

  const getStressClass = (level) => {
    if (!level) return "";

    return level.toLowerCase().replace(" ", "-");
  };

  return (
    <div className="page">

      <main className="main-container">

        {/* HEADER */}
        <header className="hero">

          <div className="eyebrow">
            STUDENT WELLNESS ANALYTICS
          </div>

          <h1>
            Mental Health <em>Signal</em>
          </h1>

          <p>
            A quick read on how habits, screen time, and stress are
            trending — modeled from your daily rhythm, not a diagnosis.
          </p>

        </header>


        {/* CONTENT */}
        <div className="content-layout">

          {/* LEFT FORM */}
          <section className="form-card">

            <form onSubmit={handleSubmit}>

              {/* PROFILE */}
              <div className="form-section">

                <SectionTitle
                  number="01"
                  title="Profile"
                />

                <div className="three-columns">

                  <Field label="Age">
                    <input
                      type="number"
                      name="age"
                      min="10"
                      max="100"
                      placeholder="e.g. 21"
                      value={formData.age}
                      onChange={handleChange}
                      required
                    />

                    <small>10–100</small>
                  </Field>


                  <Field label="Gender">
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      options={[
                        "Male",
                        "Female",
                        "Other",
                      ]}
                    />
                  </Field>


                  <Field label="Country">
                    <input
                      type="text"
                      name="country"
                      placeholder="e.g. India"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />

                    <small>
                      Not listed? Type it anyway.
                    </small>
                  </Field>

                </div>

              </div>


              {/* ACADEMIC & DIGITAL */}
              <div className="form-section">

                <SectionTitle
                  number="02"
                  title="Academic & Digital Habits"
                />

                <div className="two-columns">

                  <Field label="Academic level">
                    <Select
                      name="academic_level"
                      value={formData.academic_level}
                      onChange={handleChange}
                      required
                      options={[
                        "High School",
                        "Undergraduate",
                        "Postgraduate",
                        "PhD",
                      ]}
                    />
                  </Field>


                  <Field label="Most-used platform">
                    <Select
                      name="most_used_platform"
                      value={formData.most_used_platform}
                      onChange={handleChange}
                      required
                      options={[
                        "Instagram",
                        "YouTube",
                        "WhatsApp",
                        "Facebook",
                        "TikTok",
                        "X",
                        "Snapchat",
                      ]}
                    />
                  </Field>


                  <Field label="Primary purpose">
                    <Select
                      name="primary_purpose"
                      value={formData.primary_purpose}
                      onChange={handleChange}
                      options={[
                        "News",
                        "Entertainment",
                        "Education",
                        "Communication",
                        "Social Media",
                      ]}
                    />
                  </Field>


                  <Field label="Avg. daily screen time">
                    <div className="input-with-unit">
                      <input
                        type="number"
                        name="daily_screen_time"
                        min="0"
                        max="24"
                        step="0.1"
                        placeholder="0.0"
                        value={formData.daily_screen_time}
                        onChange={handleChange}
                        required
                      />
                      <span>hrs</span>
                    </div>
                  </Field>


                  <Field label="Daily phone usage">
                    <div className="input-with-unit">
                      <input
                        type="number"
                        name="daily_phone_usage"
                        min="0"
                        max="24"
                        step="0.1"
                        placeholder="0.0"
                        value={formData.daily_phone_usage}
                        onChange={handleChange}
                        required
                      />
                      <span>hrs</span>
                    </div>
                  </Field>


                  <Field label="News platform">
                    <Select
                      name="news_platform"
                      value={formData.news_platform}
                      onChange={handleChange}
                      required
                      options={[
                        "YouTube",
                        "Instagram",
                        "X",
                        "Facebook",
                        "Reddit",
                        "News Apps",
                      ]}
                    />
                  </Field>


                  <Field label="Entertainment platform">
                    <Select
                      name="entertainment_platform"
                      value={formData.entertainment_platform}
                      onChange={handleChange}
                      required
                      options={[
                        "YouTube",
                        "Instagram",
                        "Netflix",
                        "TikTok",
                        "Gaming",
                        "Spotify",
                      ]}
                    />
                  </Field>

                </div>

              </div>


              {/* LIFESTYLE */}
              <div className="form-section">

                <SectionTitle
                  number="03"
                  title="Lifestyle & Stress"
                />

                <div className="three-columns">

                  <Field label="Study hours / day">
                    <div className="input-with-unit">
                      <input
                        type="number"
                        name="daily_study_hours"
                        min="0"
                        max="24"
                        step="0.1"
                        placeholder="0.0"
                        value={formData.daily_study_hours}
                        onChange={handleChange}
                        required
                      />
                      <span>hrs</span>
                    </div>
                  </Field>


                  <Field label="Physical activity / day">
                    <div className="input-with-unit">
                      <input
                        type="number"
                        name="daily_physical_activity"
                        min="0"
                        max="24"
                        step="0.1"
                        placeholder="0.0"
                        value={formData.daily_physical_activity}
                        onChange={handleChange}
                        required
                      />
                      <span>hrs</span>
                    </div>
                  </Field>


                  <Field label="Sleep / night">
                    <div className="input-with-unit">
                      <input
                        type="number"
                        name="sleep_hours"
                        min="0"
                        max="24"
                        step="0.1"
                        placeholder="0.0"
                        value={formData.sleep_hours}
                        onChange={handleChange}
                        required
                      />
                      <span>hrs</span>
                    </div>
                  </Field>


                  <Field label="Sleep time">
                    <Select
                      name="sleep_time"
                      value={formData.sleep_time}
                      onChange={handleChange}
                      required
                      options={[
                        "Night",
                        "Day",
                      ]}
                    />
                  </Field>

                </div>

              </div>


              {/* BUTTONS */}
              <div className="form-actions">

                <button
                  type="submit"
                  className="predict-button"
                  disabled={loading}
                >
                  {loading
                    ? "Reading your signal..."
                    : "Analyze my signal"}
                </button>

                <button
                  type="button"
                  className="reset-button"
                  onClick={resetForm}
                >
                  Reset
                </button>

              </div>

            </form>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

          </section>


          {/* RIGHT RESULT PANEL */}
          <aside className="signal-card">

            {!result && !loading && (
              <EmptySignal />
            )}

            {loading && (
              <LoadingSignal />
            )}

            {result && (
              <ResultSignal result={result} />
            )}

          </aside>

        </div>

      </main>

    </div>
  );
}


/* -------------------------------- */
/* Section Title */
/* -------------------------------- */

function SectionTitle({ number, title }) {
  return (
    <div className="section-title">

      <span className="section-number">
        {number}
      </span>

      <span>{title}</span>

    </div>
  );
}


/* -------------------------------- */
/* Field */
/* -------------------------------- */

function Field({ label, children }) {
  return (
    <div className="field">

      <label>{label}</label>

      {children}

    </div>
  );
}


/* -------------------------------- */
/* Select */
/* -------------------------------- */

function Select({
  name,
  value,
  onChange,
  options,
  required,
}) {
  return (
    <div className="select-wrapper">

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >

        <option value="">
          Select
        </option>

        {options.map((option) => (
          <option
            value={option}
            key={option}
          >
            {option}
          </option>
        ))}

      </select>

      <span className="chevron">
        ⌄
      </span>

    </div>
  );
}


/* -------------------------------- */
/* Empty Signal */
/* -------------------------------- */

function EmptySignal() {
  return (
    <div className="signal-content">

      <div className="gauge">

        <div className="gauge-arc"></div>

        <div className="gauge-tick tick-1"></div>
        <div className="gauge-tick tick-2"></div>
        <div className="gauge-tick tick-3"></div>
        <div className="gauge-tick tick-4"></div>
        <div className="gauge-tick tick-5"></div>

      </div>

      <h2>
        Your score will appear here
      </h2>

      <p>
        Fill in the form and submit to generate
        a predicted mental health score.
      </p>

      <div className="circle-loader">
        <div></div>
      </div>

      <h3>
        Reading the signal...
      </h3>

      <small>
        Your prediction will appear after analysis.
      </small>

    </div>
  );
}


/* -------------------------------- */
/* Loading */
/* -------------------------------- */

function LoadingSignal() {
  return (
    <div className="signal-content loading-content">

      <div className="spinner"></div>

      <h2>
        Reading the signal...
      </h2>

      <p>
        Running your habits through the model.
      </p>

    </div>
  );
}


/* -------------------------------- */
/* Result */
/* -------------------------------- */

function ResultSignal({ result }) {
  const level = result.stress_level || "Unknown";

  return (
    <div className="signal-content result-content">

      <div className="result-label">
        PREDICTED STRESS LEVEL
      </div>

      <div className="result-level">
        {level}
      </div>

      <div className="result-confidence">
        {result.confidence}% confidence
      </div>


      <div className="result-ring">

        <div className="ring-inner">
          <strong>
            {Math.round(result.confidence)}
          </strong>

          <span>
            %
          </span>
        </div>

      </div>


      <div className="result-divider"></div>

      <h3>
        Your wellness signal
      </h3>

      <p>
        This prediction is based on the lifestyle,
        academic, sleep, physical activity and
        digital-use information you entered.
      </p>


      {result.probabilities && (
        <div className="probability-list">

          {Object.entries(result.probabilities).map(
            ([name, value]) => (
              <div
                className="probability-row"
                key={name}
              >

                <div className="probability-top">
                  <span>{name}</span>
                  <span>{value}%</span>
                </div>

                <div className="probability-track">

                  <div
                    className={`probability-fill ${name
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    style={{
                      width: `${value}%`,
                    }}
                  />

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}

export default App;