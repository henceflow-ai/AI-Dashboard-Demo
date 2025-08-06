import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

interface TestResult {
  status: "success" | "error";
  message: string;
  statusCode?: number;
  details?: string;
  hasApiKey?: boolean;
  hasBaseId?: boolean;
  recordCount?: number;
  sampleRecord?: any;
}

export default function AirtableTest() {
  const { data: testResult, isLoading, refetch, error } = useQuery<TestResult>({
    queryKey: ["/api/test-airtable"],
    retry: false
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case "error":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Airtable Connection Test</h1>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
                <span>Testing Airtable connection...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8" data-testid="airtable-test">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Airtable Connection Test</h1>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Test Again
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-700">
                <XCircle className="h-5 w-5" />
                <span>Connection Error</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">
                {error instanceof Error ? error.message : "Failed to test connection"}
              </p>
            </CardContent>
          </Card>
        )}

        {testResult && (
          <div className="space-y-6">
            {/* Connection Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(testResult.status)}
                    <span>Connection Status</span>
                  </div>
                  {getStatusBadge(testResult.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{testResult.message}</p>
                
                {testResult.hasApiKey !== undefined && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      {testResult.hasApiKey ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span>AIRTABLE_API_KEY</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {testResult.hasBaseId ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span>AIRTABLE_BASE_ID</span>
                    </div>
                  </div>
                )}

                {testResult.statusCode && (
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <p className="text-sm">
                      <strong>HTTP Status:</strong> {testResult.statusCode}
                    </p>
                    {testResult.details && (
                      <p className="text-sm mt-1">
                        <strong>Details:</strong> {testResult.details}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Success Details */}
            {testResult.status === "success" && (
              <Card>
                <CardHeader>
                  <CardTitle>Table Access Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Records Found: </span>
                      <Badge variant="outline">{testResult.recordCount || 0}</Badge>
                    </div>
                    
                    {testResult.sampleRecord && (
                      <div>
                        <h4 className="font-medium mb-2">Sample Record Fields:</h4>
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(testResult.sampleRecord.fields, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error Troubleshooting */}
            {testResult.status === "error" && (
              <Card>
                <CardHeader>
                  <CardTitle>Troubleshooting</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    {testResult.statusCode === 403 && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <h4 className="font-medium text-yellow-800">403 Forbidden Error</h4>
                        <p className="text-yellow-700 mt-1">
                          Your API token doesn't have permission to access this base or table. Please:
                        </p>
                        <ul className="list-disc list-inside mt-2 text-yellow-700">
                          <li>Check that your API token has 'data.records:read' permission</li>
                          <li>Verify the token was created for the correct base</li>
                          <li>Ensure the table name 'L1 - Enriched Leads' exists in your base</li>
                        </ul>
                      </div>
                    )}
                    
                    {testResult.statusCode === 401 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded">
                        <h4 className="font-medium text-red-800">401 Unauthorized Error</h4>
                        <p className="text-red-700 mt-1">
                          Your API token is invalid or expired. Please generate a new token.
                        </p>
                      </div>
                    )}

                    {testResult.statusCode === 404 && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <h4 className="font-medium text-blue-800">404 Not Found Error</h4>
                        <p className="text-blue-700 mt-1">
                          The base ID or table name is incorrect. Please verify:
                        </p>
                        <ul className="list-disc list-inside mt-2 text-blue-700">
                          <li>Base ID is correct (starts with 'app')</li>
                          <li>Table name is exactly 'L1 - Enriched Leads'</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}