export default function Loading() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex space-x-2">
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-500"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-green-500"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-red-500"></div>
        </div>
      </div>
    );
  }
  