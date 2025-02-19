import React, { useState } from "react";
import InputLabel from "../Dashboard/Form/InputLabel";
import { router, usePage } from "@inertiajs/react";
import { ProductReviewInterface } from "@/Interfaces/ProducReview";

type Props = {
    productSlug: string;
    reviews: ProductReviewInterface[];
    ratingTotal: number | null;
};

const ReviewProduct = ({ productSlug, reviews, ratingTotal }: Props) => {
    const { user } = usePage().props.auth;
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rating, setRating] = useState<number>(1);
    const [review, setReview] = useState("");
    const [hover, setHover] = useState(1);

    const handleReviewProduct = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setErrorMessage(null);

        if (!rating) {
            setErrorMessage("Por favor selecciona una calificación.");
            return;
        }
        setIsSubmitting(true);

        try {
            await router.post(`/product/${productSlug}/review`, {
                rate: rating,
                review: review.trim(),
            });
        } catch (error: any) {
            setErrorMessage(
                `Error: ${error.message || "Unknown error occurred"}`
            );
            console.error("Error:", error);
        } finally {
            setRating(1);
            setReview("");
            setIsSubmitting(false);
        }
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={`fa fa-star ${
                        i <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                ></i>
            );
        }
        return stars;
    };

    return (
        <div className=" mt-2">
            <div className="comment-review">
                <div className="add-review">
                    <h5 className="font-semibold">Agregar una reseña</h5>
                    <p>
                        Su dirección de correo electrónico no será publicada.
                        Los campos obligatorios están marcados
                    </p>
                </div>
                <h4 className="text-base font-medium">
                    <InputLabel
                        htmlFor="calificacion"
                        value="Tu calificación"
                        required
                    />
                </h4>
                <div className="review-inner">
                    {user ? (
                        <form className="form" onSubmit={handleReviewProduct}>
                            <p className="text-red-600">{errorMessage}</p>
                            <div className="flex flex-wrap">
                                {/* Rating Stars */}
                                <div className="w-full">
                                    <div className="rating">
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <label
                                                key={value}
                                                htmlFor={`star${value}`}
                                            >
                                                <input
                                                    id={`star${value}`}
                                                    type="radio"
                                                    name="rating"
                                                    value={value}
                                                    onChange={() =>
                                                        setRating(value)
                                                    }
                                                />
                                                <span
                                                    className={`star ${
                                                        value <=
                                                        (hover || rating!)
                                                            ? "filled"
                                                            : ""
                                                    }`}
                                                    onMouseEnter={() =>
                                                        setHover(value)
                                                    }
                                                    onMouseLeave={() =>
                                                        setHover(0)
                                                    }
                                                >
                                                    ★
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Textarea para la reseña */}
                                <div className="w-full mt-2">
                                    <textarea
                                        name="review"
                                        placeholder="Escribe una reseña"
                                        className="border border-gray-300 rounded-lg h-32 w-full px-4 pt-2 text-gray-600 text-sm mb-4 resize-none focus:border-accent focus:ring-accent"
                                        value={review}
                                        onChange={(e) =>
                                            setReview(e.target.value)
                                        }
                                    ></textarea>
                                </div>

                                {/* Botón de envío */}
                                <button
                                    type="submit"
                                    className="primary-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Enviando Reseña"
                                        : "Enviar Reseña"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-center p-5">
                            Necesitas{" "}
                            <a
                                href={route("login")}
                                className="text-black hover:text-accent underline"
                            >
                                Iniciar Sesión
                            </a>{" "}
                            o{" "}
                            <a
                                className="text-black hover:text-accent underline"
                                href={route("register")}
                            >
                                Registrarte
                            </a>
                        </p>
                    )}
                </div>

                <div className="mt-10">
                    <h4 className="text-lg font-bold">
                        {(ratingTotal || 0).toFixed(1)} <span>(Overall)</span>
                    </h4>

                    <span className="text-sm">
                        Basado en {reviews.length} Comentarios
                    </span>

                    <div className="bg-gray-100 mt-4 rounded-lg p-6">
                        {reviews.map((review, index) => (
                            <div
                                key={index}
                                className="flex gap-6 items-center mb-4"
                            >
                                <div>
                                    <img
                                        className="w-16 h-16 rounded-full object-cover"
                                        src={review.user_info.photo}
                                        alt={review.user_info.name}
                                    />
                                </div>
                                <div>
                                    <h6 className="font-semibold text-sm">
                                        {review.user_info.name}
                                    </h6>

                                    {/* 🔹 Estrellas dinámicas */}
                                    <div className="flex items-center text-sm">
                                        {renderStars(review.rate)}
                                        <span className="ml-2 text-gray-600">
                                            ({review.rate})
                                        </span>
                                    </div>

                                    <p className="text-gray-700">
                                        {review.review}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewProduct;
