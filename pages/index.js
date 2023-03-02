import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci-codex/completions",
      {
        prompt: `Q: ${question}\nA:`,
        max_tokens: 1024,
        n: 1,
        stop: "\n",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CHATGPT_API_KEY}`,
        },
      }
    );
    setAnswer(response.data.choices[0].text.trim());
  };

  const handleDownload = (event) => {
    event.preventDefault();
    const element = document.createElement("a");
    const file = new Blob([answer], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "resposta.csv";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label className="label" htmlFor="question">
          Question:{" "}
        </label>
        <textarea
          className="inputQ"
          type="text"
          id="question"
          name="question"
          value={question}
          onChange={handleChange}
        />
        <button type="submit">Enviar</button>
      </form>
      <div>
        <p>Answer: {answer}</p>

        {answer && (
          <button type="button" onClick={handleDownload}>
            Download Answer CSV
          </button>
        )}
      </div>
    </div>
  );
}
