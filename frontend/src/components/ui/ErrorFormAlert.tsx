import React from "react";

interface ErrorFormAlertProps {
  error: string | null;
}

const ErrorFormAlert: React.FC<ErrorFormAlertProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-background border border-error text-error px-3 py-2 rounded text-sm mb-4 text-center">
      {error}
    </div>
  );
};

export default ErrorFormAlert;
