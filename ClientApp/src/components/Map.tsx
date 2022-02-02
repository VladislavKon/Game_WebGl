import React, { useState, useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "Build/public.loader.js",
  dataUrl: "Build/public.data.unityweb",
  frameworkUrl: "Build/public.framework.js.unityweb",
  codeUrl: "Build/public.wasm.unityweb",
});

function Map() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [userName, setUserName] = useState("");
  const [score, setScore] = useState(0);

  function spawnEnemies() {
    unityContext.send("GameController", "SpawnEnemies", 100);
  }

  useEffect(function () {
    unityContext.on("GameOver", function (userName, score) {
      setIsGameOver(true);
      setUserName(userName);
      setScore(score);
    });
  }, []);

  return (
    <div>
      <button onClick={spawnEnemies}>Spawn a bunch!</button>
      {isGameOver === true && <p>{`Game Over! ${userName} ${score} points`}</p>}
      <Unity style={{ width: '1280px', height: '720px'}} unityContext={unityContext} />
    </div>
  );
}

export default Map;
