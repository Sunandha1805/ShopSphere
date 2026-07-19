const STATUS_CONFIG = {
    // Order statuses
    Pending:    { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400",   label: "Pending" },
    Confirmed:  { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-400",    label: "Confirmed" },
    Processing: { bg: "bg-indigo-50",  text: "text-indigo-700",  dot: "bg-indigo-400",  label: "Processing" },
    Shipped:    { bg: "bg-violet-50",  text: "text-violet-700",  dot: "bg-violet-400",  label: "Shipped" },
    Delivered:  { bg: "bg-teal-50",    text: "text-teal-700",    dot: "bg-teal-400",    label: "Delivered" },
    Cancelled:  { bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-400",     label: "Cancelled" },
    Returned:   { bg: "bg-orange-50",  text: "text-orange-700",  dot: "bg-orange-400",  label: "Returned" },

    // Payment statuses
    Paid:       { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400", label: "Paid" },
    Success:    { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400", label: "Paid" },
    Unpaid:     { bg: "bg-gray-50",    text: "text-gray-600",    dot: "bg-gray-400",    label: "Unpaid" },
    Refunded:   { bg: "bg-purple-50",  text: "text-purple-700",  dot: "bg-purple-400",  label: "Refunded" },
    Failed:     { bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-400",     label: "Failed" },
};

const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || {
        bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400", label: status
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
};

export default StatusBadge;