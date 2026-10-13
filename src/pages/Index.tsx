import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Guevara Billing System</h1>
        <p className="text-xl text-gray-600">
          WiFi Billing & Network Management for WISPs
        </p>
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;