import React, { useEffect, useState } from 'react';
import CardOne from '../../../../assets/ceoMarkaerting.png';
import CardTwo from '../../../../assets/piterSmith.jpg';
import CardThree from '../../../../assets/Oliver Twist.jpg';
import CardFour from '../../../../assets/JamesAndrew.jpg';
import { Alert, Button, Space } from 'antd';

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
            <div className="flex flex-col mb-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal text-sky-900">
                    What My Clients Say
                </h1>
                <hr className="border-t-4 border-black w-1/3 mt-2" />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {comments.map((comment, index) => (
                    <div
                        key={comment.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                        {/* Card Image */}
                        <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                            <img
                                src={images[index % images.length]}
                                alt={comment.customerName}
                                className="w-full h-48 object-cover object-center"
                            />
                        </div>

                        {/* Card Content */}
                        <div className="p-4 space-y-2">
                            <h5 className="text-lg md:text-xl font-semibold text-sky-900 truncate">
                                {comment.customerName}
                            </h5>
                            <p className="text-sm md:text-base text-gray-600 line-clamp-3">
                                {comment.comment}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CommentSection;