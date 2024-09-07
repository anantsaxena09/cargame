export default function GameOver() {
    return (
      <div className="flex justify-center items-center h-full bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Game Over</h1>
          <p className="mt-4">You were hit by a falling shape!</p>
          <button className="mt-6 px-4 py-2 bg-blue-600 rounded-lg">Play Again</button>
        </div>
      </div>
    );
  }
  