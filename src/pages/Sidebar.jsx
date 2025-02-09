import { useEffect } from "react";
import "./Sidebar.css";

export default function () {
  useEffect(() => {
    console.log("Hello from the sidebar!");
  }, []);

  return (
    <div>
      <img src="/icon-with-shadow.svg" />
      <h1>NANI WALLET</h1>
      <p>
        Template: <code>react-js</code>
      </p>
    </div>
  );
}
