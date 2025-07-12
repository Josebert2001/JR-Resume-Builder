
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Activity, RefreshCw, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { checkLangchainHealth } from '../services/langchain/langchainService';
import { useToast } from './ui/use-toast';

interface SystemStatusProps {
  onOpenSettings?: () => void;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ onOpenSettings }) => {
  const [healthStatus, setHealthStatus] = useState<{
    isHealthy: boolean;
    errors: string[];
    details: Record<string, any>;
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const status = await checkLangchainHealth();
      setHealthStatus(status);
      
      if (status.isHealthy) {
        toast({
          title: "System Healthy",
          description: "All AI services are working correctly.",
        });
      } else {
        toast({
          title: "System Issues Detected",
          description: `Found ${status.errors.length} issue(s). Check the status panel for details.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Health check failed:', error);
      toast({
        title: "Health Check Failed",
        description: "Could not check system status.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            AI System Status
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={checkHealth}
              disabled={isChecking}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Checking...' : 'Check'}
            </Button>
            {onOpenSettings && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenSettings}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {healthStatus ? (
          <>
            <div className="flex items-center gap-2">
              <Badge 
                variant={healthStatus.isHealthy ? "default" : "destructive"}
                className="flex items-center gap-1"
              >
                {healthStatus.isHealthy ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                {healthStatus.isHealthy ? 'Healthy' : 'Issues Detected'}
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Service Details:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>API Key:</span>
                  <Badge variant={healthStatus.details.hasApiKey ? "default" : "destructive"}>
                    {healthStatus.details.hasApiKey ? 'Configured' : 'Missing'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Chain Test:</span>
                  <Badge variant={healthStatus.details.chainTest === 'success' ? "default" : "destructive"}>
                    {healthStatus.details.chainTest || 'Unknown'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Memory Test:</span>
                  <Badge variant={healthStatus.details.memoryTest === 'success' ? "default" : "destructive"}>
                    {healthStatus.details.memoryTest || 'Unknown'}
                  </Badge>
                </div>
              </div>
            </div>

            {healthStatus.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-red-600">Issues Found:</h4>
                <ul className="space-y-1 text-sm text-red-600">
                  {healthStatus.errors.map((error, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            Click "Check" to verify system status
          </div>
        )}
      </CardContent>
    </Card>
  );
};
