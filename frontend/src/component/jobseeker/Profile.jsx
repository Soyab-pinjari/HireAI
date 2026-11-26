
import React, { useEffect, useState } from "react";
import {
    getJobSeekerProfile,
    updateJobSeekerProfile,
    uploadJobSeekerProfileImage,
    uploadJobSeekerResume 
} from "../../services/api";
import "./Profile.css";

function Profile() {
const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: "",
    experience: 0,
    education: "",
    profileImage: ""
});

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState("");
const [profileImage, setProfileImage] = useState("");
const [selectedImageName, setSelectedImageName] = useState("");
const [imageLoading, setImageLoading] = useState(false);
const [imageMessage, setImageMessage] = useState("");
const [resume, setResume] = useState(null);
const [resumeLoading, setResumeLoading] = useState(false);
const [resumeMessage, setResumeMessage] = useState("");
    // Fetch existing profile
   useEffect(() => {
    const fetchProfile = async () => {
        try {
            const res = await getJobSeekerProfile();
            const user = res.user;
            if (user) {
              setFormData({
                name: user.name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    location: user.location || "",
                    bio: user.bio || "",
                    skills: user.skills?.join(", ") || "",
                    experience: user.experience || 0,
                    education: user.education || "",
                    profileImage: user.profileImage || ""
                  });
                }
                setResume(user.resume || null);
                setProfileImage(user.profileImage || "");
        } catch (error) {
    console.log("STATUS:", error.response?.status);
    console.log("ERROR DATA:", error.response?.data);
    console.log("ERROR MESSAGE:", error.message);

    setMessage(
        error.response?.data?.message ||
        error.message ||
        "Profile update failed"
    );

        } finally {
            setFetching(false);
        }
    };

    fetchProfile();
}, []);

const handleResumeUpload = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
        setResumeMessage("Only PDF files are allowed");
        e.target.value = "";
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        setResumeMessage("Maximum resume size is 5MB");
        e.target.value = "";
        return;
    }

    try {

        setResumeLoading(true);
        setResumeMessage("");

        const res = await uploadJobSeekerResume(file);

        setResume(res.resume);

        setResumeMessage("Resume uploaded successfully!");

    } catch (error) {

        console.log("RESUME ERROR:", error);

        setResumeMessage(
            error.response?.data?.message ||
            "Resume upload failed"
        );

    } finally {
        setResumeLoading(false);
        e.target.value = "";
    }
};
const handleImageUpload = async (e) => {
   const file = e.target.files?.[0];

if (!file) return;

setSelectedImageName(file.name);
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
        setImageMessage("Only JPG, PNG and WEBP allowed");
        e.target.value = "";
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        setImageMessage("Image size must be below 2MB");
        e.target.value = "";
        return;
    }

    try {
        setImageLoading(true);
        setImageMessage("");

        const res = await uploadJobSeekerProfileImage(file);

        setProfileImage(res.profileImage);

        setImageMessage("Profile image updated successfully!");

    } catch (error) {
        console.log("IMAGE UPLOAD ERROR:", error);

        setImageMessage(
            error.response?.data?.message ||
            "Image upload failed"
        );

    } finally {
        setImageLoading(false);
        e.target.value = "";
    }
};

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Update profile
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");

            const payload = {
                ...formData,
                skills: formData.skills
                    .split(",")
                    .map(skill => skill.trim())
                    .filter(Boolean),
                experience: Number(formData.experience)
            };

            const res = await updateJobSeekerProfile(payload);

            setMessage(
                res.message || "Profile updated successfully!"
            );

        } catch (error) {
    console.log("STATUS:", error.response?.status);
    console.log("ERROR DATA:", error.response?.data);
    console.log("ERROR MESSAGE:", error.message);

    setMessage(
        error.response?.data?.message ||
        error.message ||
        "Profile update failed"
    );

        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="profile-page">Loading profile...</div>;
    }

    return (
        <div className="profile-page">

            <div className="profile-header">
                <div>
                    <h1>My Profile</h1>
                    <p>
                        Manage your personal information and professional profile.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>

                <div className="profile-card">

                    <div className="section-heading">
                        <div className="section-icon">👤</div>
                        <div>
                            <h2>Basic Information</h2>
                            <p>Add your personal details.</p>
                        </div>
                    </div>


<div className="company-logo-section">
  <label className="company-logo-label">
    Profile Image
  </label>

  <div className="company-logo-upload">
    {/* Image preview */}
    <div className="company-logo-preview">
      {profileImage ? (
        <img src={profileImage} alt="Profile Image" />
      ) : (
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
          <path d="M16 5h6M19 2v6" />
        </svg>
      )}
    </div>

    {/* File upload */}
    <div className="company-logo-content">
      <div className="company-logo-file-row">
        <label
          htmlFor="profile-image-input"
          className="company-logo-button"
        >
          {imageLoading ? "Uploading..." : "Choose File"}
        </label>

        <span className="company-logo-filename">
          No file chosen
        </span>

        <input
          id="profile-image-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageUpload}
          disabled={imageLoading}
          hidden
        />
      </div>

      <p className="company-logo-hint">
        PNG, JPG, JPEG or WEBP. Maximum size 2MB.
      </p>

      {imageMessage && (
        <small className="image-message">
          {imageMessage}
        </small>
      )}
    </div>
  </div>
</div>

                    <div className="form-grid mt-5">

 

  
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                            />

                        </div>
              <div className="form-group">
                  <label>Company Email / Email *</label>
                  <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      placeholder="Email"
                  />
                  </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="City, State, Country"
                            />
                        </div>

                    </div>
                </div>

                <div className="profile-card">

                    <div className="section-heading">
                        <div className="section-icon">💼</div>
                        <div>
                            <h2>Professional Information</h2>
                            <p>Tell us about your professional experience.</p>
                        </div>
                    </div>

                    <div className="form-grid">

                        <div className="form-group full-width">
                            <label>Skills</label>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="React, Node.js, MongoDB"
                            />
                            <small>Separate skills using commas.</small>
                        </div>

                        <div className="form-group">
                            <label>Experience (Years)</label>
                            <input
                                type="number"
                                name="experience"
                                min="0"
                                value={formData.experience}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Education</label>
                            <input
                                type="text"
                                name="education"
                                value={formData.education}
                                onChange={handleChange}
                                placeholder="B.Tech, BCA, MCA etc."
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>About Me</label>
                            <textarea
                                name="bio"
                                rows="5"
                                maxLength="500"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Write something about yourself..."
                            />
                            <small>
                                {formData.bio.length}/500 characters
                            </small>
                        </div>

                    </div>
                    <div className="resume-section">

    <div className="resume-icon">
        📄
    </div>

    <div className="resume-content">

        <h3>My Resume</h3>

        <p>
            Upload your latest resume to apply for jobs.
            Only PDF files (Max 5MB).
        </p>

        {resume ? (
            <div className="resume-file">

                <div className="resume-file-info">
                    <span className="pdf-icon">PDF</span>

                    <div>
                        <strong>{resume.originalName}</strong>
                        <small>
                            {(
                                resume.fileSize / (1024 * 1024)
                            ).toFixed(2)} MB
                        </small>
                    </div>
                </div>

                <a
    href={resume.fileUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="view-resume-btn"
>
    View Resume
</a>

            </div>
        ) : (
            <p className="no-resume">
                No resume uploaded yet.
            </p>
        )}

        <label className="resume-upload-btn">

            {resumeLoading
                ? "Uploading..."
                : resume
                    ? "Replace Resume"
                    : "Upload Resume"
            }

            <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleResumeUpload}
                disabled={resumeLoading}
                hidden
            />

        </label>

        {resumeMessage && (
            <small className="resume-message">
                {resumeMessage}
            </small>
        )}

    </div>

</div>
                </div>

                {message && (
                    <div className="profile-message">
                        {message}
                    </div>
                )}

                <div className="profile-actions">
                    <button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Profile"}
                    </button>
                </div>

            </form>
        </div>
    );
}

export default Profile;
