// LockScreen.tsx
const LockScreen = ({ onUnlock }: { onUnlock: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div className="text-center">
      <h1 className="text-white text-2xl font-bold mb-4">Focus Mode Active</h1>
      <p className="text-white mb-6">Pause the timer to unlock.</p>
      <button
        onClick={onUnlock}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
      >
        Pause Timer
      </button>
    </div>
  </div>
);

export default LockScreen;
