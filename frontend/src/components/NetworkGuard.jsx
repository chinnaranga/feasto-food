import { useNetworkStatus } from "../hooks/useNetworkStatus";
import OfflinePage from "../pages/OfflinePage";

export default function NetworkGuard({ children }) {
    const isOnline = useNetworkStatus();

    if (!isOnline) {
        return <OfflinePage />;
    }

    return children;
}
