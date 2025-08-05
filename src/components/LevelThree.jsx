export default function LevelThree({ onComplete }) {
  return (
    <div className="absolute z-40 w-full h-full flex items-center justify-center">
      <div className="p-10 bg-white rounded-xl shadow-md text-xl text-[#632911] font-[sf-heavy]">
        <p>⚡ Guess where the short circuit is happening?</p>
        <div className="flex gap-6 mt-6">
          <button
            onClick={() => onComplete(false)}
            className="px-6 py-3 bg-red-300 hover:bg-red-400 rounded"
          >
            Wire X
          </button>
          <button
            onClick={() => onComplete(true)}
            className="px-6 py-3 bg-green-300 hover:bg-green-400 rounded"
          >
            Wire Y
          </button>
        </div>
      </div>
    </div>
  );
}
