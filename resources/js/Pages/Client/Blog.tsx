import BlogCard from "@/Components/Client/BlogCard";
import Breadcrumb from "@/Components/Client/Breadcrumb";
import Instagram from "@/Containers/Instagram";
import Client from "@/Layouts/ClientLayout";
import Blog1 from "@/assets/img/blog/blog-1.jpg";
import Blog2 from "@/assets/img/blog/blog-2.jpg";
import Blog3 from "@/assets/img/blog/blog-3.jpg";
import Blog4 from "@/assets/img/blog/blog-4.jpg";
import { Head } from "@inertiajs/react";

type Props = {};

export default function Blog({}: Props) {
    const breadcrumbLinks = [
        { href: "/", label: "Home" },
        { href: "blog", label: "Blog" },
    ];
    return (
        <Client>
            <Head title="Blog" />
            <Breadcrumb links={breadcrumbLinks} />
            <section className="blog pt-16 pb-20">
                <div className="container mx-auto">
                    <div className="flex flex-wrap">
                        {/* Columna 1 */}
                        <div className="w-full lg:w-1/3 md:w-1/2 sm:w-1/2 p-4">
                            <BlogCard
                                img={Blog1}
                                title="No Bad Blood! The Reason Why Tamr
                                            Judge Finally Made Up With..."
                                user="Ema Timahe"
                                fecha="Seb 17, 2019"
                            />
                            <BlogCard
                                img={Blog4}
                                title="No Bad Blood! The Reason Why Tamr
                                            Judge Finally Made Up With..."
                                user="Ema Timahe"
                                fecha="Seb 17, 2019"
                            />
                        </div>

                        {/* Columna 2 */}
                        <div className="w-full lg:w-1/3 md:w-1/2 sm:w-1/2 p-4">
                            <BlogCard
                                img={Blog2}
                                title="Amf Cannes Red Carpet Celebrities
                                            Kendall Jenner, Pamela..."
                                user="Ema Timahe"
                                fecha="Seb 17, 2019"
                            />
                            {/* Más items aquí... */}
                        </div>

                        {/* Columna 3 */}
                        <div className="w-full lg:w-1/3 md:w-1/2 sm:w-1/2 p-4">
                            <BlogCard
                                img={Blog3}
                                title="Gigi Hadid, Rita Ora, Serena & Other Hot Celebs Stun At 2019..."
                                user="Ema Timahe"
                                fecha="Seb 17, 2019"
                            />

                            {/* Más items aquí... */}
                        </div>

                        {/* Cargar más publicaciones */}
                        <div className="w-full text-center mt-10">
                            <a
                                href="#"
                                className="primary-btn load-btn text-gray-900 bg-gray-200 rounded-full py-[12px] px-[85px]"
                            >
                                Load more posts
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <Instagram />
        </Client>
    );
}
