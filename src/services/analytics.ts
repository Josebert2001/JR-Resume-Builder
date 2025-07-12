// Analytics service for tracking user interactions
export interface AnalyticsEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
}

class AnalyticsService {
  private isEnabled: boolean = true;
  private events: AnalyticsEvent[] = [];

  constructor() {
    // Initialize analytics (could be Google Analytics, PostHog, etc.)
    this.initializeAnalytics();
  }

  private initializeAnalytics() {
    // For demo purposes, we'll use console logging
    // In production, you would initialize your analytics provider here
    console.log('Analytics service initialized');
  }

  track(event: AnalyticsEvent) {
    if (!this.isEnabled) return;

    // Store event locally for demo
    this.events.push({
      ...event,
      timestamp: new Date().toISOString(),
    });

    // Log to console for demo purposes
    console.log('Analytics Event:', event);

    // In production, send to your analytics provider
    // Example: gtag('event', event.event, { ... });
  }

  // Predefined tracking methods for common events
  trackResumeGenerated(templateType: string) {
    this.track({
      event: 'resume_generated',
      category: 'resume',
      label: templateType,
      properties: { template: templateType }
    });
  }

  trackTemplateSelected(templateType: string) {
    this.track({
      event: 'template_selected',
      category: 'template',
      label: templateType,
      properties: { template: templateType }
    });
  }

  trackAIFeatureUsed(featureType: string, context?: string) {
    this.track({
      event: 'ai_feature_used',
      category: 'ai',
      label: featureType,
      properties: { feature: featureType, context }
    });
  }

  trackResumeDownloaded(format: string = 'pdf') {
    this.track({
      event: 'resume_downloaded',
      category: 'resume',
      label: format,
      properties: { format }
    });
  }

  trackPageView(pageName: string) {
    this.track({
      event: 'page_view',
      category: 'navigation',
      label: pageName,
      properties: { page: pageName }
    });
  }

  trackUserEngagement(action: string, section: string) {
    this.track({
      event: 'user_engagement',
      category: 'engagement',
      label: action,
      properties: { action, section }
    });
  }

  // Get analytics data (for demo purposes)
  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }
}

export const analytics = new AnalyticsService();