import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';
import { firestoreService } from '../services/firebase/firestoreService';
import { where } from 'firebase/firestore';
import { observabilityClient } from '../services/observability/observabilityClient';

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  orderRef?: string;
  description: string;
  status: 'open' | 'resolved';
  createdAt: string;
  messages: Array<{
    id: string;
    sender: 'user' | 'agent';
    text: string;
    timestamp: string;
  }>;
}

interface SupportState {
  searchQuery: string;
  selectedCategory: string | null;
  tickets: SupportTicket[];
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  submitTicket: (ticket: {
    subject: string;
    category: string;
    orderRef?: string;
    description: string;
  }) => string;
  addMessageToTicket: (ticketId: string, text: string) => void;
  subscribeSupportTickets: (uid: string) => void;
  unsubscribeSupportTickets: () => void;
}

const MOCK_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-2041',
    subject: 'Missing beverage in my order',
    category: 'Refunds & Cancellations',
    orderRef: 'FST-743021',
    description: 'I ordered a Diet Coke along with my burger, but only the burger was delivered.',
    status: 'resolved',
    createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        text: 'I ordered a Diet Coke along with my burger, but only the burger was delivered.',
        timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
      },
      {
        id: 'msg-2',
        sender: 'agent',
        text: 'Hi John, I am Sarah from Feasto Support. I see the missing beverage. We have initiated a refund of ₹60 for the Diet Coke. It will reflect in your account within 2-3 business days.',
        timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
      },
    ],
  },
];

let ticketsUnsubscribe: (() => void) | null = null;

export const useSupportStore = create<SupportState>()(
  persist(
    (set, get) => ({
      searchQuery: '',
      selectedCategory: null,
      tickets: MOCK_TICKETS,
      
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

      subscribeSupportTickets: (uid) => {
        get().unsubscribeSupportTickets();

        ticketsUnsubscribe = firestoreService.listenCollection(
          'support_tickets',
          (snap) => {
            const list: SupportTicket[] = [];
            snap.forEach((doc) => {
              list.push({ ...doc.data(), id: doc.id } as SupportTicket);
            });
            set({ tickets: list.length > 0 ? list : MOCK_TICKETS });
          },
          (err) => {
            observabilityClient.captureError(err, 'network', {
              severity: 'warn',
              failedRequestType: 'firestore-support-tickets-read',
            });
            console.warn('⚠️ Cloud Firestore: support tickets read restricted. Using persistent cache.', err.message);
          },
          [where('userId', '==', uid)]
        );
      },

      unsubscribeSupportTickets: () => {
        if (ticketsUnsubscribe) {
          ticketsUnsubscribe();
          ticketsUnsubscribe = null;
        }
      },

      submitTicket: (ticketData) => {
        const uid = useAuthStore.getState().user?.uid;
        const id = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
        const newTicket: SupportTicket & { userId: string } = {
          ...ticketData,
          id,
          status: 'open',
          createdAt: new Date().toISOString(),
          userId: uid || 'anonymous',
          messages: [
            {
              id: `msg-${Date.now()}`,
              sender: 'user',
              text: ticketData.description,
              timestamp: new Date().toISOString(),
            },
          ],
        };

        if (uid) {
          firestoreService.setDocument(`support_tickets/${id}`, newTicket);
        } else {
          set((state) => ({
            tickets: [newTicket, ...state.tickets],
          }));
        }
        return id;
      },

      addMessageToTicket: (ticketId, text) => {
        const uid = useAuthStore.getState().user?.uid;
        const ticket = get().tickets.find((t) => t.id === ticketId);
        
        if (ticket) {
          const updatedMessages = [
            ...ticket.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'user' as const,
              text,
              timestamp: new Date().toISOString(),
            },
          ];

          if (uid) {
            firestoreService.updateDocument(`support_tickets/${ticketId}`, { messages: updatedMessages });
          } else {
            set((state) => ({
              tickets: state.tickets.map((t) => {
                if (t.id === ticketId) {
                  return { ...t, messages: updatedMessages };
                }
                return t;
              }),
            }));
          }
        }
      },
    }),
    {
      name: 'feasto-support-v2',
    }
  )
);
