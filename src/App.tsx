import { useState } from "react";
import "./App.css";
import { TextArea } from "./components/TextArea";

function App() {
  const [count, setCount] = useState("S20230811");
  const [numPlaca, setPlaca] = useState("3");
  const [template, setTemplate] = useState(
    "<p>teste template, ${numCount} com ${numPlaca} em sua via.</p>"
  );

  const object = {
    numCount: count,
    numPlaca
  };

  return (
    <>
      <div className="card">
        <input
          type="text"
          value={count}
          onChange={(e) => setCount(e.target.value)}
        />
        <input
          type="text"
          value={numPlaca}
          onChange={(e) => setPlaca(e.target.value)}
        />
        <div className="card">
          <TextArea
            replacer={object}
            template={template}
            handler={setTemplate}
          />
        </div>
      </div>
      <pre>{template}</pre>
    </>
  );
}

export default App;
