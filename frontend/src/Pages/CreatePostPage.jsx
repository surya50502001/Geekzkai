import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreatePostModal from "../Components/CreatePostModal";

export default function CreatePostPage() {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const navigate = useNavigate();

    const handleCloseModal = () => {
        setIsModalOpen(false);
        navigate("/");
    };

    return <CreatePostModal isOpen={isModalOpen} onClose={handleCloseModal} />;
}
