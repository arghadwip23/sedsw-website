// types/event.ts
export interface IEvent {
  eventName: string;
  date: string; // stored as "dd-mm-yyyy"
  location: string;
  description: string;
  thumbnail: string;
  category: string;
}