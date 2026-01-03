export function SellerPolicyLayout({
    title,
    lastUpdated,
    children
}: {
    title: string
    lastUpdated: string
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-50 py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm border p-8 md:p-12">
                    <div className="border-b pb-8 mb-8">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{title}</h1>
                        <p className="text-slate-500 font-medium">Last Updated: {lastUpdated}</p>
                    </div>
                    <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-blue-600">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
