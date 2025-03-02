import { Head, Link, usePage } from "@inertiajs/react";
import { PropsWithChildren } from "react";
import Client from "./ClientLayout";
import Breadcrumb from "@/Components/Client/Breadcrumb";

export default function AccountLayout({ children }: PropsWithChildren) {
    const { url, props } = usePage();
    const user = props.auth.user;
    const breadcrumbLinks = [
        { href: "/", label: "Home" },
        { href: "#", label: "Cuenta" },
        { href: "#", label: user.name },
    ];

    const menuItems = [
        { href: "/account/profile", label: "Perfil" },
        { href: "/account/orders", label: "Pedidos" },
        { href: "/account/reviews", label: "Reseñas" },
    ];

    return (
        <Client>
            <Head title="Cuenta" />
            <Breadcrumb links={breadcrumbLinks} />
            <section className="min-h-screen pt-10 lg:pt-20 pb-20">
                <div className="mx-4 sm:mx-10 xl:mx-44">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white shadow-lg rounded-lg p-2 lg:p-6">
                        {/* Menú lateral */}
                        <aside className="md:col-span-1 bg-gray-50 p-4 rounded-lg">
                            <div className="text-center mb-6">
                                <img
                                    src={user.photo ?? 'https://i.pinimg.com/736x/c3/36/df/c336dfaf9f076cdbebf896d68585c355.jpg'}
                                    alt={user.name}
                                    className="w-24 h-24 mx-auto object-cover bg-center bg-cover rounded-full border-2 border-gray-300"
                                />
                                <h2 className="text-lg font-semibold mt-2">
                                    {user.name}
                                </h2>
                                <p>{user.email}</p>
                            </div>
                            <nav>
                                <ul className="space-y-2">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className={`block px-4 py-2 rounded-lg transition ${
                                                    url.startsWith(item.href)
                                                        ? "bg-accent text-white font-semibold"
                                                        : "hover:bg-gray-200 text-gray-700"
                                                }`}
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            {/* Logout */}
                            <div className="mt-6">
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    className="w-full border-2 rounded-lg block text-center font-semibold transition py-1 hover:bg-pink-300"
                                >
                                    Salir
                                </Link>
                            </div>
                        </aside>

                        {/* Contenido dinámico de cada página */}
                        <main className="md:col-span-3 bg-white rounded-lg shadow-sm">
                            {children}
                        </main>
                    </div>
                </div>
            </section>
        </Client>
    );
}
