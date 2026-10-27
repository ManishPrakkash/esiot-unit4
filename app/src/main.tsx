import { createRoot } from "react-dom/client";
import "./index.css";
import { Deck } from "./components/Deck";
import { slides } from "./content";

if (location.search.includes("audit")) import("./audit").then((m) => m.runAudit());
createRoot(document.getElementById("root")!).render(<Deck slides={slides} />);
