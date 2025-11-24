'use client'

import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon } from "lucide-react"
import { useEffect, useState } from "react"
import Loading from "@/app/components/admin/Loading";
import OrdersAreaChart from "@/app/components/admin/OrdersAreaChart";

//  Added imports (Clerk auth)
import { useUser, RedirectToSignIn } from "@clerk/nextjs";

const dummyAdminDashboardData = {
  products: 1,
  revenue: 1000,
  orders: 2,
  stores: 5,
  allOrders: []
}

export default function AdminDashboard() {

    //  Clerk user
    const { user, isLoaded } = useUser();

    // Clerk still loading
    if (!isLoaded) return <Loading />;

    // Not logged in → Show Clerk login popup
    if (!user) return <RedirectToSignIn />;

    //  Allowed admin email
    const allowedAdmin = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const email = user.primaryEmailAddress?.emailAddress || "";

    // Not admin user → Block access
    if (email !== allowedAdmin) {
        return (
            <div className="p-10 text-center text-red-600 text-xl">
                You are not authorized to view this page.
            </div>
        );
    }

    //  Your existing code starts here
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState(dummyAdminDashboardData)

    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.products, icon: ShoppingBasketIcon },
        { title: 'Total Revenue', value: currency + dashboardData.revenue, icon: CircleDollarSignIcon },
        { title: 'Total Orders', value: dashboardData.orders, icon: TagsIcon },
        { title: 'Total Stores', value: dashboardData.stores, icon: StoreIcon },
    ]

    useEffect(() => {
        setLoading(false)
    }, [])

    if (loading) return <Loading />

    return (
        <div className="text-slate-500">
            <h1 className="text-2xl">Admin <span className="text-slate-800 font-medium">Dashboard</span></h1>

            <div className="flex flex-wrap gap-5 my-10 mt-4">
                {dashboardCardsData.map((card, index) => (
                    <div key={index} className="flex items-center gap-10 border border-slate-200 p-3 px-6 rounded-lg">
                        <div className="flex flex-col gap-3 text-xs">
                            <p>{card.title}</p>
                            <b className="text-2xl font-medium text-slate-700">{card.value}</b>
                        </div>
                        <card.icon size={50} className="w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full" />
                    </div>
                ))}
            </div>

            <OrdersAreaChart allOrders={dashboardData.allOrders} />
        </div>
    )
}
