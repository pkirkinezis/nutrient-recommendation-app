import { AlertCircle } from 'lucide-react';

export const DisclaimerBanner = () => {
  return (
    <div className="bg-amber-50 border-b border-amber-100 p-4">
      <div className="max-w-7xl mx-auto flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <div className="text-sm text-amber-900">
          <p className="font-semibold mb-1">Educational Use Only – Not Medical Advice</p>
          <p className="opacity-90">
            NutriCompass helps you explore nutrients and herbs based on science and tradition. 
            We do not diagnose or treat disease. Always consult your doctor before starting new supplements, especially if you are pregnant, nursing, or taking medication.
            <span className="font-bold ml-1">Food is your primary source of nutrition.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
