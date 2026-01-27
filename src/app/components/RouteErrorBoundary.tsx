import { useRouteError, isRouteErrorResponse } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { AlertTriangle, Home } from 'lucide-react';

export function RouteErrorBoundary() {
  const error = useRouteError();
  
  let errorMessage: string;
  let errorDetails: string | undefined;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || 'Page not found';
    errorDetails = error.data?.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Unknown error occurred';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-gray-900">
            Oops! Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            {errorMessage}
          </p>

          {import.meta.env.DEV && errorDetails && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <p className="text-sm font-semibold text-red-800 mb-2">
                Error Details (Development Only):
              </p>
              <pre className="text-xs text-red-700 overflow-x-auto whitespace-pre-wrap break-words">
                {errorDetails}
              </pre>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <Button
              onClick={() => window.location.href = '/'}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
