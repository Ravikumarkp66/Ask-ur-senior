import { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from "./Navbar";

function Upload() {
    const [file, setFile] = useState(null);
    const [uploadedUrl, setUploadedUrl] = useState("");

    const handleUpload = async () => {
        if (!file) return alert("Select a file first!");
        const storageRef = ref(storage, `uploads/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setUploadedUrl(url);
        alert("File uploaded successfully!");
    };

    return (
        <div>
            <Navbar />
            <div className="p-8">
                <h2 className="text-2xl font-bold mb-6">Admin Upload Page</h2>
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="border p-2 mb-4"
                />
                <button
                    onClick={handleUpload}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Upload
                </button>
                {uploadedUrl && (
                    <p className="mt-4 text-green-600">File URL: {uploadedUrl}</p>
                )}
            </div>
        </div>
    );
}

export default Upload;
