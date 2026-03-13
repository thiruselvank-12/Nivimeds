import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocationStore {
  pincode: string;
  city: string;
  state: string;
  isServiceable: boolean;
  isDetecting: boolean;
  setPincode: (pincode: string) => void;
  setLocation: (pincode: string, city: string, state: string) => void;
  setServiceable: (serviceable: boolean) => void;
  setDetecting: (detecting: boolean) => void;
  simulateGPSDetect: () => Promise<void>;
}

// Serviceable pincodes simulation
const SERVICEABLE_PINCODES = new Set([
  '600001','600002','600010','600020','600050','600100','600102',
  '400001','400050','400070','110001','110010','110011','500001',
  '560001','560010','560100','700001','700010','201301',
]);

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      pincode: '600100',
      city: 'Chennai',
      state: 'Tamil Nadu',
      isServiceable: true,
      isDetecting: false,

      setPincode: (pincode) => {
        const serviceable = SERVICEABLE_PINCODES.has(pincode);
        set({ pincode, isServiceable: serviceable });
      },

      setLocation: (pincode, city, state) =>
        set({ pincode, city, state, isServiceable: true }),

      setServiceable: (isServiceable) => set({ isServiceable }),

      setDetecting: (isDetecting) => set({ isDetecting }),

      simulateGPSDetect: async () => {
        set({ isDetecting: true });
        await new Promise((r) => setTimeout(r, 3000));
        set({
          pincode: '600102',
          city: 'Chennai',
          state: 'Tamil Nadu',
          isServiceable: true,
          isDetecting: false,
        });
      },
    }),
    { name: 'nivimeds-location' }
  )
);
