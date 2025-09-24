interface ValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

export class FileValidator {
  private static readonly ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];

  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly MIN_FILE_SIZE = 100; // 100 bytes

  private static readonly DANGEROUS_EXTENSIONS = [
    '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js',
    '.jar', '.zip', '.rar', '.7z', '.dmg', '.pkg', '.deb', '.rpm'
  ];

  static validateFile(file: File): ValidationResult {
    const warnings: string[] = [];
    
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds the maximum limit of 10MB.`
      };
    }

    if (file.size < this.MIN_FILE_SIZE) {
      return {
        isValid: false,
        error: 'File appears to be empty or corrupted.'
      };
    }

    // Check file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'Invalid file type. Please upload a PDF, Word document, or text file.'
      };
    }

    // Check file extension
    const extension = this.getFileExtension(file.name);
    if (this.DANGEROUS_EXTENSIONS.includes(extension.toLowerCase())) {
      return {
        isValid: false,
        error: 'File type not allowed for security reasons.'
      };
    }

    // Additional checks for specific file types
    if (file.type === 'application/pdf') {
      if (file.size > 5 * 1024 * 1024) { // 5MB warning for PDFs
        warnings.push('Large PDF files may take longer to process.');
      }
    }

    if (file.type === 'text/plain') {
      if (file.size < 500) { // Less than 500 bytes
        warnings.push('Text file appears quite small. Ensure it contains your complete resume.');
      }
    }

    // Check filename for suspicious patterns
    if (this.hasSuspiciousFilename(file.name)) {
      warnings.push('Filename contains unusual characters that may cause processing issues.');
    }

    return {
      isValid: true,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  private static getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot > -1 ? filename.substring(lastDot) : '';
  }

  private static hasSuspiciousFilename(filename: string): boolean {
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /[<>:"|?*]/,  // Windows reserved characters
      /^\./,        // Hidden files
      /\s{2,}/,     // Multiple consecutive spaces
      /[\x00-\x1f]/ // Control characters
    ];

    return suspiciousPatterns.some(pattern => pattern.test(filename));
  }

  static getReadableFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static getFileTypeDescription(type: string): string {
    const descriptions: Record<string, string> = {
      'application/pdf': 'PDF Document',
      'application/msword': 'Word Document (Legacy)',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
      'text/plain': 'Text File'
    };

    return descriptions[type] || 'Unknown File Type';
  }
}