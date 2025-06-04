
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { MessageCircle, Send, Trash2 } from 'lucide-react';
import { 
  getResumeConversationResponse, 
  clearResumeConversationMemory 
} from '../services/langchain/langchainService';
import { useToast } from './ui/use-toast';
import { ExamplePrompts } from './ExamplePrompts';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const ResumeAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getResumeConversationResponse(input);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting resume assistance:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConversation = async () => {
    try {
      await clearResumeConversationMemory();
      setMessages([]);
      toast({
        title: "Conversation Cleared",
        description: "Chat history has been reset.",
      });
    } catch (error) {
      console.error('Error clearing conversation:', error);
      toast({
        title: "Error",
        description: "Failed to clear conversation.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="space-y-4">
      {messages.length === 0 && (
        <ExamplePrompts type="resume" onPromptSelect={handlePromptSelect} />
      )}
      
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Resume Assistant
            </CardTitle>
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearConversation}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="space-y-4 pr-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Ask me anything about your resume!</p>
                  <p className="text-sm mt-2">
                    I can help with formatting, content, keywords, and more.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2 flex-shrink-0">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about resume writing, formatting, keywords..."
              className="flex-1 min-h-[80px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
