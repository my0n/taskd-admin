import { Suspense } from "react";
import { NetworkErrorBoundary } from "rest-hooks";

type Props = {
  fallback?: React.ReactElement;
  children: React.ReactNode;
};

export const AsyncBoundary = ({ children, fallback }: Props) => {
  return (
    <Suspense fallback={fallback || <>Loading...</>}>
      <NetworkErrorBoundary>{children}</NetworkErrorBoundary>
    </Suspense>
  );
};
