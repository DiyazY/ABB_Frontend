import React, { useEffect, useState } from "react";
import "./App.css";

const keys = ["Common_OKButtonText", "Common_CancelButtonText"];

const code = "puHBkScen5DX2doE1/JOWd2bSWZITMoPBrEHXReZL1cB15avUnaWWQ==";// this could be stored as env variable ;). Sorry )))

function App() {
  const [lang, setLang] = useState<string>("en");

  const [dictionary, setDictionary] = useState<
    { key: string; value: string }[]
  >([]);

  const changeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value);
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    Promise.all(
      keys.map((key) =>
        fetch(
          `https://abbtestassessment.azurewebsites.net/api/translations/${lang}/${key}?Code=${code}`,
          { signal }
        )
          .then((result) => {
            if (!result.ok) throw new Error("Smt goes wrong!!!");
            return result.text();
          })
          .then((tr) => ({ key, value: tr }))
          .catch((er) => {
            console.error(er);
            return null;
          })
      )
    ).then((result) => {
      const dict = result.filter((p) => p !== null) as {
        key: string;
        value: string;
      }[];
      setDictionary(dict);
    });

    return () => {
      controller.abort();
    };
  }, [lang]);

  return (
    <div className="App">
      <select value={lang} onChange={changeLang}>
        <option value="en">EN</option>
        <option value="fi">FI</option>
      </select>

      {keys.map((key) => (
        <button key={key}>{dictionary.find(p=>p.key === key)?.value || key}</button>
      ))}
    </div>
  );
}

export default App;
