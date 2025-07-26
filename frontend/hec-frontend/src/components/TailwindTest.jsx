import React from 'react';

const TailwindTest = () => {
  return (
    <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold">Tailwind CSS Test</h1>
      <p className="mt-2">If you can see this styled correctly, Tailwind is working!</p>
      <div className="flex space-x-2 mt-4">
        <div className="w-4 h-4 bg-blue-500 rounded"></div>
        <div className="w-4 h-4 bg-green-500 rounded"></div>
        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
      </div>
    </div>
  );
};

export default TailwindTest;
