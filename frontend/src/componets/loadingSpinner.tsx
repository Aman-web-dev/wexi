
import { RefreshCw } from "lucide-react";


const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
  </div>
);


export default LoadingSpinner;