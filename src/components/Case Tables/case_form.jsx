"use client";

import { useState, useRef } from "react";
import "./case_form.css";

const CreateCaseForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    targetAmount: "",
    tags: "",
  });

  // upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // upload helpers
  const openFilePicker = () => fileInputRef.current?.click();
  const handleFile = (file) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const onInputChange = (e) => handleFile(e.target.files?.[0]);
  const prevent = (e) => e.preventDefault();
  const onDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Creating new case:", { ...formData, imageFile });
    // Handle form submission
  };

  return (
    <div className="create-case-form">
      <h2>Create New Case</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Case Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter case title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="targetAmount" className="form-label">
            Funding Goal
          </label>
          <input
            type="number"
            id="targetAmount"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter funding goal"
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Enter case description"
            rows="4"
            required
          />
        </div>

        {/* Upload */}
        <div className="form-group">
          <label className="form-label">Upload Image</label>
          <div
            className="upload-box"
            onClick={openFilePicker}
            onDragOver={prevent}
            onDragEnter={prevent}
            onDrop={onDrop}
            role="button"
            tabIndex={0}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Selected preview"
                className="upload-preview"
              />
            ) : (
              <div className="upload-empty">
                <svg
                  className="upload-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 3l4 4h-3v6h-2V7H8l4-4zM5 19h14v2H5z" />
                </svg>
                <p>Drag and drop an image, or click to browse</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={onInputChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tags" className="form-label">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter tags"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Publish Case
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCaseForm;
