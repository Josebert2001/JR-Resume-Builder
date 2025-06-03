
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff, Key, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface ApiKeyConfigProps {
  onApiKeyUpdate?: (isValid: boolean) => void;
}

export const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ onApiKeyUpdate }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load existing API key from localStorage
    const savedKey = localStorage.getItem('groq_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      validateApiKey(savedKey);
    }
  }, []);

  const validateApiKey = async (key: string) => {
    if (!key || !key.startsWith('gsk-')) {
      setIsValid(false);
      onApiKeyUpdate?.(false);
      return;
    }

    setIsValidating(true);
    try {
      // Test the API key with a simple request
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`,
        },
      });

      const valid = response.ok;
      setIsValid(valid);
      onApiKeyUpdate?.(valid);

      if (valid) {
        localStorage.setItem('groq_api_key', key);
        toast({
          title: "API Key Valid",
          description: "Your Groq API key is working correctly.",
        });
      } else {
        toast({
          title: "Invalid API Key",
          description: "Please check your Groq API key and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsValid(false);
      onApiKeyUpdate?.(false);
      toast({
        title: "Connection Error",
        description: "Could not validate API key. Please check your internet connection.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      validateApiKey(apiKey.trim());
    }
  };

  const handleRemoveApiKey = () => {
    setApiKey('');
    setIsValid(null);
    localStorage.removeItem('groq_api_key');
    onApiKeyUpdate?.(false);
    toast({
      title: "API Key Removed",
      description: "Your API key has been removed from storage.",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Groq API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <div className="relative">
            <Input
              id="api-key"
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Groq API key (gsk-...)"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {isValid !== null && (
          <div className="flex items-center gap-2">
            {isValid ? (
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Valid
              </Badge>
            ) : (
              <Badge variant="destructive" className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Invalid
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleSaveApiKey}
            disabled={!apiKey.trim() || isValidating}
            className="flex-1"
          >
            {isValidating ? "Validating..." : "Save & Validate"}
          </Button>
          {apiKey && (
            <Button
              onClick={handleRemoveApiKey}
              variant="outline"
            >
              Remove
            </Button>
          )}
        </div>

        <Alert>
          <AlertDescription>
            Get your free API key from{' '}
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Groq Console
            </a>
            . Your key is stored locally and never sent to our servers.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
