import React, { useEffect, useState } from 'react';
import CardOne from '../../../../assets/ceoMarkaerting.png';
import CardTwo from '../../../../assets/piterSmith.jpg';
import CardThree from '../../../../assets/Oliver Twist.jpg';
import CardFour from '../../../../assets/JamesAndrew.jpg';
import { Alert, Button, Space } from 'antd';
import { MapPinIcon, ClockIcon, ShieldCheckIcon, StarIcon, CheckCircle2Icon, ArrowRightIcon } from "lucide-react";


function CommentSection() {
    const [comments, setComments] = useState([]); // State to store fetched comments
    const images = [CardOne, CardTwo, CardThree, CardFour];

    // Fetch random comments from the API
    const getRandomComments = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACS_URL}/comment/randomComment`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const responseData = await response.json();
            if (response.ok) {
                // Update the state with the fetched comments
                setComments(responseData.data.map(comment => ({
                    id: comment._id, // Assuming the API returns an `_id` field
                    customerName: comment.customerName, // Map `username` to `customerName`
                    comment: comment.comment, // Map `comment` to `comment`
                })));
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getRandomComments();
    }, []);

    return (
        <div className="container pt-4 mx-auto mt-20 px-4 py-8" id="clients">
            {/* Header Section */}
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Customer Reviews
                </h2>
                <div className="w-24 h-1 bg-[#FCA000] mx-auto"></div>
            </div>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 ">
                {comments.map((comment, index) => (
                    <div
                        key={comment.id}
                        className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                        {/* Card Header with Image and Name */}
                        <div className="flex items-center gap-4 mb-6">
                            <img
                                src={images[index % images.length]}
                                alt={comment.customerName}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                                <h3 className="font-semibold text-lg text-sky-900">
                                    {comment.customerName}
                                </h3>
                                <p className="text-gray-600">{comment.role}</p>
                            </div>
                        </div>

                        {/* Star Rating */}
                        <div className="flex mb-4">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                            ))}
                        </div>

                        {/* Comment */}
                        <p className="text-gray-600 italic">"{comment.comment}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CommentSection;