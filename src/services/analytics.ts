interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
}

class AnalyticsService {
  private isEnabled: boolean;
  private userId: string | null = null;

  constructor() {
    this.isEnabled = typeof window !== 'undefined';
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  track(event: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return;

    const eventData: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
      userId: this.userId || undefined,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', eventData);
    }

    // Store in localStorage for later batch sending
    this.storeEvent(eventData);
  }

  private storeEvent(event: AnalyticsEvent) {
    try {
      const stored = localStorage.getItem('analytics_events');
      const events = stored ? JSON.parse(stored) : [];
      events.push(event);
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('analytics_events', JSON.stringify(events));
    } catch (error) {
      console.warn('Failed to store analytics event:', error);
    }
  }

  // Track specific app events
  resumeBuilderStarted() {
    this.track('resume_builder_started');
  }

  resumeTemplateSelected(template: string) {
    this.track('resume_template_selected', { template });
  }

  resumeDownloaded(format: string) {
    this.track('resume_downloaded', { format });
  }

  aiFeatureUsed(feature: string, success: boolean) {
    this.track('ai_feature_used', { feature, success });
  }

  resumeUploaded(fileType: string, fileSize: number) {
    this.track('resume_uploaded', { fileType, fileSize });
  }

  formStepCompleted(step: number, stepName: string) {
    this.track('form_step_completed', { step, stepName });
  }

  errorOccurred(error: string, context?: string) {
    this.track('error_occurred', { error, context });
  }
}

export const analytics = new AnalyticsService();
