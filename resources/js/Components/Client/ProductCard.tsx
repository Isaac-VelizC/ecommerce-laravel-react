import React from "react";

type Props = {
    title: string;
    rating: number;
    price: string;
    img: string;
    sale?: boolean;
};

const ProductCard: React.FC<Props> = ({ title, rating, img, sale, price }) => {
    return (
        <div className="p-0 mb-[35px]">
            <div className="mb-8">
                <div className="relative h-80 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${img})` }}>
                    {sale && <div className="label sale bg-[#ca1515] text-white text-[12px] font-medium absolute left-2 top-2 px-2 py-1 uppercase">Sale</div>}
                    <ul className="absolute left-0 w-full text-center inset-x-0 bottom-[30px] flex justify-center opacity-0 hover:top-0 transition-opacity duration-300 hover:opacity-100">
                        <li>
                            <a
                                href="img/product/product-1.jpg"
                                className="image-popup"
                            >
                                <span className="arrow_expand"></span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                            <i className="fa-regular fa-heart"></i>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span className="icon_bag_alt"></span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="product__item__text text-center pt-[22px]">
                    <h6>
                        <a href="#">{title}</a>
                    </h6>
                    <div className="rating mb-[5px]">
                        {[...Array(rating)].map((_, i) => (
                            <i
                                key={i}
                                className="fa fa-star text-[#e3c01c] text-[10px]"
                            />
                        ))}
                    </div>
                    <div
                        className={`product__price ${
                            sale ? "text-[#ca1515]" : "text-[#111111]"
                        } font-semibold`}
                    >
                        {price}
                        {sale && (
                            <span className="text-[#b1b0b0] line-through ml-[4px]">
                                $ 69.0
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;


{/*[
                        {  },
                    ].map((product, index) => (
                        <div key={index} className="w-full lg:w-1/4 md:w-1/3 sm:w-1/2 p-0 mb-[35px]">
                            <div className={`product__item ${product.sale ? 'sale' : ''}`}>
                                <div className="h-[360px] relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${product.img})` }}>
                                    {product.sale && <div className="label sale bg-[#ca1515] text-white text-[12px] font-medium absolute left-2 top-2 px-2 py-1 uppercase">Sale</div>}
                                    <ul className="product__hover absolute left-0 w-full text-center inset-x-0 bottom-[30px] flex justify-center opacity-0 hover:top-0 transition-opacity duration-300 hover:opacity-100">
                                        <li className=' list-none inline-block mr-2 hover:bg-[#ca1515] relative top-24 opacity-0'><a href={product.img} className="image-popup"><span className="arrow_expand"></span></a></li>
                                        <li className=' list-none inline-block mr-2 hover:bg-[#ca1515] relative top-24 opacity-0'><a href="#"><span className="fa fa-heart"></span></a></li>
                                        <li className=' list-none inline-block mr-2 hover:bg-[#ca1515] relative top-24 opacity-0'><a href="#"><span className="icon_bag_alt"></span></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))*/}