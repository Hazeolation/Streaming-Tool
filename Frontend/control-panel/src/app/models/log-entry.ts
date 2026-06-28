import { LogLevel } from '../enums/log-level';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: any;
  scope?: any;
}
