import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./TaskWork.module.css";
import { FiUpload, FiLink } from "react-icons/fi";
import { FaFileAlt } from "react-icons/fa";
import { AiOutlineComment } from "react-icons/ai";

function TaskWork() {
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "preset");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dukptptve/upload",
      formData,
    );

    return res.data.secure_url;
  };
  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [files, setFiles] = useState([]);
  const [links, setLinks] = useState([""]);
  const [comment, setComment] = useState("");

  const fetchTask = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`http://localhost:3000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setTask(res.data);
    } catch {
      toast.error("Failed to load task");
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const handleFileChange = (e) => {
    setFiles([...files, ...e.target.files]);
  };

  const addLink = () => {
    setLinks([...links, ""]);
  };

  const updateLink = (value, index) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

 const submitWork = async () => {
  try {
    const token = localStorage.getItem("token");

    const validLinks = links.filter((l) => l.trim() !== "");

    if (files.length === 0 && validLinks.length === 0) {
      return toast.error("Upload at least one file or link");
    }

    let uploadedFileUrls = [];

    if (files.length > 0) {
      toast.info("Uploading files...");

      uploadedFileUrls = await Promise.all(
        files.map((file) => uploadToCloudinary(file))
      );
    }

    // combine cloudinary files + links
    const allFiles = [...uploadedFileUrls, ...validLinks];

    await axios.post(
      `http://localhost:3000/api/submit/${id}`,
      {
        message: comment,
        files: allFiles
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      }
    );

    toast.success("Work submitted successfully");

    setFiles([]);
    setLinks([""]);
    setComment("");

  } catch (error) {
    toast.error(error.response?.data?.message || "Submission failed");
  }
};

  if (!task) return <p>Loading task...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>{task.title}</h2>

        <div className={styles.meta}>
          <p>
            Client: <span>{task.customer?.firstName}</span>
          </p>
          <p>
            Price: <span>${task.price}</span>
          </p>
        </div>

        <p className={styles.description}>{task.description}</p>

        <div className={styles.uploadArea}>
          <h3 className={styles.sectionTitle}>
            <FiUpload /> Submit Your Work
          </h3>

          <label className={styles.fileBox}>
            <input
              type="file"
              multiple
              accept=".pdf,image/*"
              onChange={handleFileChange}
            />
            Click to upload files
          </label>

          {files.length > 0 && (
            <div className={styles.fileList}>
              {files.map((file, index) => (
                <p key={index}>
                  <FaFileAlt /> {file.name}
                </p>
              ))}
            </div>
          )}
          {files.map((file, index) => (
            <p key={index}>
              <FaFileAlt /> {file.name}
              <span
                onClick={() => setFiles(files.filter((_, i) => i !== index))}
              >
                ❌
              </span>
            </p>
          ))}
          <div className={styles.linkSection}>
            <h4>
              <FiLink /> Links
            </h4>

            {links.map((link, index) => (
              <input
                key={index}
                type="text"
                placeholder="Paste link here"
                value={link}
                onChange={(e) => updateLink(e.target.value, index)}
                className={styles.input}
              />
            ))}

            <button onClick={addLink} className={styles.addBtn}>
              + Add another link
            </button>
          </div>

          <div className={styles.commentSection}>
            <h4>
              <AiOutlineComment /> Comments
            </h4>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add notes or explanation"
              className={styles.textarea}
            />
          </div>

          <button onClick={submitWork} className={styles.submitBtn}>
            Submit Work
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskWork;
