import React from "react";

export default function OrdersTable() {
    const orders = [
        { id: "ORD123", user: "Ravi", total: 432, status: "Paid" },
        { id: "ORD124", user: "Anita", total: 299, status: "Pending" },
        { id: "ORD125", user: "Suresh", total: 1150, status: "Paid" },
        { id: "ORD126", user: "Priya", total: 850, status: "Failed" },
    ];

    return (
        <div className="rounded-xl bg-[#18181b] border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5">
                <h3 className="font-semibold text-white">Recent Orders</h3>
            </div>
            <table className="w-full text-sm">
                <thead className="bg-black/30 text-gray-400">
                    <tr>
                        <th className="p-3 text-left">Order ID</th>
                        <th className="p-3 text-left">User</th>
                        <th className="p-3 text-left">Total</th>
                        <th className="p-3 text-left">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {orders.map(o => (
                        <tr key={o.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 font-mono text-gray-300">{o.id}</td>
                            <td className="p-3 text-white">{o.user}</td>
                            <td className="p-3 text-white">₹{o.total}</td>
                            <td className={`p-3 font-medium ${o.status === "Paid" ? "text-green-400" :
                                    o.status === "Pending" ? "text-yellow-400" : "text-red-400"
                                }`}>
                                {o.status}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
