type OrdersAreaChartProps = {
    allOrders: any[];
};

export default function OrdersAreaChart({ allOrders }: OrdersAreaChartProps) {
    return (
        <div className="p-5 border rounded">
            <p className="text-slate-500">Orders Area Chart</p>
        </div>
    );
}
