import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
          Guevara Billing System
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          WiFi Billing & Network Management for WISPs - Now with Guest Access!
        </p>
        <div className="mt-8">
          <button className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all transform hover:scale-105">
            Get Started
          </button>
        </div>
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;