import BlogCard from "@/Components/Client/BlogCard";
import Breadcrumb from "@/Components/Client/Breadcrumb";
import Instagram from "@/Containers/Instagram";
import { PostInterface } from "@/Interfaces/Post";
import Client from "@/Layouts/ClientLayout";
import { Head } from "@inertiajs/react";

type Props = {
    posts: PostInterface[];
};

export default function Blog({ posts }: Props) {
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {posts.length <= 0 ? (
                            <div className="col-span-3">
                                <p className="text-center">No hay publicaciones</p>
                            </div>
                        ) : (
                            posts.map((post, index) => (
                                <BlogCard
                                    key={index}
                                    img={post.photo}
                                    title={post.title}
                                    user={post.author_info.name}
                                    fecha="Seb 17, 2019"
                                />
                            ))
                        )}
                        {posts.length > 0 && (
                            <div className="w-full text-center mt-10 col-span-full">
                                <a href="#" className="site-btn">
                                    Más publicaciones
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Instagram />
        </Client>
    );
}
