import { lazy, Suspense, useEffect } from "react";
import { useGameStore } from "./game/gameStore";
import TitleScreen from "./pages/TitleScreen";
import ResultsScreen from "./pages/ResultsScreen";
import ErrorBoundary from "./components/ErrorBoundary";
import SceneLoader from "./components/SceneLoader";

// Lazy-load the heavy 3D scene so the title screen mounts instantly and
// the ~25k LOC game code is only fetched once the user presses Start.
const loadGameScene = () => import("./game/GameScene");
const GameScene = lazy(loadGameScene);

function App() {
  const screen = useGameStore((s) => s.screen);

  useEffect(() => {
    if (screen === "title") {
      void loadGameScene();
    }
  }, [screen]);

  if (screen === "title") return <TitleScreen />;
  if (screen === "results") return <ResultsScreen />;
  return (
    <ErrorBoundary>
      <Suspense fallback={<SceneLoader />}>
        <GameScene />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
