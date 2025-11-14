import AdminLayout from "@/app/components/admin/AdminLayout";
export const metadata = {
    title: "DGSTECH. - Admin",
    description: "DGSTECH. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}