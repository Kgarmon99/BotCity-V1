import { useGameStore } from "./game/gameStore";
import TitleScreen from "./pages/TitleScreen";
import GameScene from "./game/GameScene";
import ResultsScreen from "./pages/ResultsScreen";

function App() {
  const screen = useGameStore((s) => s.screen);

  if (screen === "title") return <TitleScreen />;
  if (screen === "results") return <ResultsScreen />;
  return <GameScene />;
}

export default App;
