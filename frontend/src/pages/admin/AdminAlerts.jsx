import React, { useState } from 'react';

import LiquidCard from '../../components/liquid/LiquidCard';
import LiquidButton from '../../components/liquid/LiquidButton';
import { AlertCircle, AlertTriangle, CheckCircle, Clock, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import LiquidInput from '../../components/liquid/LiquidInput';

// Mock Data
const ALERTS_DATA = [
    { id: 1, severity: 'critical', title: 'High Database Latency', description: 'Firestore read latency exceeded 500ms for 5 minutes.', timestamp: '2 mins ago', status: 'open' },
    { id: 2, severity: 'warning', title: 'API Rate Limit Approaching', description: 'Global API requests at 85% of quota.', timestamp: '15 mins ago', status: 'open' },
    { id: 3, severity: 'info', title: 'Deployment Successful', description: 'Frontend v1.2.0 deployed successfully.', timestamp: '1 hour ago', status: 'resolved' },
    { id: 4, severity: 'critical', title: 'Payment Gateway Error', description: 'Stripe webhook failure rate > 2%.', timestamp: '3 hours ago', status: 'resolved' },
    { id: 5, severity: 'warning', title: 'High Memory Usage', description: 'Instance A heap usage at 92%.', timestamp: '5 hours ago', status: 'resolved' },
];

const SEVERITY_STYLES = {
    critical: "bg-red-500/10 text-red-400 border-red-500/20 ring-red-500/30",
    warning: "bg-orange-500/10 text-orange-400 border-orange-500/20 ring-orange-500/30",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20 ring-blue-500/30",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ring-emerald-500/30",
};

const SEVERITY_ICONS = {
    critical: AlertCircle,
    warning: AlertTriangle,
    info: Clock,
    success: CheckCircle,
};

function AlertItem({ alert }) {
    const [expanded, setExpanded] = useState(false);
    const Icon = SEVERITY_ICONS[alert.severity] || Clock;

    return (
        <LiquidCard className={`p-0 overflow-hidden transition-all duration-300 ${alert.severity === 'critical' && alert.status === 'open' ? 'ring-1 ring-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : ''}`} hoverEffect={false}>
            <div
                className="p-5 flex items-start gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                {/* Icon Badge */}
                <div className={`p-3 rounded-xl border ring-1 ${SEVERITY_STYLES[alert.severity]}`}>
                    <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white font-medium truncate pr-4">{alert.title}</h3>
                        <span className="text-xs text-gray-500 font-mono flex-shrink-0">{alert.timestamp}</span>
                    </div>
                    <p className="text-gray-400 text-sm truncate">{alert.description}</p>
                </div>

                {/* Action/Expand */}
                <button className="text-gray-500 hover:text-white transition-colors">
                    {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
            </div>

            {/* Expanded Details */}
            {expanded && (
                <div className="px-5 pb-5 pt-0 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="h-px w-full bg-white/5 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                            <span className="text-gray-500 block mb-1">Status</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${alert.status === 'open' ? 'bg-white/10 text-white' : 'bg-green-500/10 text-green-400'}`}>
                                {alert.status}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500 block mb-1">Incident ID</span>
                            <span className="text-gray-300 font-mono">INC-{1000 + alert.id}</span>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <LiquidButton variant="ghost" className="text-sm py-2 px-4">View Logs</LiquidButton>
                        {alert.status === 'open' && (
                            <LiquidButton variant="primary" className="text-sm py-2 px-4">Acknowledge</LiquidButton>
                        )}
                    </div>
                </div>
            )}
        </LiquidCard>
    );
}

export default function AdminAlerts() {
    const [filter, setFilter] = useState('all');

    return (
        <div className="space-y-6 fade-in-up">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Alerts & Incidents</h1>
                    <p className="text-gray-400">System health monitoring and incident response.</p>
                </div>
                <div className="flex gap-3">
                    <LiquidButton variant="ghost" className="px-4 py-2">
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </LiquidButton>
                    <LiquidButton variant="secondary" className="px-4 py-2 bg-white/5">
                        <Clock className="w-4 h-4 mr-2" /> Last 24h
                    </LiquidButton>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <LiquidInput icon={Search} placeholder="Search alerts by keyword, ID, or service..." />
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
                {ALERTS_DATA.map(alert => (
                    <AlertItem key={alert.id} alert={alert} />
                ))}
            </div>

        </div>
    );
}
